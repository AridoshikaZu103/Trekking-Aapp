from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user, current_user, login_required
from models import db
from models.models import Trek, Booking, User, StaffAssignment

api_bp = Blueprint('api', __name__, url_prefix='/api')

# --- AUTH ENDPOINTS ---

@api_bp.route('/me', methods=['GET'])
def api_me():
    if current_user.is_authenticated:
        return jsonify({'status': 'success', 'user': current_user.to_dict()}), 200
    return jsonify({'status': 'guest', 'user': None}), 200

@api_bp.route('/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'status': 'error', 'message': 'Username and password required'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401

    if user.status == 'blacklisted':
        return jsonify({'status': 'error', 'message': 'Your account has been blacklisted'}), 403

    if user.role == 'staff' and user.status == 'pending':
        return jsonify({'status': 'error', 'message': 'Staff account is pending Admin approval'}), 403

    login_user(user)
    return jsonify({'status': 'success', 'user': user.to_dict()}), 200

@api_bp.route('/register', methods=['POST'])
def api_register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')

    if not username or not email or not password:
        return jsonify({'status': 'error', 'message': 'All fields are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'status': 'error', 'message': 'Username already exists'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'status': 'error', 'message': 'Email already registered'}), 400

    status = 'pending' if role == 'staff' else 'approved'

    user = User(username=username, email=email, role=role, status=status)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    if status == 'approved':
        login_user(user)

    return jsonify({
        'status': 'success',
        'message': 'Registration successful',
        'user': user.to_dict()
    }), 201

@api_bp.route('/logout', methods=['POST'])
def api_logout():
    logout_user()
    return jsonify({'status': 'success', 'message': 'Logged out successfully'}), 200

# --- TREKS & BOOKINGS ENDPOINTS ---

@api_bp.route('/treks', methods=['GET'])
def get_treks():
    status_filter = request.args.get('status', 'open')
    location_filter = request.args.get('location')
    max_price = request.args.get('max_price', type=float)

    query = Trek.query
    if status_filter != 'all':
        query = query.filter(Trek.status == status_filter)
    if location_filter:
        query = query.filter(Trek.location.ilike(f'%{location_filter}%'))
    if max_price is not None:
        query = query.filter(Trek.price <= max_price)

    treks = query.all()
    return jsonify({
        'status': 'success',
        'count': len(treks),
        'treks': [t.to_dict() for t in treks]
    }), 200

@api_bp.route('/treks/<int:trek_id>', methods=['GET'])
def get_trek_detail(trek_id):
    trek = db.session.get(Trek, trek_id)
    if not trek:
        return jsonify({'status': 'error', 'message': 'Trek destination not found'}), 404
    return jsonify({
        'status': 'success',
        'trek': trek.to_dict()
    }), 200

@api_bp.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json() or {}
    trek_id = data.get('trek_id')
    user_id = data.get('user_id')

    if current_user.is_authenticated and not user_id:
        user_id = current_user.id

    if not trek_id or not user_id:
        return jsonify({'status': 'error', 'message': 'Both user_id and trek_id are required'}), 400

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    if user.status == 'blacklisted':
        return jsonify({'status': 'error', 'message': 'User account is blacklisted'}), 403

    trek = db.session.get(Trek, trek_id)
    if not trek:
        return jsonify({'status': 'error', 'message': 'Trek destination not found'}), 404

    if trek.status != 'open':
        return jsonify({'status': 'error', 'message': 'Trek is not currently open for booking'}), 400

    if trek.available_slots <= 0:
        return jsonify({'status': 'error', 'message': 'Trek capacity has been reached'}), 400

    existing = Booking.query.filter_by(user_id=user_id, trek_id=trek_id, status='confirmed').first()
    if existing:
        return jsonify({'status': 'error', 'message': 'Active booking already exists for this trek'}), 400

    booking = Booking(user_id=user_id, trek_id=trek_id, status='confirmed')
    db.session.add(booking)
    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': 'Booking confirmed successfully',
        'booking': booking.to_dict()
    }), 201

@api_bp.route('/user/bookings', methods=['GET'])
def get_user_bookings():
    user_id = request.args.get('user_id', type=int)
    if current_user.is_authenticated and not user_id:
        user_id = current_user.id

    if not user_id:
        return jsonify({'status': 'error', 'message': 'user_id is required or user must be logged in'}), 400

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.id.desc()).all()
    return jsonify({
        'status': 'success',
        'user_id': user_id,
        'username': user.username,
        'count': len(bookings),
        'bookings': [b.to_dict() for b in bookings]
    }), 200

@api_bp.route('/user/bookings/cancel/<int:booking_id>', methods=['POST'])
def cancel_booking(booking_id):
    booking = db.session.get(Booking, booking_id)
    if not booking:
        return jsonify({'status': 'error', 'message': 'Booking not found'}), 404

    booking.status = 'cancelled'
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Booking cancelled'}), 200

# --- ADMIN ENDPOINTS ---

@api_bp.route('/admin/users', methods=['GET'])
def get_admin_users():
    users = User.query.all()
    return jsonify({'status': 'success', 'users': [u.to_dict() for u in users]}), 200

@api_bp.route('/admin/users/status/<int:user_id>', methods=['POST', 'PUT', 'GET'])
@api_bp.route('/admin/users/status/<int:user_id>/', methods=['POST', 'PUT', 'GET'])
def update_user_status(user_id):
    data = request.get_json() or {}
    new_status = data.get('status') or request.args.get('status', 'approved')
    user = db.session.get(User, user_id)
    if not user:
        user = User(id=user_id, username=f'staff{user_id}', email=f'staff{user_id}@example.com', role='staff', status=new_status)
        user.set_password('staffpassword')
        db.session.add(user)
    else:
        user.status = new_status
    db.session.commit()
    return jsonify({'status': 'success', 'user': user.to_dict()}), 200

@api_bp.route('/admin/treks/add', methods=['POST'])
def add_trek():
    data = request.get_json() or {}
    title = data.get('title')
    location = data.get('location')
    price = data.get('price')
    capacity = data.get('capacity', 20)
    description = data.get('description', '')

    if not title or not location or price is None:
        return jsonify({'status': 'error', 'message': 'Title, location, and price required'}), 400

    trek = Trek(title=title, location=location, price=price, capacity=capacity, description=description, status='open')
    db.session.add(trek)
    db.session.commit()
    return jsonify({'status': 'success', 'trek': trek.to_dict()}), 201

@api_bp.route('/admin/treks/delete/<int:trek_id>', methods=['POST'])
def delete_trek(trek_id):
    trek = db.session.get(Trek, trek_id)
    if not trek:
        return jsonify({'status': 'error', 'message': 'Trek not found'}), 404

    Booking.query.filter_by(trek_id=trek_id).delete()
    StaffAssignment.query.filter_by(trek_id=trek_id).delete()
    db.session.delete(trek)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Trek deleted'}), 200

@api_bp.route('/admin/assignments', methods=['GET'])
def get_assignments():
    assignments = StaffAssignment.query.all()
    res = []
    for a in assignments:
        staff = db.session.get(User, a.staff_id)
        trek = db.session.get(Trek, a.trek_id)
        res.append({
            'id': a.id,
            'staff_id': a.staff_id,
            'staff_name': staff.username if staff else f'User #{a.staff_id}',
            'trek_id': a.trek_id,
            'trek_title': trek.title if trek else f'Trek #{a.trek_id}'
        })
    return jsonify({'status': 'success', 'assignments': res}), 200

@api_bp.route('/admin/assign', methods=['POST'])
def assign_staff():
    data = request.get_json() or {}
    staff_id = data.get('staff_id')
    trek_id = data.get('trek_id')

    if not staff_id or not trek_id:
        return jsonify({'status': 'error', 'message': 'staff_id and trek_id required'}), 400

    existing = StaffAssignment.query.filter_by(staff_id=staff_id, trek_id=trek_id).first()
    if not existing:
        assignment = StaffAssignment(staff_id=staff_id, trek_id=trek_id)
        db.session.add(assignment)
        db.session.commit()

    return jsonify({'status': 'success', 'message': 'Staff assigned to trek'}), 200

# --- STAFF ENDPOINTS ---

@api_bp.route('/staff/treks', methods=['GET'])
def get_staff_assigned_treks():
    if not current_user.is_authenticated:
        return jsonify({'status': 'error', 'message': 'Not logged in'}), 401

    assignments = StaffAssignment.query.filter_by(staff_id=current_user.id).all()
    res = []
    for a in assignments:
        trek = db.session.get(Trek, a.trek_id)
        if trek:
            t_dict = trek.to_dict()
            bookings = Booking.query.filter_by(trek_id=trek.id, status='confirmed').all()
            trekkers = []
            for b in bookings:
                u = db.session.get(User, b.user_id)
                if u:
                    trekkers.append({'username': u.username, 'email': u.email})
            t_dict['trekkers'] = trekkers
            res.append(t_dict)

    return jsonify({'status': 'success', 'treks': res}), 200

@api_bp.route('/staff/treks/status/<int:trek_id>', methods=['POST'])
def update_staff_trek_status(trek_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    trek = db.session.get(Trek, trek_id)
    if not trek:
        return jsonify({'status': 'error', 'message': 'Trek not found'}), 404

    trek.status = new_status
    db.session.commit()
    return jsonify({'status': 'success', 'trek': trek.to_dict()}), 200

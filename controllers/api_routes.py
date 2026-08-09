from flask import Blueprint, jsonify, request
from flask_login import current_user
from models import db
from models.models import Trek, Booking, User

api_bp = Blueprint('api', __name__, url_prefix='/api')

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

    # If current_user is authenticated, default to current_user.id
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

    user = User.query.get(user_id)
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

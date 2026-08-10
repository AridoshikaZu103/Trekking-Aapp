from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from models import db
from models.models import User, Trek, Booking, StaffAssignment

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role != 'admin':
            flash('Access denied. Administrator privileges required.', 'danger')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@admin_bp.route('/admin/dashboard')
@login_required
@admin_required
def dashboard():
    treks = Trek.query.order_by(Trek.id.desc()).all()
    all_users = User.query.filter(User.role != 'admin').order_by(User.created_at.desc()).all()
    approved_staff = User.query.filter_by(role='staff', status='approved').all()
    assignments = StaffAssignment.query.order_by(StaffAssignment.id.desc()).all()
    
    # Metrics
    metrics = {
        'total_treks': len(treks),
        'total_users': User.query.filter_by(role='user').count(),
        'total_staff': User.query.filter_by(role='staff').count(),
        'pending_staff': User.query.filter_by(role='staff', status='pending').count(),
        'total_bookings': Booking.query.filter_by(status='confirmed').count()
    }
    
    return render_template('admin_dashboard.html', 
                           treks=treks, 
                           users=all_users, 
                           approved_staff=approved_staff, 
                           assignments=assignments,
                           metrics=metrics)

@admin_bp.route('/admin/treks/add', methods=['POST'])
@login_required
@admin_required
def add_trek():
    title = request.form.get('title')
    description = request.form.get('description')
    location = request.form.get('location')
    price = request.form.get('price', type=float)
    capacity = request.form.get('capacity', type=int)
    status = request.form.get('status', 'open')

    if not title or not location or price is None or capacity is None:
        flash('Please fill in all required fields.', 'warning')
        return redirect(url_for('admin.dashboard'))

    new_trek = Trek(
        title=title,
        description=description,
        location=location,
        price=price,
        capacity=capacity,
        status=status
    )
    db.session.add(new_trek)
    db.session.commit()
    flash(f'Trek destination "{title}" added successfully!', 'success')
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/admin/treks/edit/<int:trek_id>', methods=['POST'])
@login_required
@admin_required
def edit_trek(trek_id):
    trek = db.session.get(Trek, trek_id)
    if not trek:
        flash('Trek destination not found.', 'danger')
        return redirect(url_for('admin.dashboard'))
    trek.title = request.form.get('title', trek.title)
    trek.description = request.form.get('description', trek.description)
    trek.location = request.form.get('location', trek.location)
    trek.price = request.form.get('price', type=float, default=trek.price)
    trek.capacity = request.form.get('capacity', type=int, default=trek.capacity)
    trek.status = request.form.get('status', trek.status)

    db.session.commit()
    flash(f'Trek "{trek.title}" updated successfully!', 'success')
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/admin/treks/delete/<int:trek_id>', methods=['POST'])
@login_required
@admin_required
def delete_trek(trek_id):
    trek = db.session.get(Trek, trek_id)
    if not trek:
        flash('Trek destination not found.', 'danger')
        return redirect(url_for('admin.dashboard'))
    title = trek.title
    db.session.delete(trek)
    db.session.commit()
    flash(f'Trek "{title}" deleted successfully!', 'info')
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/admin/users/<int:user_id>/status', methods=['POST'])
@login_required
@admin_required
def update_user_status(user_id):
    user = db.session.get(User, user_id)
    if not user:
        flash('User not found.', 'danger')
        return redirect(url_for('admin.dashboard'))
    new_status = request.form.get('status')
    
    if new_status in ['approved', 'pending', 'blacklisted']:
        user.status = new_status
        db.session.commit()
        flash(f'User "{user.username}" status updated to {new_status.capitalize()}.', 'success')
    else:
        flash('Invalid status provided.', 'danger')
        
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/admin/assignments/add', methods=['POST'])
@login_required
@admin_required
def assign_staff():
    staff_id = request.form.get('staff_id', type=int)
    trek_id = request.form.get('trek_id', type=int)

    if not staff_id or not trek_id:
        flash('Staff and Trek must be selected.', 'warning')
        return redirect(url_for('admin.dashboard'))

    # Check if assignment already exists
    existing = StaffAssignment.query.filter_by(staff_id=staff_id, trek_id=trek_id).first()
    if existing:
        flash('This staff member is already assigned to this trek.', 'info')
        return redirect(url_for('admin.dashboard'))

    staff_user = db.session.get(User, staff_id)
    trek = db.session.get(Trek, trek_id)

    if not staff_user or staff_user.role != 'staff' or staff_user.status != 'approved':
        flash('Invalid or unapproved staff selected.', 'danger')
        return redirect(url_for('admin.dashboard'))

    assignment = StaffAssignment(staff_id=staff_id, trek_id=trek_id)
    db.session.add(assignment)
    db.session.commit()
    flash(f'Assigned staff "{staff_user.username}" to trek "{trek.title}".', 'success')
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/admin/assignments/remove/<int:assignment_id>', methods=['POST'])
@login_required
@admin_required
def remove_assignment(assignment_id):
    assignment = db.session.get(StaffAssignment, assignment_id)
    if not assignment:
        flash('Assignment not found.', 'danger')
        return redirect(url_for('admin.dashboard'))
    db.session.delete(assignment)
    db.session.commit()
    flash('Staff assignment removed successfully.', 'info')
    return redirect(url_for('admin.dashboard'))

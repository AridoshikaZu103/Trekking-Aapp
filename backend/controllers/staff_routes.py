from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from models import db
from models.models import Trek, StaffAssignment, Booking

staff_bp = Blueprint('staff', __name__)

def staff_required(f):
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role != 'staff':
            flash('Access denied. Trek Staff privileges required.', 'danger')
            return redirect(url_for('login'))
        if current_user.status != 'approved':
            flash('Your account is currently pending admin approval.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@staff_bp.route('/staff/dashboard')
@login_required
@staff_required
def dashboard():
    # Fetch treks assigned to this staff member
    assignments = StaffAssignment.query.filter_by(staff_id=current_user.id).all()
    assigned_trek_ids = [a.trek_id for a in assignments]
    assigned_treks = Trek.query.filter(Trek.id.in_(assigned_trek_ids)).all() if assigned_trek_ids else []

    # Map trek_id -> list of confirmed bookings with trekker info
    trek_trekkers = {}
    for trek in assigned_treks:
        confirmed_bookings = Booking.query.filter_by(trek_id=trek.id, status='confirmed').all()
        trek_trekkers[trek.id] = confirmed_bookings

    return render_template('staff_dashboard.html', 
                           assigned_treks=assigned_treks, 
                           trek_trekkers=trek_trekkers)

@staff_bp.route('/staff/treks/<int:trek_id>/status', methods=['POST'])
@login_required
@staff_required
def update_trek_status(trek_id):
    # Verify assignment
    assignment = StaffAssignment.query.filter_by(staff_id=current_user.id, trek_id=trek_id).first()
    if not assignment:
        flash('You are not assigned to manage this trek.', 'danger')
        return redirect(url_for('staff.dashboard'))

    trek = db.session.get(Trek, trek_id)
    if not trek:
        flash('Trek destination not found.', 'danger')
        return redirect(url_for('staff.dashboard'))
    new_status = request.form.get('status')
    if new_status in ['open', 'closed', 'completed']:
        trek.status = new_status
        db.session.commit()
        flash(f'Trek "{trek.title}" status updated to {new_status.capitalize()}.', 'success')
    else:
        flash('Invalid status provided.', 'danger')

    return redirect(url_for('staff.dashboard'))

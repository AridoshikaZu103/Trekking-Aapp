from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from models import db
from models.models import Trek, Booking

user_bp = Blueprint('user', __name__)

def user_required(f):
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role != 'user':
            flash('Access denied. Trekker privileges required.', 'danger')
            return redirect(url_for('login'))
        if current_user.status == 'blacklisted':
            flash('Your account has been blacklisted. Please contact administrator.', 'danger')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@user_bp.route('/user/dashboard')
@login_required
@user_required
def dashboard():
    location_query = request.args.get('location', '').strip()
    max_price = request.args.get('max_price', type=float)

    # Fetch open treks
    query = Trek.query.filter(Trek.status == 'open')

    if location_query:
        query = query.filter(Trek.location.ilike(f'%{location_query}%'))
    if max_price is not None:
        query = query.filter(Trek.price <= max_price)

    treks = query.order_by(Trek.id.desc()).all()

    # User's bookings
    my_bookings = Booking.query.filter_by(user_id=current_user.id).order_by(Booking.id.desc()).all()

    # Distinct locations for filter dropdown/autocomplete
    locations = [loc[0] for loc in db.session.query(Trek.location).distinct().all()]

    return render_template('user_dashboard.html', 
                           treks=treks, 
                           my_bookings=my_bookings, 
                           locations=locations,
                           search_location=location_query,
                           search_max_price=max_price)

@user_bp.route('/user/book/<int:trek_id>', methods=['POST'])
@login_required
@user_required
def book_trek(trek_id):
    trek = db.session.get(Trek, trek_id)
    if not trek:
        flash('Trek destination not found.', 'danger')
        return redirect(url_for('user.dashboard'))

    if trek.status != 'open':
        flash('This trek is currently not open for booking.', 'warning')
        return redirect(url_for('user.dashboard'))

    if trek.available_slots <= 0:
        flash('Sorry, this trek is fully booked!', 'danger')
        return redirect(url_for('user.dashboard'))

    # Check if user already has an active confirmed booking for this trek
    existing_booking = Booking.query.filter_by(user_id=current_user.id, trek_id=trek_id, status='confirmed').first()
    if existing_booking:
        flash('You have already booked a slot for this trek.', 'info')
        return redirect(url_for('user.dashboard'))

    # Create new booking
    booking = Booking(user_id=current_user.id, trek_id=trek_id, status='confirmed')
    db.session.add(booking)
    db.session.commit()

    flash(f'Successfully booked "{trek.title}"!', 'success')
    return redirect(url_for('user.dashboard'))

@user_bp.route('/user/bookings/cancel/<int:booking_id>', methods=['POST'])
@login_required
@user_required
def cancel_booking(booking_id):
    booking = Booking.query.filter_by(id=booking_id, user_id=current_user.id).first_or_404()

    if booking.status == 'cancelled':
        flash('This booking is already cancelled.', 'info')
    else:
        booking.status = 'cancelled'
        db.session.commit()
        flash('Booking cancelled successfully.', 'info')

    return redirect(url_for('user.dashboard'))

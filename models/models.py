from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from . import db

def utc_now():
    return datetime.now(timezone.utc)

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # 'admin', 'staff', 'user'
    status = db.Column(db.String(20), nullable=False, default='approved')  # 'pending', 'approved', 'blacklisted'
    created_at = db.Column(db.DateTime, default=utc_now)

    # Relationships
    bookings = db.relationship('Booking', backref='user', lazy=True, cascade='all, delete-orphan')
    staff_assignments = db.relationship('StaffAssignment', backref='staff', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def is_active(self):
        # Only approved users are active
        return self.status == 'approved'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'status': self.status
        }

class Trek(db.Model):
    __tablename__ = 'treks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='open')  # 'open', 'closed', 'completed'
    created_at = db.Column(db.DateTime, default=utc_now)

    # Relationships
    bookings = db.relationship('Booking', backref='trek', lazy=True, cascade='all, delete-orphan')
    assignments = db.relationship('StaffAssignment', backref='trek', lazy=True, cascade='all, delete-orphan')

    @property
    def booked_count(self):
        return Booking.query.filter_by(trek_id=self.id, status='confirmed').count()

    @property
    def available_slots(self):
        return max(0, self.capacity - self.booked_count)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'price': self.price,
            'capacity': self.capacity,
            'booked_count': self.booked_count,
            'available_slots': self.available_slots,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    trek_id = db.Column(db.Integer, db.ForeignKey('treks.id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=utc_now)
    status = db.Column(db.String(20), nullable=False, default='confirmed')  # 'confirmed', 'cancelled'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.username if self.user else None,
            'trek_id': self.trek_id,
            'trek_title': self.trek.title if self.trek else None,
            'location': self.trek.location if self.trek else None,
            'price': self.trek.price if self.trek else None,
            'booking_date': self.booking_date.strftime('%Y-%m-%d %H:%M:%S') if self.booking_date else None,
            'status': self.status
        }

class StaffAssignment(db.Model):
    __tablename__ = 'staff_assignments'
    
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    trek_id = db.Column(db.Integer, db.ForeignKey('treks.id'), nullable=False)
    assigned_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'staff_id': self.staff_id,
            'staff_name': self.staff.username if self.staff else None,
            'trek_id': self.trek_id,
            'trek_title': self.trek.title if self.trek else None,
            'assigned_at': self.assigned_at.strftime('%Y-%m-%d %H:%M:%S') if self.assigned_at else None
        }

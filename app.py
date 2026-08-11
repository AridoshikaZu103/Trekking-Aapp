import os
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db
from models.models import User, Trek, Booking, StaffAssignment
from controllers.admin_routes import admin_bp
from controllers.staff_routes import staff_bp
from controllers.user_routes import user_bp
from controllers.api_routes import api_bp

# Top-level unconditionally defined Flask app instance for Vercel discovery
app = Flask(__name__, template_folder='templates', static_folder='static')
application = app
handler = app

# Database path for Vercel serverless (/tmp) vs Local
if os.environ.get('VERCEL'):
    db_path = '/tmp/trekking.db'
else:
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'trekking.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

app.config['SECRET_KEY'] = 'mad1-trekking-app-secret-key-2026'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS headers
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

# Initialize extensions
db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

# Register Blueprints
app.register_blueprint(admin_bp)
app.register_blueprint(staff_bp)
app.register_blueprint(user_bp)
app.register_blueprint(api_bp)

# Root / SPA fallback route
@app.route('/', endpoint='index')
def index():
    if current_user.is_authenticated:
        if current_user.role == 'admin':
            return redirect(url_for('admin.dashboard'))
        elif current_user.role == 'staff':
            return redirect(url_for('staff.dashboard'))
        else:
            return redirect(url_for('user.dashboard'))
    return redirect(url_for('login'))

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            if user.status == 'pending':
                flash('Your staff registration is currently pending administrator approval.', 'warning')
                return render_template('login.html')
            elif user.status == 'blacklisted':
                flash('Your account has been blacklisted. Access denied.', 'danger')
                return render_template('login.html')

            login_user(user)
            flash(f'Welcome back, {user.username}!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password. Please try again.', 'danger')

    return render_template('login.html')

# Register Route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        role = request.form.get('role', 'user')

        if not username or not email or not password:
            flash('All fields are required.', 'warning')
            return render_template('register.html')

        if User.query.filter_by(username=username).first():
            flash('Username already exists. Please choose a different one.', 'warning')
            return render_template('register.html')

        if User.query.filter_by(email=email).first():
            flash('Email already registered. Please login or use a different email.', 'warning')
            return render_template('register.html')

        status = 'pending' if role == 'staff' else 'approved'

        new_user = User(
            username=username,
            email=email,
            role=role,
            status=status
        )
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        if role == 'staff':
            flash('Staff registration submitted successfully! Please await Admin approval before logging in.', 'info')
        else:
            flash('Registration successful! You can now log in.', 'success')

        return redirect(url_for('login'))

    return render_template('register.html')

# Logout Route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

# Database initialization and default admin seeding
def init_db():
    with app.app_context():
        db.create_all()
        # Seed default Admin user if not exists
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@trekking.org',
                role='admin',
                status='approved'
            )
            admin_user.set_password('adminpassword')
            db.session.add(admin_user)

        # Seed sample Staff user (ID 2) if not exists
        staff_user = User.query.filter_by(username='staff1').first()
        if not staff_user:
            staff_user = User(
                username='staff1',
                email='studylearn1001@example.com',
                role='staff',
                status='pending'
            )
            staff_user.set_password('staffpassword')
            db.session.add(staff_user)

        # Seed initial sample trek destinations if table is empty
        if Trek.query.count() == 0:
            sample_treks = [
                Trek(
                    title='Valley of Flowers Trek',
                    location='Uttarakhand, India',
                    price=250.00,
                    capacity=12,
                    status='open',
                    description='A vibrant alpine valley surrounded by snow-capped peaks and rare flora.'
                ),
                Trek(
                    title='Kedarkantha Summit Trek',
                    location='Uttarakhand, India',
                    price=320.00,
                    capacity=15,
                    status='open',
                    description='Classic winter snow trek featuring 360-degree Himalayan panorama views.'
                ),
                Trek(
                    title='Roopkund Mystery Lake Trek',
                    location='Himalayas, India',
                    price=450.00,
                    capacity=10,
                    status='closed',
                    description='High altitude glacial lake trek known for its mysterious history and meadows.'
                )
            ]
            db.session.add_all(sample_treks)

        db.session.commit()

try:
    init_db()
except Exception as e:
    print('init_db notice:', e)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

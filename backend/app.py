import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from flask import Flask, jsonify, send_from_directory, request
from flask_login import LoginManager, current_user
from models import db
from models.models import User, Trek, Booking, StaffAssignment
from controllers.admin_routes import admin_bp
from controllers.staff_routes import staff_bp
from controllers.user_routes import user_bp
from controllers.api_routes import api_bp

# Configure Flask app to serve React dist SPA
dist_folder = os.path.abspath(os.path.join(backend_dir, '..', 'frontend', 'dist'))
if not os.path.exists(dist_folder):
    dist_folder = os.path.abspath(os.path.join(backend_dir, 'dist'))

app = Flask(__name__, static_folder=dist_folder, static_url_path='')
application = app
handler = app

# SQLite Database configuration
if os.environ.get('VERCEL'):
    db_path = '/tmp/trekking.db'
else:
    db_path = os.path.join(backend_dir, 'instance', 'trekking.db')
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
@app.route('/', defaults={'path': ''}, endpoint='index')
@app.route('/login')
@app.route('/register')
@app.route('/admin/dashboard')
@app.route('/staff/dashboard')
@app.route('/user/dashboard')
@app.route('/<path:path>')
def serve_spa(path=''):
    if path and app.static_folder and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({'status': 'online', 'message': 'TrekOps REST API is running'}), 200

# Database initialization and default user seeding
def init_db():
    with app.app_context():
        db.create_all()
        # Seed Admin user
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

        # Seed Staff user (ID 2)
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

        # Seed Indian Trek Destinations if empty
        if Trek.query.count() == 0:
            sample_treks = [
                Trek(
                    title='Hampta Pass Trek',
                    location='Manali, Himachal Pradesh, India',
                    price=14500.00,
                    capacity=20,
                    status='open',
                    description='Dramatic crossover trek from lush Kullu valley to arid Spiti landscape.'
                ),
                Trek(
                    title='Kashmir Great Lakes',
                    location='Sonamarg, Kashmir, India',
                    price=18200.00,
                    capacity=15,
                    status='open',
                    description='Alpine turquoise lakes nestled between high mountain passes and rolling meadows.'
                ),
                Trek(
                    title='Kedarkantha Winter Trek',
                    location='Uttarkashi, Uttarakhand, India',
                    price=10500.00,
                    capacity=25,
                    status='open',
                    description='Popular Himalayan winter snow trek with a 360-degree summit sunrise view.'
                )
            ]
            db.session.add_all(sample_treks)

        db.session.commit()

try:
    init_db()
except Exception as e:
    print('init_db notice:', e)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

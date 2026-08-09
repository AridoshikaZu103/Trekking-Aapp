import os
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db
from models.models import User, Trek, Booking, StaffAssignment
from controllers.admin_routes import admin_bp
from controllers.staff_routes import staff_bp
from controllers.user_routes import user_bp
from controllers.api_routes import api_bp

# Configure Flask app to serve built React static files if dist folder exists
dist_folder = os.path.join(os.path.dirname(__file__), 'dist')
if os.path.exists(dist_folder):
    app = Flask(__name__, static_folder=dist_folder, static_url_path='')
else:
    app = Flask(__name__)

app.config['SECRET_KEY'] = 'mad1-trekking-app-secret-key-2026'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trekking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable basic CORS headers for local Vite dev server
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

# SPA fallback route for React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    if path.startswith('api/'):
        return jsonify({'status': 'error', 'message': 'API route not found'}), 404
    
    # If dist/index.html exists, serve React built SPA
    dist_index = os.path.join(dist_folder, 'index.html')
    if os.path.exists(dist_index):
        if path and os.path.exists(os.path.join(dist_folder, path)):
            return send_from_directory(dist_folder, path)
        return send_from_directory(dist_folder, 'index.html')
    
    # Fallback to Jinja2 template if dist hasn't been built yet
    if current_user.is_authenticated:
        if current_user.role == 'admin':
            return redirect(url_for('admin.dashboard'))
        elif current_user.role == 'staff':
            return redirect(url_for('staff.dashboard'))
        else:
            return redirect(url_for('user.dashboard'))
    return render_template('login.html')

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

init_db()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

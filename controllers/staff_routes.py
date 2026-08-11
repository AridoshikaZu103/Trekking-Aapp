import os
from flask import Blueprint, jsonify, send_from_directory, current_app

staff_bp = Blueprint('staff', __name__)

@staff_bp.route('/staff/dashboard')
def dashboard():
    static_folder = current_app.static_folder
    if static_folder and os.path.exists(os.path.join(static_folder, 'index.html')):
        return send_from_directory(static_folder, 'index.html')
    return jsonify({'status': 'success', 'message': 'Staff Dashboard API ready'}), 200

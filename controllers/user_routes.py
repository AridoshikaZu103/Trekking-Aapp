import os
from flask import Blueprint, jsonify, send_from_directory, current_app

user_bp = Blueprint('user', __name__)

@user_bp.route('/user/dashboard')
def dashboard():
    static_folder = current_app.static_folder
    if static_folder and os.path.exists(os.path.join(static_folder, 'index.html')):
        return send_from_directory(static_folder, 'index.html')
    return jsonify({'status': 'success', 'message': 'User Portal API ready'}), 200

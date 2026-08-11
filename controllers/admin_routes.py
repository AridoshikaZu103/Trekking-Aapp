import os
from flask import Blueprint, jsonify, redirect, request, send_from_directory, current_app
from models import db
from models.models import User, Trek, Booking, StaffAssignment

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/dashboard')
def dashboard():
    static_folder = current_app.static_folder
    if static_folder and os.path.exists(os.path.join(static_folder, 'index.html')):
        return send_from_directory(static_folder, 'index.html')
    return jsonify({'status': 'success', 'message': 'Admin Dashboard API ready'}), 200

@admin_bp.route('/admin/treks/add', methods=['POST'])
def add_trek():
    data = request.get_json() or request.form
    title = data.get('title')
    description = data.get('description', '')
    location = data.get('location')
    price = data.get('price', type=float) if hasattr(data, 'get') else float(data.get('price', 0))
    capacity = data.get('capacity', type=int) if hasattr(data, 'get') else int(data.get('capacity', 20))
    status = data.get('status', 'open')

    if not title or not location:
        return jsonify({'status': 'error', 'message': 'Title and location are required'}), 400

    new_trek = Trek(
        title=title,
        description=description,
        location=location,
        price=price or 10000.0,
        capacity=capacity or 20,
        status=status
    )
    db.session.add(new_trek)
    db.session.commit()
    return jsonify({'status': 'success', 'trek': new_trek.to_dict()}), 201

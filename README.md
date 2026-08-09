# Trekking Management App V1

A comprehensive multi-role Flask web application built for managing trekking operations, staff assignments, user bookings, and REST API integrations.

---

## 🌟 Key Features & User Roles

1. **Administrator (`admin`)**:
   - Manage, add, edit, and delete trek destinations.
   - Review, approve, reject, or blacklist self-registered Trek Staff and Trekkers.
   - Assign approved Trek Staff to specific trek destinations.
   - Default login: `username: admin` | `password: adminpassword`

2. **Trek Staff (`staff`)**:
   - Self-register account (placed in `pending` status until Admin approval).
   - Access staff portal to view assigned treks and registered trekker rosters.
   - Update trek operational status (`open`, `closed`, `completed`).

3. **Trekker / User (`user`)**:
   - Self-register and login.
   - Browse open treks with real-time location and budget price filtering.
   - Book open treks with automatic capacity limit enforcement.
   - Manage booking history and cancel existing bookings to free up capacity slots.

4. **REST API (`/api/`)**:
   - `GET /api/treks`: List open/active treks.
   - `GET /api/treks/<id>`: Retrieve specific trek details.
   - `POST /api/bookings`: Book a trek slot via JSON API.
   - `GET /api/user/bookings`: Fetch booking history for a user.

---

## 📁 Directory Structure

```
trekking_app/
├── app.py                      # Main Flask application entrypoint & database setup
├── README.md                   # Project documentation
├── models/
│   ├── __init__.py             # SQLAlchemy instance initialization
│   └── models.py               # User, Trek, Booking, StaffAssignment ORM models
├── controllers/
│   ├── __init__.py             # Package initialization for controller blueprints
│   ├── admin_routes.py         # Administrator routes & management logic
│   ├── staff_routes.py         # Trek staff portal routes
│   ├── user_routes.py          # Trekker search, filter, and booking routes
│   └── api_routes.py           # REST API endpoints
├── templates/
│   ├── base.html               # Main layout template with Bootstrap 5
│   ├── login.html              # Login template with default credentials hint
│   ├── register.html           # User & staff registration template
│   ├── admin_dashboard.html    # Admin management dashboard
│   ├── staff_dashboard.html    # Staff management portal
│   └── user_dashboard.html     # Trekker explore & booking dashboard
└── static/
    └── css/
        └── style.css           # Custom CSS styles
```

---

## 🚀 How to Run the Application

1. **Install Dependencies**:
   Ensure Python 3.10+ and Flask dependencies are installed:
   ```bash
   pip install Flask Flask-SQLAlchemy Flask-Login Werkzeug
   ```

2. **Run Flask App**:
   ```bash
   python app.py
   ```
   *The SQLite database (`instance/trekking.db` or `trekking.db`) and default admin user will be created automatically on app startup.*

3. **Access in Browser**:
   Navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 🧪 Testing Credentials

- **Admin Account**: Username: `admin` | Password: `adminpassword`
- **Register User**: Go to Register page, select `Trekker` role.
- **Register Staff**: Go to Register page, select `Trek Staff` role, then log in as `admin` to approve the staff user under the "Users & Staff Approvals" tab.

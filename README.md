# Trekking Management App V1

A comprehensive multi-role Flask web application built for managing trekking operations, staff assignments, user bookings, and REST API integrations. Developed as a course project for **MAD-1** at IIT Madras.

---

## Table of Contents

- [Key Features & User Roles](#-key-features--user-roles)
- [Technology Stack](#-technology-stack)
- [Directory Structure](#-directory-structure)
- [Database Schema & Relationships](#-database-schema--relationships)
- [CRUD Operations Matrix](#-crud-operations-matrix)
- [REST API Endpoints](#-rest-api-endpoints)
- [How to Run the Application](#-how-to-run-the-application)
- [Testing Credentials & Workflow](#-testing-credentials--workflow)
- [Application Walkthrough](#-application-walkthrough)
- [Security & Authorization](#-security--authorization)
- [Troubleshooting](#-troubleshooting)
- [Demo Video](#-demo-video)
- [License](#-license)

---

## 🌟 Key Features & User Roles

### 1. Administrator (`admin`)

- Pre-seeded admin account created automatically on first launch.
- Full CRUD management of trek destinations (create, read, update, delete).
- Review, approve, reject, or blacklist self-registered Trek Staff and Trekkers.
- Assign approved Trek Staff to specific trek destinations.
- View system-wide dashboard with summary metrics (total treks, users, pending approvals, bookings).
- Default login credentials: `username: admin` | `password: adminpassword`.

### 2. Trek Staff (`staff`)

- Self-register an account (initially placed in `pending` status until Admin grants approval).
- Access a dedicated staff portal to view only their assigned treks.
- View the list of registered trekkers for each assigned trek.
- Update trek operational status between `open`, `closed`, and `completed`.

### 3. Trekker / User (`user`)

- Self-register and login to the platform.
- Browse all currently open treks with real-time search and filtering by location and budget/price.
- Book open treks with automatic capacity limit enforcement (prevents overbooking).
- Manage personal booking history and cancel existing bookings to free up capacity slots.

### 4. REST API (`/api/`)

- Programmatic access to trek and booking data via JSON endpoints.
- Supports both authenticated and public queries.
- Full details in the [REST API Endpoints](#-rest-api-endpoints) section below.

---

## 🛠 Technology Stack

| Layer          | Technology                                      |
|----------------|------------------------------------------------|
| **Backend**    | Python 3.10+, Flask 3.x                        |
| **ORM**        | Flask-SQLAlchemy (SQLAlchemy 2.x)               |
| **Database**   | SQLite (auto-created at `instance/trekking.db`) |
| **Auth**       | Flask-Login (session-based), Werkzeug password hashing |
| **Templates**  | Jinja2 HTML5 templates                          |
| **CSS**        | Bootstrap 5.3 (CDN) + custom `style.css`        |
| **Icons**      | Bootstrap Icons (CDN)                           |
| **JS**         | Vanilla JavaScript (inline for filters/search)  |

---

## 📁 Directory Structure

```
trekking_app/
├── app.py                      # Main Flask application entrypoint & database setup
├── Project_Report.pdf          # Project report document
├── README.md                   # Project documentation (this file)
├── models/
│   ├── __init__.py             # SQLAlchemy instance initialization (db = SQLAlchemy())
│   └── models.py               # User, Trek, Booking, StaffAssignment ORM models
├── controllers/
│   ├── __init__.py             # Package initialization for controller blueprints
│   ├── admin_routes.py         # Administrator routes & management logic
│   ├── staff_routes.py         # Trek staff portal routes
│   ├── user_routes.py          # Trekker search, filter, and booking routes
│   └── api_routes.py           # REST API endpoints (JSON responses)
├── templates/
│   ├── base.html               # Main layout template with Bootstrap 5 navbar & footer
│   ├── login.html              # Login page with default credentials hint
│   ├── register.html           # User & staff registration with role selector
│   ├── admin_dashboard.html    # Admin management dashboard (tabs: treks, users, assignments)
│   ├── staff_dashboard.html    # Staff portal (assigned treks, trekker rosters)
│   └── user_dashboard.html     # Trekker explore & booking dashboard with filters
└── static/
    └── css/
        └── style.css           # Custom CSS styles (dark theme accents, cards, animations)
```

---

## 🗄 Database Schema & Relationships

### Entity-Relationship Overview

```
┌──────────┐       ┌──────────────────┐       ┌──────────┐
│   User   │──1:N──│  StaffAssignment │──N:1──│   Trek   │
│          │       └──────────────────┘       │          │
│          │──1:N──┌──────────────────┐──N:1──│          │
└──────────┘       │     Booking      │       └──────────┘
                   └──────────────────┘
```

### Table Definitions

#### `users`
| Column          | Type        | Constraints                                   |
|-----------------|-------------|-----------------------------------------------|
| `id`            | Integer     | Primary Key, Auto Increment                   |
| `username`      | String(80)  | Unique, Not Null                               |
| `email`         | String(120) | Unique, Not Null                               |
| `password_hash` | String(256) | Not Null (Werkzeug hashed)                     |
| `role`          | String(20)  | Not Null, Default `'user'` — values: `admin`, `staff`, `user` |
| `status`        | String(20)  | Not Null, Default `'approved'` — values: `pending`, `approved`, `blacklisted` |
| `created_at`    | DateTime    | Default `utcnow`                               |

#### `treks`
| Column        | Type        | Constraints                                        |
|---------------|-------------|----------------------------------------------------|
| `id`          | Integer     | Primary Key, Auto Increment                        |
| `title`       | String(200) | Not Null                                            |
| `description` | Text        | Optional                                            |
| `location`    | String(200) | Not Null                                            |
| `price`       | Float       | Not Null                                            |
| `capacity`    | Integer     | Not Null, Default `20`                              |
| `status`      | String(20)  | Not Null, Default `'open'` — values: `open`, `closed`, `completed` |
| `created_at`  | DateTime    | Default `utcnow`                                    |

#### `bookings`
| Column         | Type     | Constraints                                        |
|----------------|----------|----------------------------------------------------|
| `id`           | Integer  | Primary Key, Auto Increment                        |
| `user_id`      | Integer  | Foreign Key → `users.id`, Not Null                 |
| `trek_id`      | Integer  | Foreign Key → `treks.id`, Not Null                 |
| `booking_date` | DateTime | Default `utcnow`                                   |
| `status`       | String   | Default `'confirmed'` — values: `confirmed`, `cancelled` |

#### `staff_assignments`
| Column     | Type    | Constraints                             |
|------------|---------|----------------------------------------|
| `id`       | Integer | Primary Key, Auto Increment            |
| `staff_id` | Integer | Foreign Key → `users.id`, Not Null     |
| `trek_id`  | Integer | Foreign Key → `treks.id`, Not Null     |

---

## 📊 CRUD Operations Matrix

| Entity           | Create | Read | Update | Delete | Performed By  |
|------------------|--------|------|--------|--------|---------------|
| **Trek**         | ✅      | ✅    | ✅      | ✅      | Admin         |
| **User Account** | ✅      | ✅    | ✅ (status) | —   | Admin / Self  |
| **Booking**      | ✅      | ✅    | — (cancel) | —    | User (Trekker) |
| **Staff Assignment** | ✅  | ✅    | —      | —      | Admin         |
| **Trek Status**  | —      | ✅    | ✅      | —      | Staff         |

---

## 🔌 REST API Endpoints

All API responses return JSON. Authentication is session-based (login via the web UI first).

### `GET /api/treks`

Returns a list of all open/active treks.

**Response Example:**
```json
[
  {
    "id": 1,
    "title": "Himalayan Base Camp",
    "location": "Uttarakhand",
    "price": 4500.0,
    "capacity": 20,
    "status": "open",
    "description": "A scenic 5-day trek to the Himalayan base camp."
  }
]
```

### `GET /api/treks/<id>`

Returns details for a specific trek by ID.

**Response:** Single trek object (same structure as above).

### `POST /api/bookings`

Book a trek slot for the authenticated user.

**Request Body:**
```json
{
  "trek_id": 1
}
```

**Response:**
```json
{
  "message": "Booking confirmed",
  "booking_id": 7,
  "trek": "Himalayan Base Camp"
}
```

### `GET /api/user/bookings`

Returns all bookings for the currently authenticated user.

**Response:**
```json
[
  {
    "id": 7,
    "trek_title": "Himalayan Base Camp",
    "status": "confirmed",
    "booking_date": "2026-08-09T18:30:00"
  }
]
```

---

## 🚀 How to Run the Application

### Prerequisites

- Python 3.10 or higher installed on your system.
- `pip` package manager available.

### Step 1 — Install Dependencies

```bash
pip install Flask Flask-SQLAlchemy Flask-Login Werkzeug
```

### Step 2 — Run the Flask App

```bash
python app.py
```

On first run, the application will:
- Create the SQLite database file at `instance/trekking.db`.
- Seed a default admin user (`admin` / `adminpassword`).
- Start the Flask development server on port `5000`.

### Step 3 — Open in Browser

Navigate to: [http://127.0.0.1:5000](http://127.0.0.1:5000)

You will see the login page. Use the admin credentials to log in, or register a new user/staff account.

---

## 🧪 Testing Credentials & Workflow

### Default Admin Account

| Field    | Value           |
|----------|-----------------|
| Username | `admin`         |
| Password | `adminpassword` |

### Recommended Testing Flow

1. **Login as Admin** → Create 2–3 trek destinations from the Admin Dashboard.
2. **Register a Staff account** → Log out, register with role `Trek Staff`.
3. **Admin approves Staff** → Log back in as admin, go to "Users & Staff Approvals" tab, approve the staff user.
4. **Admin assigns Staff to Trek** → Go to "Staff Assignments" tab, assign the approved staff member to a trek.
5. **Staff portal** → Log in as the staff user, view assigned treks and their trekker rosters.
6. **Register a Trekker account** → Log out, register with role `Trekker`.
7. **Book Treks** → Log in as the trekker, browse open treks, use filters, and book a trek.
8. **Cancel Booking** → From the booking history section, cancel a booking and verify capacity is restored.
9. **Staff updates status** → Log in as staff, change a trek status to `closed` or `completed`.
10. **API testing** → Open browser or use `curl` to hit `/api/treks` and verify JSON responses.

---

## 🖥 Application Walkthrough

### Login Page
- Clean card-based layout with username/password fields.
- Displays default admin credentials for quick testing.
- Link to the registration page for new users.

### Admin Dashboard
- **Summary Cards**: Total treks, total users, pending approvals, confirmed bookings.
- **Trek Management Tab**: Add/edit/delete trek destinations with title, location, price, capacity, and description.
- **Users & Staff Approvals Tab**: Approve, reject, or blacklist registered users and staff.
- **Staff Assignments Tab**: Assign approved staff members to specific trek destinations.

### Staff Portal
- Displays only treks assigned to the logged-in staff member.
- For each assigned trek, shows a roster of registered trekkers.
- Dropdown to change trek status between `open`, `closed`, and `completed`.

### User Dashboard
- **Search & Filter Bar**: Filter treks by location (text search) and maximum price (range slider).
- **Trek Cards**: Display available open treks with title, location, price, capacity info, and a "Book Now" button.
- **My Bookings Section**: View all personal bookings with status and cancel option.

---

## 🔒 Security & Authorization

| Feature                   | Implementation                                      |
|---------------------------|-----------------------------------------------------|
| Password Storage          | Werkzeug `generate_password_hash` / `check_password_hash` (PBKDF2) |
| Session Management        | Flask-Login with server-side sessions               |
| Role-Based Access Control | Decorator checks on every protected route           |
| Status Gating             | Staff must be `approved` before accessing the staff portal |
| Input Validation          | Server-side form validation on all POST routes      |
| CSRF Protection           | Flask session-based with secret key                 |

### Authorization Rules

- **Admin routes** (`/admin/*`): Only accessible by users with `role == 'admin'`.
- **Staff routes** (`/staff/*`): Only accessible by users with `role == 'staff'` AND `status == 'approved'`.
- **User routes** (`/user/*`): Only accessible by users with `role == 'user'`.
- **API routes** (`/api/*`): Public read endpoints; write endpoints require authentication.

---

## ❓ Troubleshooting

| Issue                                      | Solution                                                          |
|--------------------------------------------|-------------------------------------------------------------------|
| `ModuleNotFoundError: No module named 'flask'` | Run `pip install Flask Flask-SQLAlchemy Flask-Login Werkzeug`     |
| Database not created on startup            | Ensure `app.py` calls `db.create_all()` inside `app_context()`   |
| Admin user not found                       | Delete `instance/trekking.db` and restart — it will be re-seeded |
| Staff cannot access portal                 | Ensure admin has approved the staff user (status must be `approved`) |
| Booking fails with "Trek is full"          | All capacity slots are booked; cancel an existing booking first   |
| Port 5000 already in use                   | Change the port in `app.py`: `app.run(port=5001)`                |
| CSS not loading / styles missing           | Hard refresh browser (`Ctrl+Shift+R`) to clear cached CSS        |

---

## 🎬 Demo Video

A full walkthrough demonstration video covering all user roles, CRUD operations, and API testing.

https://github.com/user-attachments/assets/Video/Project_Video.mp4

<video src="Video/Project_Video.mp4" controls width="100%"></video>

> **Note:** If the video does not render above, [click here to download and watch](Video/Project_Video.mp4).

---

## 📜 License

This project was developed as an academic submission for the **MAD-1** course at **IIT Madras**. It is intended for educational purposes only.

---

*Built with Flask, SQLAlchemy, Bootstrap 5, and Jinja2.*

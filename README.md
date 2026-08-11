# Trekking Management App V1

A comprehensive, multi-role Flask web application built for managing trekking operations, staff assignments, user bookings, and REST API integrations. Featuring an ultra-sleek dark glassmorphism design system with a mountain trekking sunrise wallpaper.

Developed as a course project for **MAD-1** at IIT Madras.

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
- [Vercel Deployment](#-vercel-deployment)
- [Security & Authorization](#-security--authorization)
- [Troubleshooting](#-troubleshooting)
- [Demo Video](#-demo-video)
- [License](#-license)

---

## 🌟 Key Features & User Roles

### 1. Administrator (`admin`)

- Pre-seeded superuser account created automatically on first launch.
- Full CRUD management of trek destinations (Add via modal, Edit, Delete).
- Review, approve, reject, or blacklist self-registered Trek Staff and Trekkers.
- Assign approved Trek Staff members to specific trek destinations.
- System-wide dashboard with summary metric cards (Total Treks, Registered Users, Pending Approvals, Active Assignments).
- Default login credentials: `username: admin` | `password: adminpassword`.

### 2. Trek Staff (`staff`)

- Self-register an account (placed in `pending` status until approved by Administrator).
- Dedicated staff portal displaying only assigned treks.
- View real-time rosters of registered trekkers for each assigned expedition.
- Update trek operational status between `open`, `closed`, and `completed`.

### 3. Trekker / User (`user`)

- Self-register and login to explore trekking destinations.
- Real-time search bar (by destination title or location) & maximum price range budget slider filter.
- Capacity progress bars & live slot badges.
- One-click booking with automatic capacity limit enforcement.
- Manage personal booking history and cancel active bookings to free up capacity slots.

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Python 3.10+, Flask 3.x |
| **ORM & Database** | Flask-SQLAlchemy (SQLAlchemy 2.x), SQLite (`instance/trekking.db`) |
| **Authentication** | Flask-Login, Werkzeug PBKDF2 Password Hashing, Session Management |
| **Templates & UI** | Jinja2 HTML5 Templates, Bootstrap 5.3 CDN, Bootstrap Icons |
| **Design System** | Custom Dark Glassmorphism, Mountain Sunrise Wallpaper (`style.css`) |
| **REST API** | Flask JSON Endpoints (`/api/*`) |
| **CI/CD & Deploy** | GitHub Actions (`ci.yml`), Vercel (`@vercel/python`) |

---

## 📁 Directory Structure

```
trekking_app/
├── app.py                      # Main Flask application entrypoint & database setup
├── vercel.json                 # Vercel deployment routes (@vercel/python)
├── Project_Report.pdf          # Academic project report document
├── README.md                   # Complete project documentation (this file)
├── requirements.txt            # Python dependencies (Flask, SQLAlchemy, Flask-Login, Werkzeug)
├── .gitignore                  # Excludes bytecode, SQLite DB, IDE settings, virtual envs
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI workflow (lint, DB test, API smoke test)
├── models/
│   ├── __init__.py             # SQLAlchemy instance initialization
│   └── models.py               # User, Trek, Booking, StaffAssignment ORM models
├── controllers/
│   ├── __init__.py             # Package initialization
│   ├── admin_routes.py         # Admin controller routes
│   ├── staff_routes.py         # Staff controller routes
│   ├── user_routes.py          # User controller routes
│   └── api_routes.py           # REST API endpoints (JSON responses)
├── templates/
│   ├── base.html               # Layout template with glassmorphic navbar & footer
│   ├── login.html              # Login page with quick-fill admin credentials
│   ├── register.html           # Registration page with role selector
│   ├── admin_dashboard.html    # Admin management dashboard with modal & tabs
│   ├── staff_dashboard.html    # Staff portal with status toggles & rosters
│   └── user_dashboard.html     # Trekker explore & booking dashboard with filters
└── static/
    ├── css/
    │   └── style.css           # Glassmorphic CSS design system & mountain background
    └── images/
        └── trekking_bg.png     # Epic mountain trekking background wallpaper
```

---

## 🗄 Database Schema & Relationships

```
┌──────────┐       ┌──────────────────┐       ┌──────────┐
│   User   │──1:N──│  StaffAssignment │──N:1──│   Trek   │
│          │       └──────────────────┘       │          │
│          │──1:N──┌──────────────────┐──N:1──│          │
└──────────┘       │     Booking      │       └──────────┘
                   └──────────────────┘
```

---

## 📊 CRUD Operations Matrix

| Entity | Create | Read | Update | Delete | Performed By |
|---|---|---|---|---|---|
| **Trek** | ✅ | ✅ | ✅ | ✅ | Admin |
| **User Account** | ✅ | ✅ | ✅ (status) | — | Admin / Self |
| **Booking** | ✅ | ✅ | — (cancel) | — | User (Trekker) |
| **Staff Assignment** | ✅ | ✅ | — | — | Admin |
| **Trek Status** | — | ✅ | ✅ | — | Staff |

---

## 🔌 REST API Endpoints

All API responses return standard JSON.

### Authentication Endpoints
- `GET /api/me` — Check current user session info.
- `POST /api/login` — Sign in (`{ username, password }`).
- `POST /api/register` — Register account (`{ username, email, password, role }`).
- `POST /api/logout` — Sign out.

### Trek & Booking Endpoints
- `GET /api/treks` — List all open treks (supports `?status=`, `?location=`, `?max_price=`).
- `GET /api/treks/<id>` — Retrieve trek details by ID.
- `POST /api/bookings` — Book slot for authenticated user (`{ trek_id }`).
- `GET /api/user/bookings` — Fetch booking history for logged-in user.
- `POST /api/user/bookings/cancel/<id>` — Cancel a booking.

### Admin & Staff Endpoints
- `GET /api/admin/users` — List all user accounts.
- `POST /api/admin/users/status/<id>` — Update user status (`approved`, `blacklisted`, `pending`).
- `POST /api/admin/treks/add` — Create new trek destination.
- `POST /api/admin/treks/delete/<id>` — Delete trek destination.
- `GET /api/admin/assignments` — List staff assignments.
- `POST /api/admin/assign` — Assign staff to trek (`{ staff_id, trek_id }`).
- `GET /api/staff/treks` — List assigned treks & registered trekker rosters.
- `POST /api/staff/treks/status/<id>` — Update trek operational status (`open`, `closed`, `completed`).

---

## 🚀 How to Run the Application

### Prerequisites

- Python 3.10 or higher installed.

### Step 1 — Install Dependencies

```bash
pip install Flask Flask-SQLAlchemy Flask-Login Werkzeug
```

### Step 2 — Run Flask App

```bash
py app.py
```

### Step 3 — Open in Browser

Navigate to **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser!

---

## 🌐 Vercel Deployment

This repository is configured for single-click deployment on **Vercel**:

- **`vercel.json`** routes requests to `app.py` via `@vercel/python` serverless functions.
- Static assets (`static/css/style.css`, `static/images/trekking_bg.png`) are served directly by Vercel's CDN.

To deploy on Vercel:
1. Import `AridoshikaZu103/Trekking-Aapp` repository into Vercel.
2. Select **Other** as Framework Preset.
3. Click **Deploy**!

---

## 🧪 Testing Credentials & Workflow

### Default Admin Account
- **Username**: `admin`
- **Password**: `adminpassword`

---

## 🎬 Demo Video

A full walkthrough video covering all user roles, CRUD operations, and features is embedded in the repository:

https://github.com/user-attachments/assets/Video/Project_Video.mp4

<video src="Video/Project_Video.mp4" controls width="100%"></video>

> **Note:** If the video does not render above, [click here to download and watch](Video/Project_Video.mp4).

---

## 📜 License

This project was developed as an academic submission for the **MAD-1** course at **IIT Madras**. It is intended for educational purposes only.
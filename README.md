# Trekking Management App V1 (React + Vite + Flask)

A state-of-the-art, multi-role web application built for managing trekking expeditions, staff assignments, trekker bookings, and REST API integrations. Featuring a **React 18 + Vite** frontend with Tailwind CSS glassmorphic aesthetics, `vite.svg` browser tab icon, and a **Flask (Python)** REST API backend.

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
| **Frontend Framework** | React 18, Vite 5 |
| **Styling & Icons** | Tailwind CSS 3.4, Glassmorphism, Lucide Icons, Bootstrap Icons |
| **Browser Favicon** | `public/vite.svg` |
| **Backend API** | Python 3.10+, Flask 3.x REST API |
| **ORM & Database** | Flask-SQLAlchemy, SQLite (`instance/trekking.db`) |
| **Auth & Sessions** | Flask-Login, Werkzeug PBKDF2 Password Hashing, CORS |
| **Deployment** | Vercel (`@vercel/static-build` + `@vercel/python`) |

---

## 📁 Directory Structure

```
trekking_app/
├── index.html                  # Main HTML entrypoint with vite.svg favicon & Google Fonts
├── package.json                # React 18, Vite, Tailwind CSS, Lucide icons dependencies
├── vite.config.js              # Vite dev server proxy (/api -> 5000) & build configuration
├── tailwind.config.js          # Tailwind CSS design system configuration
├── postcss.config.js           # PostCSS setup
├── vercel.json                 # Vercel deployment routes (React static + Python serverless)
├── .env.example                # Environment variables template
├── .gitignore                  # Excludes node_modules, dist, bytecode, SQLite DB
├── app.py                      # Flask backend app entrypoint with CORS & SPA fallback
├── Project_Report.pdf          # Academic project report document
├── README.md                   # Complete project documentation (this file)
├── public/
│   └── vite.svg                # Browser tab favicon icon
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # Main SPA router & Flask API state manager
│   ├── index.css               # Dark glassmorphic design system & custom utilities
│   ├── components/
│   │   └── Navbar.jsx          # Header with logo, user profile, and role badges
│   └── pages/
│       ├── LoginPage.jsx       # Glassmorphic login card with quick-fill admin button
│       ├── RegisterPage.jsx    # Registration page with Trekker vs Staff role selector
│       ├── AdminDashboard.jsx  # Superuser control center with metrics & CRUD modal
│       ├── StaffDashboard.jsx  # Staff management portal with status toggles & rosters
│       └── UserDashboard.jsx   # Trekker explore & booking portal with search/price slider
├── models/
│   ├── __init__.py             # SQLAlchemy instance initialization
│   └── models.py               # User, Trek, Booking, StaffAssignment ORM models
├── controllers/
│   ├── __init__.py             # Package initialization
│   ├── admin_routes.py         # Admin routes
│   ├── staff_routes.py         # Staff routes
│   ├── user_routes.py          # User routes
│   └── api_routes.py           # Comprehensive Flask REST API endpoints (JSON)
└── static/
    ├── css/
    │   └── style.css           # Custom CSS fallback stylesheet
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

### Option A: Local Development (React + Flask)

1. **Start Flask API Backend**:
   ```bash
   python app.py
   ```
   *Runs on `http://127.0.0.1:5000` and auto-seeds SQLite database with default admin user.*

2. **Start Vite React Dev Server** (in a separate terminal):
   ```bash
   npm install
   npm run dev
   ```
3. Open **[http://localhost:3000](http://localhost:3000)** in your browser!

### Option B: Production Build (Single Server)

```bash
npm run build
python app.py
```
*Flask automatically serves the built React SPA from `dist/` at `http://127.0.0.1:5000`.*

---

## 🌐 Vercel Deployment

This project is configured for seamless single-repo deployment on **Vercel**:

- **`vercel.json`** routes `/api/*` requests to `app.py` via `@vercel/python` serverless functions.
- All frontend routes are built using `@vercel/static-build` from `package.json` into `dist/`.

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

A full walkthrough video covering all user roles, CRUD operations, and React UI features is embedded in the repository:

https://github.com/user-attachments/assets/Video/Project_Video.mp4

<video src="Video/Project_Video.mp4" controls width="100%"></video>

> **Note:** If the video does not render above, [click here to download and watch](Video/Project_Video.mp4).

---

## 📜 License

This project was developed as an academic submission for the **MAD-1** course at **IIT Madras**. It is intended for educational purposes only.

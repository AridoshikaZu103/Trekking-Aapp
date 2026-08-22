# TrekOps - Trekking Management Application V1 (Monorepo)

A full-stack Trekking & Expedition Management Application built for managing Indian trek destinations, staff assignments, user bookings, and REST API integrations. Featuring an ultra-sleek dark glassmorphism design system with a mountain trekking hero wallpaper.

Developed for **MAD-1** at **IIT Madras**.

---

## 📁 Clean Monorepo Architecture

```text
trekking_app/
├── backend/
│   ├── app.py                  # Single authoritative Flask REST API & SPA server
│   ├── models/                 # Database models (User, Trek, Booking, StaffAssignment)
│   │   ├── __init__.py
│   │   └── models.py
│   ├── controllers/            # Route handlers
│   │   ├── admin_routes.py
│   │   ├── staff_routes.py
│   │   ├── user_routes.py
│   │   └── api_routes.py
│   └── instance/               # SQLite database (trekking.db)
├── frontend/
│   ├── public/                 # Static assets (vite.svg, trekker_hero_bg.png)
│   ├── dist/                   # Compiled React production bundle
│   ├── package.json            # React 18, Vite, Tailwind CSS, Lucide icons
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # SPA state & API integration
│       ├── index.css           # Glassmorphism & Image 5 styling
│       ├── components/
│       │   └── Navbar.jsx
│       └── pages/
│           ├── LoginPage.jsx   # Image 5 split-screen login
│           ├── RegisterPage.jsx
│           ├── AdminDashboard.jsx # Image 5 sidebar + stat cards dashboard
│           ├── StaffDashboard.jsx
│           └── UserDashboard.jsx
├── app.py                      # Root Vercel delegator entrypoint (imports app, db from backend)
├── vercel.json                 # Vercel hybrid deployment config (SPA rewrites + Python API)
├── requirements.txt
└── README.md                   # Project documentation
```

---

## 🌟 Key Features & User Roles

### 1. Administrator (`admin`)
- Pre-seeded superuser account created automatically on first launch (`admin` / `adminpassword`).
- Full CRUD management of Indian trek destinations (Add via modal, Edit, Delete).
- Review, approve, reject, or blacklist staff registrations.
- Assign approved staff to specific trek routes.
- Real-time stat metric cards (Total Treks, Registered Trekkers, Pending Staff, Active Bookings).

### 2. Trek Staff (`staff`)
- Self-register an account (`pending` status until approved by Admin).
- Dedicated staff portal displaying assigned Indian trek routes and rosters.
- Update trek operational status (`open`, `closed`, `completed`).

### 3. Trekker / User (`user`)
- Self-register and login to explore Indian trekking destinations (prices in ₹ INR).
- Real-time search bar & maximum budget slider filter in ₹ INR.
- Capacity progress bars & live slot badges.
- One-click instant booking and cancellation.

---

## 🔑 Testing Credentials

| Role | Username | Password | Default Status |
|---|---|---|---|
| **Administrator** | `admin` | `adminpassword` | Approved |
| **Trek Staff** | `staff1` | `staffpassword` | Pending / Approved |
| **Trekker** | `user1` | `userpassword` | Approved |

---

## 🔌 REST API Endpoints

- `GET /api/me` — Session info (`200 OK`)
- `POST /api/login` — JSON Login (`{ username, password }`)
- `POST /api/register` — JSON Registration (`{ username, email, password, role }`)
- `GET /api/treks` — List all open treks (supports `?max_price=`, `?location=`)
- `POST /api/bookings` — Create trek booking
- `POST /api/admin/users/status/<id>` — Update user status (`approved`, `blacklisted`, `pending`)
- `POST /api/admin/treks/add` — Create new trek destination in ₹ INR

---

## 🚀 How to Run Locally (Frontend & Backend)

### Prerequisites
- **Python 3.8+**
- **Node.js 18+ & npm**

---

### Option 1: Development Mode (Recommended for Development)

Runs Flask API on port `5000` and Vite React dev server on port `3000` with hot-reload and API proxying.

#### Terminal 1 — Backend (Flask REST API)
```bash
# 1. (Optional) Create & activate Python virtual environment
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# 2. Install backend dependencies
pip install -r backend/requirements.txt

# 3. Start Flask API server
python app.py
```
> Flask API starts at **`http://127.0.0.1:5000`** (auto-seeds default database and admin/staff/user accounts).

#### Terminal 2 — Frontend (React + Vite)
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install frontend dependencies
npm install

# 3. Start Vite development server
npm run dev
```
> Vite dev server starts at **`http://localhost:3000`** and automatically proxies `/api/*` calls to `http://127.0.0.1:5000`.

---

### Option 2: Unified Production Mode (Single Port 5000)

Builds the React frontend and lets Flask serve both the static SPA and REST API on a single port:

```bash
# 1. Build the React frontend production bundle
cd frontend
npm install
npm run build
cd ..

# 2. Install backend dependencies and run Flask
pip install -r backend/requirements.txt
python app.py
```
> Open **`http://127.0.0.1:5000`** in your browser.

---

## 🛠️ Git Workflow (Commit & Push)

```bash
# 1. Check status of modified files
git status

# 2. Stage all updated files
git add .

# 3. Commit with a meaningful message
git commit -m "docs: add local execution guide and git instructions"

# 4. Push to remote repository
git push origin main
```

---

## 🌐 Vercel Deployment

Live Application: **[https://trekking-aapp.vercel.app/login](https://trekking-aapp.vercel.app/login)**
GitHub Repository: **[https://github.com/AridoshikaZu103/Trekking-Aapp](https://github.com/AridoshikaZu103/Trekking-Aapp)**
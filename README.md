# Trekking Management App V1 (Monorepo)

A full-stack Trekking Management Application built with a clean separation of concerns:
- **Frontend**: React 18 + Vite SPA styled with Tailwind CSS, Lucide icons, and Image 5 design system.
- **Backend**: Python Flask REST API server exposing `/api/*` JSON endpoints.

---

## 📁 Monorepo Structure

```
trekking_app/
├── backend/
│   ├── app.py                  # Pure Flask REST API server (port 5000)
│   ├── requirements.txt        # Python backend dependencies
│   ├── models/                 # SQLAlchemy ORM database models
│   │   ├── __init__.py
│   │   └── models.py
│   ├── controllers/            # REST API controller blueprints (/api/*)
│   │   ├── __init__.py
│   │   ├── admin_routes.py
│   │   ├── staff_routes.py
│   │   ├── user_routes.py
│   │   └── api_routes.py
│   └── instance/               # SQLite database (trekking.db)
├── frontend/
│   ├── index.html              # React entry HTML with vite.svg browser icon
│   ├── vite.config.js          # Vite config (proxies /api requests to http://127.0.0.1:5000)
│   ├── package.json            # React 18, Vite, Tailwind CSS, Lucide-react
│   ├── public/
│   │   ├── vite.svg            # Browser tab favicon icon
│   │   └── static/images/      # Hero mountain background & trek thumbnails
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
├── vercel.json                 # Vercel monorepo serverless deployment config
└── README.md                   # Project documentation
```

---

## 🚀 How to Run Locally

### 1. Start Flask REST API Backend (Port 5000)

```bash
cd backend
pip install -r requirements.txt
py app.py
```
> Backend runs at: **`http://127.0.0.1:5000`** (REST API endpoints at `/api/*`)

### 2. Start React + Vite Frontend (Port 3000)

```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at: **`http://localhost:3000`**

---

## 🔑 Default Credentials
- **Username**: `admin`
- **Password**: `adminpassword`

---

## 📜 License
Developed for MAD-1 Course Project at IIT Madras.

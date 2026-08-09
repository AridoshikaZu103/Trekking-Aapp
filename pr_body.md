## Summary

This PR completes the full migration of the **Trekking Management App** frontend to **React 18 + Vite** with Tailwind CSS glassmorphism, `vite.svg` favicon icon, and Flask REST API integration.

## Key Changes

### 1. React + Vite Frontend Setup
- Configured `vite.config.js` with API proxying to Flask backend (`http://127.0.0.1:5000`).
- Added `public/vite.svg` as the browser tab favicon icon in `index.html`.
- Implemented deep slate/emerald dark glassmorphic styling system in `src/index.css`.

### 2. Component Architecture (`src/`)
- `Navbar.jsx`: Translucent navigation bar with user profile info, role badges, and logout.
- `LoginPage.jsx`: Glassmorphic login card with quick-fill admin test credentials.
- `RegisterPage.jsx`: Account creation with Trekker vs Trek Staff role selector.
- `AdminDashboard.jsx`: Superuser control center with stat summary cards, trek creation modal, user approval table, and staff assignment manager.
- `StaffDashboard.jsx`: Dedicated portal for staff members to manage assigned trek statuses (`open`, `closed`, `completed`) and view trekker rosters.
- `UserDashboard.jsx`: Trekker portal featuring real-time destination search, maximum budget range slider, trek capacity progress bars, instant slot booking, and booking history manager.

### 3. Flask Backend & Vercel Config
- Updated `controllers/api_routes.py` with full REST JSON endpoints for auth, trek management, staff assignments, and user bookings.
- Added CORS support and SPA static fallback handling in `app.py`.
- Configured `vercel.json` for unified deployment with `@vercel/static-build` and `@vercel/python`.

Closes #6

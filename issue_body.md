## Description

Migrate the Trekking Management App frontend to React + Vite with Tailwind CSS glassmorphism styling, `vite.svg` browser tab icon, and complete Flask REST API backend integration.

## Tasks & Enhancements

- [x] Create React + Vite project structure with `vite.config.js`, `package.json`, and `public/vite.svg`
- [x] Implement glassmorphism dark theme styling system in `src/index.css`
- [x] Build modular `.jsx` components:
  - `src/components/Navbar.jsx` (Header with logo, user profile, role badge)
  - `src/pages/LoginPage.jsx` (Login form with quick admin credentials helper)
  - `src/pages/RegisterPage.jsx` (Registration form with role selector)
  - `src/pages/AdminDashboard.jsx` (Metrics overview, trek CRUD modal, staff approvals, staff assignments)
  - `src/pages/StaffDashboard.jsx` (Assigned treks overview, trek status update controls, registered trekker rosters)
  - `src/pages/UserDashboard.jsx` (Search, max price range slider, trek cards with live capacity indicator, one-click booking, booking history manager)
- [x] Update Flask REST API endpoints in `controllers/api_routes.py` and CORS/SPA fallback in `app.py`
- [x] Update `vercel.json` to handle unified static React build and Python serverless function deployment

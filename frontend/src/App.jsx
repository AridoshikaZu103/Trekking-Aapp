import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TutorialModal from './components/TutorialModal';
import LiveTicker from './components/LiveTicker';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import UserDashboard from './pages/UserDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [errorMsg, setErrorMsg] = useState('');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Data states
  const [treks, setTreks] = useState([]);
  const [users, setUsers] = useState([]);
  const [staffAssignments, setStaffAssignments] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [assignedTreks, setAssignedTreks] = useState([]);

  // Check current session on mount
  useEffect(() => {
    fetchMe();
    fetchTreks();
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        fetchAdminData();
      } else if (currentUser.role === 'staff') {
        fetchStaffData();
      } else if (currentUser.role === 'user') {
        fetchUserBookings();
      }
    }
  }, [currentUser]);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          setCurrentUser(data.user);
        }
      }
    } catch (err) {
      console.log('Not logged in');
    }
  };

  const fetchTreks = async () => {
    try {
      const res = await fetch('/api/treks?status=all');
      if (res.ok) {
        const data = await res.json();
        setTreks(data.treks || data);
      }
    } catch (err) {
      console.error('Error fetching treks:', err);
    }
  };

  const fetchAdminData = async () => {
    try {
      fetchTreks();
      const [uRes, aRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/assignments'),
      ]);
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(uData.users || []);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        setStaffAssignments(aData.assignments || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const fetchStaffData = async () => {
    try {
      fetchTreks();
      const res = await fetch('/api/staff/treks');
      if (res.ok) {
        const data = await res.json();
        setAssignedTreks(data.treks || []);
      }
    } catch (err) {
      console.error('Error fetching staff treks:', err);
    }
  };

  const fetchUserBookings = async () => {
    try {
      fetchTreks();
      const res = await fetch('/api/user/bookings');
      if (res.ok) {
        const data = await res.json();
        setUserBookings(data.bookings || data);
      }
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    }
  };

  const handleLogin = async (username, password) => {
    setErrorMsg('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setCurrentUser(data.user);
      } else {
        setErrorMsg(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check network/backend server.');
    }
  };

  const handleRegister = async ({ username, email, password, role }) => {
    setErrorMsg('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        if (role === 'staff') {
          alert('Registration submitted! Staff accounts require Admin approval before login.');
          setAuthView('login');
        } else {
          setCurrentUser(data.user);
        }
      } else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg('Registration failed. Please check network/backend server.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
    setAuthView('login');
  };

  // Admin Handlers
  const handleCreateTrek = async (trekData) => {
    try {
      const res = await fetch('/api/admin/treks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trekData),
      });
      if (res.ok) {
        fetchTreks();
      }
    } catch (err) {
      console.error('Error creating trek:', err);
    }
  };

  const handleDeleteTrek = async (trekId) => {
    try {
      const res = await fetch(`/api/admin/treks/delete/${trekId}`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchTreks();
      }
    } catch (err) {
      console.error('Error deleting trek:', err);
    }
  };

  const handleUpdateUserStatus = async (userId, status) => {
    try {
      const res = await fetch(`/api/admin/users/status/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const handleAssignStaff = async (staffId, trekId) => {
    try {
      const res = await fetch('/api/admin/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: staffId, trek_id: trekId }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error assigning staff:', err);
    }
  };

  // Staff Handlers
  const handleUpdateTrekStatus = async (trekId, status) => {
    try {
      const res = await fetch(`/api/staff/treks/status/${trekId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchStaffData();
        fetchTreks();
      }
    } catch (err) {
      console.error('Error updating trek status:', err);
    }
  };

  // User Handlers
  const handleBookTrek = async (trekId) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trek_id: trekId }),
      });
      const data = await res.json();
      if (res.ok && (data.status === 'success' || data.booking_id)) {
        fetchUserBookings();
        fetchTreks();
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Error booking trek:', err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await fetch(`/api/user/bookings/cancel/${bookingId}`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchUserBookings();
        fetchTreks();
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {currentUser && <LiveTicker treks={treks} />}

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onQuickLogin={handleLogin}
      />

      <main className="flex-1">
        {!currentUser ? (
          authView === 'login' ? (
            <LoginPage
              onLogin={handleLogin}
              onNavigateRegister={() => {
                setErrorMsg('');
                setAuthView('register');
              }}
              errorMsg={errorMsg}
            />
          ) : (
            <RegisterPage
              onRegister={handleRegister}
              onNavigateLogin={() => {
                setErrorMsg('');
                setAuthView('login');
              }}
              errorMsg={errorMsg}
            />
          )
        ) : currentUser.role === 'admin' ? (
          <AdminDashboard
            treks={treks}
            users={users}
            staffAssignments={staffAssignments}
            onCreateTrek={handleCreateTrek}
            onDeleteTrek={handleDeleteTrek}
            onUpdateUserStatus={handleUpdateUserStatus}
            onAssignStaff={handleAssignStaff}
          />
        ) : currentUser.role === 'staff' ? (
          <StaffDashboard
            assignedTreks={assignedTreks}
            onUpdateTrekStatus={handleUpdateTrekStatus}
          />
        ) : (
          <UserDashboard
            treks={treks}
            bookings={userBookings}
            onBookTrek={handleBookTrek}
            onCancelBooking={handleCancelBooking}
          />
        )}
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 glass-panel mt-auto">
        <p>© 2026 TrekOps - Trekking Management App V1 | React + Vite + Flask REST API</p>
      </footer>
    </div>
  );
}

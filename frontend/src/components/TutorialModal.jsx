import React, { useState } from 'react';
import { Lightbulb, X, Shield, Compass, UserCheck, CheckCircle2, ArrowRight, Sparkles, Key, Layers, HelpCircle, Zap } from 'lucide-react';

export default function TutorialModal({ isOpen, onClose, onQuickLogin }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      {/* 3D Glassmorphic Container */}
      <div className="glass-panel max-w-3xl w-full rounded-3xl p-6 sm:p-8 border border-teal-500/30 shadow-[0_20px_60px_rgba(20,184,166,0.2)] relative overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        {/* Decorative 3D Ambient Background Glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-teal-400 to-blue-500 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                TrekOps Interactive Guide
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                  💡 Tutorial
                </span>
              </h2>
              <p className="text-xs text-slate-400">Master multi-role workflow & 3D management features</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Navigation Tabs */}
        <div className="flex border-b border-slate-800 py-3 gap-2 overflow-x-auto relative z-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Overview & Roles</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Admin Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab('trekker')}
            className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'trekker'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Trekker Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'staff'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Staff Operations</span>
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1 relative z-10">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                <Zap className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">How TrekOps Multi-Role Ecosystem Works</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    TrekOps features 3 distinct user roles with full database persistence. You can create accounts or use demo credentials below.
                  </p>
                </div>
              </div>

              {/* 3D Orbit Radar Live Stage */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="orbit-perspective py-2">
                  <div className="orbit-stage scale-90">
                    <div className="orbit-ring-outer" />
                    <div className="orbit-ring-inner" />
                    <div className="orbit-center-core">
                      <Compass className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <div className="orbit-node-1">Hampta Pass</div>
                    <div className="orbit-node-2">Kashmir Lakes</div>
                    <div className="orbit-node-3">Kedarkantha</div>
                  </div>
                </div>
                <div className="text-left flex-1 pl-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-400">Live 3D Expedition Orbit</span>
                  <h5 className="font-extrabold text-white text-sm mt-0.5">Real-Time Route Radar & Capacity Tracking</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Live race map visualization tracks high-altitude Himalayan routes, slots capacity, and staff availability across all roles.
                  </p>
                </div>
              </div>

              {/* 3D Role Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Admin 3D Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/10 to-slate-900/80 border border-amber-500/20 hover:border-amber-500/40 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h5 className="font-extrabold text-white text-sm mb-1">1. Admin Superuser</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    Add/delete expeditions, approve staff applications, assign staff members to specific treks.
                  </p>
                  <button
                    onClick={() => {
                      onQuickLogin('admin', 'adminpassword');
                      onClose();
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Quick Login Admin</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Trekker 3D Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-teal-500/10 to-slate-900/80 border border-teal-500/20 hover:border-teal-500/40 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h5 className="font-extrabold text-white text-sm mb-1">2. Trekker (User)</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    Explore Himalayan expeditions, adjust budget filter, book slots in real-time, cancel bookings.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('trekker');
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Learn Booking</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Staff 3D Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-500/10 to-slate-900/80 border border-blue-500/20 hover:border-blue-500/40 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h5 className="font-extrabold text-white text-sm mb-1">3. Trek Staff</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    Requires Admin approval. View assigned expeditions, update status (Open/Closed/Completed), inspect roster.
                  </p>
                  <button
                    onClick={() => {
                      onQuickLogin('staff1', 'staffpassword');
                      onClose();
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Quick Login Staff</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN WORKFLOW */}
          {activeTab === 'admin' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Default Credentials</span>
                  <div className="font-mono text-sm text-white font-bold mt-0.5">admin | adminpassword</div>
                </div>
                <button
                  onClick={() => {
                    onQuickLogin('admin', 'adminpassword');
                    onClose();
                  }}
                  className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/30"
                >
                  Log In As Admin
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <span className="font-bold text-white">Create New Expeditions</span>
                    <p className="text-slate-400 mt-0.5">Click "+ Add New Trek" to create custom destinations with price, location, capacity, and status.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <span className="font-bold text-white">Approve Staff Applications</span>
                    <p className="text-slate-400 mt-0.5">Under "Users & Approvals", review pending staff signups and click the green Checkmark to approve them.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <span className="font-bold text-white">Assign Staff to Treks</span>
                    <p className="text-slate-400 mt-0.5">Under "Staff Assignments", pick an approved staff member and link them to an expedition roster.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TREKKER WORKFLOW */}
          {activeTab === 'trekker' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">How to Register</span>
                  <div className="text-sm text-white font-bold mt-0.5">Click "Create Account" → Choose role "Trekker"</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <span className="font-bold text-white">Search & Filter Destinations</span>
                    <p className="text-slate-400 mt-0.5">Use search bar or adjust the budget range slider up to $50,000 to discover open expeditions.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <span className="font-bold text-white">Instant Slot Booking</span>
                    <p className="text-slate-400 mt-0.5">Click "Book Slot Now" to reserve your spot. Slots update live in the capacity bar.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <span className="font-bold text-white">Manage Booking History</span>
                    <p className="text-slate-400 mt-0.5">Review your confirmed bookings at the bottom and cancel any reservation if plans change.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STAFF WORKFLOW */}
          {activeTab === 'staff' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Demo Staff Account</span>
                  <div className="font-mono text-sm text-white font-bold mt-0.5">staff1 | staffpassword</div>
                </div>
                <button
                  onClick={() => {
                    onQuickLogin('staff1', 'staffpassword');
                    onClose();
                  }}
                  className="py-2 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs transition-all shadow-lg shadow-blue-500/30"
                >
                  Log In As Staff
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <span className="font-bold text-white">Pending Approval Requirement</span>
                    <p className="text-slate-400 mt-0.5">Staff signups start in "pending" status until approved by Admin. Logging in before approval shows an alert.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <span className="font-bold text-white">Live Status Control</span>
                    <p className="text-slate-400 mt-0.5">Change trek status to Open, Closed, or Completed. Status updates immediately across all portals.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <span className="font-bold text-white">Registered Trekkers Roster</span>
                    <p className="text-slate-400 mt-0.5">View usernames and emails of all confirmed trekkers on your assigned expedition.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between relative z-10">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>TrekOps 3D Glassmorphism Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-teal-500/20 transition-all"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

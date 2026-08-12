import React from 'react';
import { Mountain, LogOut, Shield, UserCheck, Compass, Lightbulb } from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onOpenTutorial }) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Shield className="w-3.5 h-3.5" /> Admin Superuser
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <UserCheck className="w-3.5 h-3.5" /> Trek Staff
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Compass className="w-3.5 h-3.5" /> Trekker
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-teal-400 bg-clip-text text-transparent">
                TrekOps
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold tracking-wider uppercase">
                <span className="live-radar-dot" />
                <span>Live</span>
              </span>
            </div>
          </div>

          {/* Tutorial & User Section */}
          <div className="flex items-center gap-3">
            {/* 💡 Lightbulb Tutorial Button */}
            <button
              onClick={onOpenTutorial}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10 transition-all group"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="hidden sm:inline">Guide & Tutorial</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-200">{currentUser.username}</div>
                    <div className="text-xs text-slate-400">{currentUser.email}</div>
                  </div>
                  {getRoleBadge(currentUser.role)}
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-rose-600/20 hover:border-rose-500/30 border border-slate-700/50 transition-all"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex text-xs text-slate-400 items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400" />
                <span>Multi-role Trekking Portal</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { Mountain, LogIn, Lock, User, ShieldCheck, Compass, Sparkles, Lightbulb } from 'lucide-react';

const trekkerHeroBg = '/trekker_hero_bg.png';

export default function LoginPage({ onLogin, onNavigateRegister, errorMsg }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(username, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row mobile-hero-bg lg:bg-[#071939] items-center justify-center p-4 sm:p-6 lg:p-0">
      {/* Left Split Hero (Image 5 Left) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-14 relative bg-cover bg-center h-full min-h-screen" style={{ backgroundImage: `linear-gradient(135deg, rgba(7, 25, 57, 0.88), rgba(2, 44, 94, 0.78)), url('${trekkerHeroBg}')` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-2xl font-black text-white">
            <Mountain className="w-8 h-8 text-blue-400" />
            <span>TrekOps</span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 3D Expedition Radar
          </span>
        </div>

        {/* 3D Orbit Radar Animation */}
        <div className="my-6 orbit-perspective">
          <div className="orbit-stage">
            <div className="orbit-ring-outer" />
            <div className="orbit-ring-inner" />
            <div className="orbit-center-core">
              <Mountain className="w-6 h-6" />
            </div>
            <div className="orbit-node-1">Hampta Pass</div>
            <div className="orbit-node-2">Kashmir Lakes</div>
            <div className="orbit-node-3">Kedarkantha</div>
          </div>
        </div>

        <div className="max-w-lg">
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Explore the <span className="text-sky-400">World</span>.<br />
            Trek with <span className="text-blue-500">Purpose</span>.
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Manage treks, bookings, teams and adventures seamlessly.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                <Mountain className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <div className="font-bold text-white">Discover</div>
                <div className="text-xs text-slate-300">Amazing trek destinations</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-white">Manage</div>
                <div className="text-xs text-slate-300">Teams, staff & bookings</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-bold text-white">Secure</div>
                <div className="text-xs text-slate-300">Safe & reliable platform</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          © 2026 TrekOps Management Application V1. Built for MAD-1 Project.
        </div>
      </div>

      {/* Right Form (Mobile glassmorphism / Desktop split) */}
      <div className="w-full max-w-md lg:max-w-none lg:w-[480px] bg-slate-950/90 lg:bg-white p-8 sm:p-12 rounded-3xl lg:rounded-none border border-slate-800 lg:border-none shadow-2xl lg:shadow-none flex flex-col justify-center my-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 lg:bg-blue-50 text-blue-400 lg:text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-500/20 lg:border-none">
            <Mountain className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white lg:text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 lg:text-slate-500 mt-1">Sign in to manage your treks or bookings</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </form>

        <div className="mt-8 p-4 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-slate-600">
          <div className="flex items-center gap-2 text-blue-700 font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Default Admin Credentials:</span>
          </div>
          <div className="font-mono text-slate-500">
            Username: <span className="font-bold text-slate-800">admin</span> | Password: <span className="font-bold text-slate-800">adminpassword</span>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={onNavigateRegister}
            className="text-blue-600 hover:underline font-bold"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

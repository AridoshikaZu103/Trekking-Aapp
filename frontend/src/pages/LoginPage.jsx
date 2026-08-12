import React, { useState } from 'react';
import { Mountain, LogIn, Lock, User, Sparkles, ShieldCheck } from 'lucide-react';

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
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(7, 25, 57, 0.88), rgba(2, 44, 94, 0.82)), url('${trekkerHeroBg}')`,
      }}
    >
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Glassmorphic Login Card */}
      <div className="glass-panel max-w-md w-full p-8 sm:p-10 rounded-3xl border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl bg-slate-950/85 relative z-10 animate-scale-up">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 p-0.5 shadow-lg shadow-teal-500/20 mx-auto mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Mountain className="w-8 h-8 text-teal-400" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-300 mt-1.5">Sign in to manage your treks or bookings</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/30 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 btn-gradient rounded-xl font-extrabold text-white shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 text-sm transition-all hover:opacity-95"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Admin Credentials Helper Card */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Default Admin Credentials:</span>
          </div>
          <div className="font-mono text-slate-400">
            Username: <span className="font-bold text-white">admin</span> | Password: <span className="font-bold text-white">adminpassword</span>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={onNavigateRegister}
            className="text-teal-400 hover:underline font-bold"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

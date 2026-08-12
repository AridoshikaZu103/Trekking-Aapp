import React, { useState } from 'react';
import { Mountain, UserPlus, Lock, Mail, User, ShieldCheck, Compass, Info } from 'lucide-react';

const trekkerHeroBg = '/trekker_hero_bg.png';

export default function RegisterPage({ onRegister, onNavigateLogin, errorMsg }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onRegister({ username, email, password, role });
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

      {/* Centered Glassmorphic Register Card */}
      <div className="glass-panel max-w-md w-full p-8 sm:p-10 rounded-3xl border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl bg-slate-950/85 relative z-10 animate-scale-up">
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 shadow-xl shadow-teal-500/20 mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-300 mt-1.5">Join as a Trekker or apply for Trek Staff position</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
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
                placeholder="Choose username"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
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
                placeholder="Create password"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  role === 'user'
                    ? 'bg-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/10'
                    : 'bg-slate-900/50 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <Compass className="w-4 h-4 text-teal-400" />
                  <span>Trekker</span>
                </div>
                <span className="text-[11px] opacity-75">Explore & book expeditions</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  role === 'staff'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/50 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Trek Staff</span>
                </div>
                <span className="text-[11px] opacity-75">Manage assigned treks</span>
              </button>
            </div>
          </div>

          {role === 'staff' && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Staff applications require Admin approval before login activation.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 btn-gradient rounded-xl font-extrabold text-white shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all text-sm disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={onNavigateLogin}
            className="text-teal-400 hover:text-teal-300 font-bold underline underline-offset-4 transition-all"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}

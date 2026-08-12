import React, { useState } from 'react';
import { UserCheck, MapPin, Users, Activity, CheckCircle, Lock, Compass } from 'lucide-react';
import './StaffDashboard.css';

export default function StaffDashboard({ assignedTreks, onUpdateTrekStatus }) {
  const [selectedTrek, setSelectedTrek] = useState(null);

  return (
    <div className="staff-dashboard-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-teal-400" />
          Trek Staff Portal
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage operational status and review registered trekker rosters for your assigned expeditions
        </p>
      </div>

      {assignedTreks.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <Compass className="w-16 h-16 text-slate-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-slate-300">No Assigned Treks Yet</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
            You have not been assigned to any trek destinations by the Administrator yet. Check back once assigned.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {assignedTreks.map((trek) => (
            <div key={trek.id} className="glass-panel glass-panel-hover rounded-3xl p-7 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white">{trek.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      <span>{trek.location}</span>
                    </div>
                  </div>
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      trek.status === 'open'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : trek.status === 'closed'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {trek.status}
                  </span>
                </div>

                {trek.description && (
                  <p className="text-sm text-slate-300 mb-6 italic bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    "{trek.description}"
                  </p>
                )}

                {/* Status Toggle Buttons */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                    Update Operational Status:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onUpdateTrekStatus(trek.id, 'open')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        trek.status === 'open'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => onUpdateTrekStatus(trek.id, 'closed')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        trek.status === 'closed'
                          ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Closed
                    </button>
                    <button
                      onClick={() => onUpdateTrekStatus(trek.id, 'completed')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        trek.status === 'completed'
                          ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                {/* Roster Section */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-400" />
                      Registered Trekkers ({trek.trekkers ? trek.trekkers.length : 0})
                    </span>
                  </div>

                  {trek.trekkers && trek.trekkers.length > 0 ? (
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {trek.trekkers.map((t, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white">{t.username}</span>
                            <span className="text-slate-400 ml-2">({t.email})</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold">
                            Confirmed
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No trekkers registered yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

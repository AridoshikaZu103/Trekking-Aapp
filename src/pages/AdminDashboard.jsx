import React, { useState } from 'react';
import { Shield, Plus, MapPin, DollarSign, Users, CheckCircle, XCircle, Ban, Trash2, Edit3, UserCheck, Layers } from 'lucide-react';

export default function AdminDashboard({
  treks,
  users,
  staffAssignments,
  onCreateTrek,
  onEditTrek,
  onDeleteTrek,
  onUpdateUserStatus,
  onAssignStaff,
}) {
  const [activeTab, setActiveTab] = useState('treks');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new trek
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('20');
  const [description, setDescription] = useState('');

  // Assignment states
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedTrekId, setSelectedTrekId] = useState('');

  const handleAddTrekSubmit = (e) => {
    e.preventDefault();
    onCreateTrek({
      title,
      location,
      price: parseFloat(price),
      capacity: parseInt(capacity),
      description,
    });
    setTitle('');
    setLocation('');
    setPrice('');
    setCapacity('20');
    setDescription('');
    setShowAddModal(false);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedStaffId || !selectedTrekId) return;
    onAssignStaff(parseInt(selectedStaffId), parseInt(selectedTrekId));
    setSelectedStaffId('');
    setSelectedTrekId('');
  };

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const staffMembers = users.filter((u) => u.role === 'staff' && u.status === 'approved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-amber-400" />
            Administrator Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage trek destinations, user accounts, staff approvals, and assignments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-gradient py-3 px-5 rounded-2xl font-bold text-white shadow-lg flex items-center gap-2 text-sm self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Trek</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Treks</span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{treks.length}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Users</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{users.length}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 mt-2">{pendingUsers.length}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Assignments</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{staffAssignments.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('treks')}
          className={`py-3 px-5 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'treks'
              ? 'border-teal-400 text-teal-400 bg-teal-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Trek Destinations ({treks.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-5 font-bold text-sm border-b-2 transition-all relative ${
            activeTab === 'users'
              ? 'border-teal-400 text-teal-400 bg-teal-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Users & Approvals
          {pendingUsers.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-black font-extrabold">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`py-3 px-5 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'assignments'
              ? 'border-teal-400 text-teal-400 bg-teal-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Staff Assignments
        </button>
      </div>

      {/* TAB 1: Treks List */}
      {activeTab === 'treks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treks.map((trek) => (
            <div key={trek.id} className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-xl font-bold text-white">{trek.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
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

                <div className="space-y-2 text-sm text-slate-300 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    <span>{trek.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">${trek.price}</span>
                    <span className="text-xs text-slate-400">per trekker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Capacity: {trek.capacity} max</span>
                  </div>
                </div>

                {trek.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 italic">"{trek.description}"</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2">
                <button
                  onClick={() => onDeleteTrek(trek.id)}
                  className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                  title="Delete Trek"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Users & Approvals */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{u.username}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300'
                            : u.role === 'staff'
                            ? 'bg-teal-500/20 text-teal-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          u.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : u.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {u.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => onUpdateUserStatus(u.id, 'approved')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                            title="Approve User"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onUpdateUserStatus(u.id, 'blacklisted')}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                            title="Blacklist User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Staff Assignments */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignment Form */}
          <div className="glass-panel p-6 rounded-2xl h-fit border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-400" />
              Assign Staff Member
            </h3>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Select Approved Staff
                </label>
                <select
                  required
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-teal-500"
                >
                  <option value="">-- Select Staff --</option>
                  {staffMembers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.username} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Select Trek Destination
                </label>
                <select
                  required
                  value={selectedTrekId}
                  onChange={(e) => setSelectedTrekId(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-teal-500"
                >
                  <option value="">-- Select Trek --</option>
                  {treks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.location})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 btn-gradient rounded-xl font-bold text-white text-sm shadow-lg mt-2"
              >
                Assign Staff to Trek
              </button>
            </form>
          </div>

          {/* Assignments List */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Current Staff Assignments</h3>

            <div className="space-y-3">
              {staffAssignments.map((a) => (
                <div key={a.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-teal-300">{a.staff_name || `Staff #${a.staff_id}`}</div>
                    <div className="text-xs text-slate-400">Assigned to: <span className="text-white font-semibold">{a.trek_title || `Trek #${a.trek_id}`}</span></div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    Active Assignment
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Trek Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-8 border border-slate-700 shadow-2xl relative">
            <h2 className="text-2xl font-black text-white mb-6">Create New Trek Destination</h2>

            <form onSubmit={handleAddTrekSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Trek Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annapurna Sanctuary Trek"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Nepal"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Capacity</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details about the trek expedition..."
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 btn-gradient rounded-xl font-bold text-white text-sm shadow-lg"
                >
                  Save Trek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

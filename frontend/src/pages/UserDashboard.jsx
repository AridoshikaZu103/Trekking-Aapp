import React, { useState } from 'react';
import { Compass, Search, DollarSign, MapPin, Users, Calendar, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import './UserDashboard.css';

export default function UserDashboard({ treks, bookings, onBookTrek, onCancelBooking }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [bookingLoading, setBookingLoading] = useState(null);

  // Filter open treks based on search term & max price
  const filteredTreks = treks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = t.price <= maxPrice;
    return t.status === 'open' && matchesSearch && matchesPrice;
  });

  const handleBook = async (trekId) => {
    setBookingLoading(trekId);
    await onBookTrek(trekId);
    setBookingLoading(null);
  };

  return (
    <div className="user-dashboard-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Hero Search & Filter Section */}
      <div className="glass-panel p-8 rounded-3xl mb-10 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Compass className="w-9 h-9 text-teal-400" />
            Explore Trekking Expeditions
          </h1>
          <p className="text-slate-300 text-sm mt-2">
            Find your next mountain adventure with real-time capacity tracking & instant slot booking
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by destination or location..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Price Filter Slider */}
            <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl flex flex-col justify-center">
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Max Budget:</span>
                <span className="text-emerald-400 font-extrabold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Available Treks Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          <span>Available Expeditions</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
            {filteredTreks.length} Open
          </span>
        </h2>

        {filteredTreks.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No matching treks found</h3>
            <p className="text-slate-500 text-xs mt-1">Try adjusting your search terms or budget slider filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreks.map((trek) => {
              const bookedCount = trek.booked_count || 0;
              const isFull = bookedCount >= trek.capacity;

              return (
                <div
                  key={trek.id}
                  className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between border border-slate-800"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white leading-snug">{trek.title}</h3>
                      <span className="text-lg font-black text-emerald-400 shrink-0">${trek.price}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{trek.location}</span>
                    </div>

                    {trek.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 italic">"{trek.description}"</p>
                    )}

                    {/* Capacity Indicator */}
                    <div className="mb-5 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-400" /> Capacity
                        </span>
                        <span className={isFull ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {bookedCount} / {trek.capacity} Slots
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isFull ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, (bookedCount / trek.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBook(trek.id)}
                    disabled={isFull || bookingLoading === trek.id}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'btn-gradient text-white hover:opacity-95'
                    }`}
                  >
                    {bookingLoading === trek.id ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isFull ? (
                      <span>Fully Booked</span>
                    ) : (
                      <>
                        <span>Book Slot Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Bookings Section */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-teal-400" />
          My Booking History ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm italic">
            You haven't booked any treks yet. Select an expedition above to book your first trek!
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-lg font-bold text-white">{b.trek_title || `Trek #${b.trek_id}`}</h4>
                  <div className="text-xs text-slate-400 mt-1">
                    Booked on: {new Date(b.booking_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {b.status === 'confirmed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span className="capitalize">{b.status}</span>
                  </span>

                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
                    >
                      Cancel Slot
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

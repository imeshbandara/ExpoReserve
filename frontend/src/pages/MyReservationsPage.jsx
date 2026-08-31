import React, { useEffect, useState } from 'react';
import { useReservations } from '../hooks/useReservations';
import ReservationCard from '../components/ReservationCard';

const MyReservationsPage = () => {
  const { fetchMyReservations, loading } = useReservations();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchMyReservations().then(setReservations).catch(console.error);
  }, [fetchMyReservations]);

  const filtered = filter === 'ALL' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Reservations</h1>
          <p className="text-slate-600 mt-2">Manage your stall bookings and requests.</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === status 
                  ? 'bg-slate-100 text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 mb-2">No reservations found</h3>
          <p className="text-slate-500">You don't have any reservations matching this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(res => (
            <ReservationCard key={res.id} reservation={res} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;

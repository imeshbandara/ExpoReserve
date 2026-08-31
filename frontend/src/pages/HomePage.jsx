import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReservations } from '../hooks/useReservations';
import ReservationCard from '../components/ReservationCard';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user } = useAuth();
  const { fetchMyReservations, loading } = useReservations();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchMyReservations().then(setReservations).catch(console.error);
  }, [fetchMyReservations]);

  const pendingCount = reservations.filter(r => r.status === 'PENDING').length;
  const approvedCount = reservations.filter(r => r.status === 'APPROVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}! 👋</h1>
        <p className="text-slate-600 mt-2">Here's what's happening with your stall reservations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl mr-4">
            📊
          </div>
          <div>
            <p className="text-slate-500 text-sm">Total Reservations</p>
            <p className="text-2xl font-bold text-slate-900">{reservations.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl mr-4">
            ⏳
          </div>
          <div>
            <p className="text-slate-500 text-sm">Pending Approvals</p>
            <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl mr-4">
            ✅
          </div>
          <div>
            <p className="text-slate-500 text-sm">Approved Stalls</p>
            <p className="text-2xl font-bold text-slate-900">{approvedCount}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Recent Reservations</h2>
        <Link to="/reservations" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500 animate-pulse">Loading reservations...</div>
      ) : reservations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">⛺</div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No reservations yet</h3>
          <p className="text-slate-500 mb-6">You haven't booked any stalls for upcoming exhibitions.</p>
          <Link to="/exhibitions" className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Browse Exhibitions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.slice(0, 3).map(res => (
            <ReservationCard key={res.id} reservation={res} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

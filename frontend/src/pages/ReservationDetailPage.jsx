import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import StatusBadge from '../components/StatusBadge';
import { useReservations } from '../hooks/useReservations';

const ReservationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cancelReservation, loading: actionLoading } = useReservations();
  
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/reservations/${id}`);
        setReservation(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load reservation');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation request?')) return;
    
    try {
      await cancelReservation(id);
      setReservation(prev => ({ ...prev, status: 'CANCELLED' }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error || 'Reservation not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/reservations')} 
          className="text-slate-500 hover:text-slate-900 mr-4 transition-colors"
        >
          &larr; Back to list
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Reservation Details</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {reservation.exhibition?.name}
            </h2>
            <p className="text-slate-500">
              Reserved on {new Date(reservation.created_at).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={reservation.status} />
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-slate-500 mb-1">Reservation Date</p>
              <p className="font-medium text-slate-900">{new Date(reservation.reservation_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Business Category</p>
              <p className="font-medium text-slate-900">{reservation.business_category}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Stall Configuration</p>
              <p className="font-medium text-slate-900">{reservation.quantity}x {reservation.stall_size} ({reservation.stall_type})</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Reservation ID</p>
              <p className="font-mono text-xs text-slate-500">{reservation.id}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-4">Special Requirements</h3>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-slate-700 whitespace-pre-wrap">
              {reservation.special_requirements || 'None provided.'}
            </p>
          </div>
        </div>

        {reservation.status === 'PENDING' && (
          <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Cancel Reservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDetailPage;

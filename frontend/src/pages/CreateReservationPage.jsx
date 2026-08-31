import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReservationForm from '../components/ReservationForm';
import { useReservations } from '../hooks/useReservations';

const CreateReservationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialExhibitionId = searchParams.get('exhibition') || '';
  
  const { createReservation, loading, error } = useReservations();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data) => {
    try {
      await createReservation(data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/reservations');
      }, 2000);
    } catch (err) {
      // Error is handled by the hook and displayed below
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Book a Stall</h1>
        <p className="text-slate-600 mt-2">Secure your spot at the next big exhibition.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
              Reservation request submitted successfully! Redirecting...
            </div>
          )}

          <ReservationForm 
            onSubmit={handleSubmit} 
            loading={loading} 
            initialExhibitionId={initialExhibitionId} 
          />
        </div>
      </div>
    </div>
  );
};

export default CreateReservationPage;

import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ReservationCard = ({ reservation }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {reservation.exhibition?.name || 'Unknown Exhibition'}
            </h3>
            <p className="text-sm text-slate-500">
              Reserved on: {new Date(reservation.created_at).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={reservation.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-slate-500">Date</p>
            <p className="font-medium text-slate-900">
              {new Date(reservation.reservation_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Stall Type</p>
            <p className="font-medium text-slate-900">{reservation.stall_type}</p>
          </div>
          <div>
            <p className="text-slate-500">Stall Size</p>
            <p className="font-medium text-slate-900">{reservation.stall_size}</p>
          </div>
          <div>
            <p className="text-slate-500">Quantity</p>
            <p className="font-medium text-slate-900">{reservation.quantity}</p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <Link
            to={`/reservations/${reservation.id}`}
            className="text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;

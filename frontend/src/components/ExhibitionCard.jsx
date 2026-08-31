import React from 'react';
import { Link } from 'react-router-dom';

const ExhibitionCard = ({ exhibition }) => {
  const startDate = new Date(exhibition.start_date).toLocaleDateString();
  const endDate = new Date(exhibition.end_date).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-50 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg className="w-24 h-24 text-brand-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"/>
          </svg>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
          {exhibition.name}
        </h3>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
          {exhibition.description || 'No description provided.'}
        </p>

        <div className="space-y-2 mb-6 text-sm">
          <div className="flex items-center text-slate-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {startDate} - {endDate}
          </div>
          <div className="flex items-center text-slate-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {exhibition.venue}
          </div>
        </div>

        <Link
          to={`/reservations/new?exhibition=${exhibition.id}`}
          className="w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Book Stall
        </Link>
      </div>
    </div>
  );
};

export default ExhibitionCard;

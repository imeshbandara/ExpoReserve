import React, { useState, useEffect } from 'react';
import { useExhibitions } from '../hooks/useExhibitions';

const ReservationForm = ({ onSubmit, loading, initialExhibitionId }) => {
  const { fetchAvailableExhibitions } = useExhibitions();
  const [exhibitions, setExhibitions] = useState([]);
  
  const [formData, setFormData] = useState({
    exhibition_id: initialExhibitionId || '',
    reservation_date: new Date().toISOString().split('T')[0],
    stall_type: 'STANDARD',
    stall_size: 'SMALL',
    quantity: 1,
    business_category: '',
    special_requirements: ''
  });

  useEffect(() => {
    fetchAvailableExhibitions().then(setExhibitions).catch(console.error);
  }, [fetchAvailableExhibitions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // format date for backend
    const dataToSubmit = {
      ...formData,
      reservation_date: new Date(formData.reservation_date).toISOString()
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Exhibition</label>
        <select
          name="exhibition_id"
          value={formData.exhibition_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        >
          <option value="" disabled>Select an exhibition</option>
          {exhibitions.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name} ({new Date(ex.start_date).toLocaleDateString()})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reservation Date</label>
          <input
            type="date"
            name="reservation_date"
            value={formData.reservation_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Business Category</label>
          <input
            type="text"
            name="business_category"
            value={formData.business_category}
            onChange={handleChange}
            required
            placeholder="e.g. Technology, Food & Bev"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stall Type</label>
          <select
            name="stall_type"
            value={formData.stall_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="STANDARD">Standard</option>
            <option value="PREMIUM">Premium</option>
            <option value="CORNER">Corner</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stall Size</label>
          <select
            name="stall_size"
            value={formData.stall_size}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="SMALL">Small (3x3m)</option>
            <option value="MEDIUM">Medium (6x3m)</option>
            <option value="LARGE">Large (6x6m)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            max="10"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Special Requirements (Optional)</label>
        <textarea
          name="special_requirements"
          value={formData.special_requirements}
          onChange={handleChange}
          rows="3"
          placeholder="Power supply, water connection, specific location preference..."
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        ></textarea>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Reservation Request'}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;

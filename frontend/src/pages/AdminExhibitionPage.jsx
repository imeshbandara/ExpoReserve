import React, { useEffect, useState } from 'react';
import { useExhibitions } from '../hooks/useExhibitions';

const AdminExhibitionPage = () => {
  const { fetchAdminExhibitions, createExhibition, loading } = useExhibitions();
  const [exhibitions, setExhibitions] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    start_date: '',
    end_date: '',
    max_stalls: 100
  });

  useEffect(() => {
    fetchAdminExhibitions().then(setExhibitions).catch(console.error);
  }, [fetchAdminExhibitions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'max_stalls' ? parseInt(value) : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };
      const newEx = await createExhibition(dataToSubmit);
      setExhibitions(prev => [...prev, newEx]);
      setIsCreating(false);
      setFormData({ name: '', description: '', venue: '', start_date: '', end_date: '', max_stalls: 100 });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create exhibition');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Exhibition Management</h1>
          <p className="text-slate-600 mt-2">Create and manage your exhibitions.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isCreating ? 'Cancel' : 'Create Exhibition'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">New Exhibition Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
                <input type="text" name="venue" value={formData.venue} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input type="datetime-local" name="start_date" value={formData.start_date} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Stalls Capacity</label>
                <input type="number" name="max_stalls" value={formData.max_stalls} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg"></textarea>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-8 rounded-lg">
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading && !isCreating && exhibitions.length === 0 ? (
          <p>Loading exhibitions...</p>
        ) : exhibitions.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-slate-500">
            You haven't created any exhibitions yet.
          </div>
        ) : (
          exhibitions.map(ex => (
            <div key={ex.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{ex.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{ex.venue} • {new Date(ex.start_date).toLocaleDateString()} to {new Date(ex.end_date).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {ex.max_stalls} Max Stalls
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminExhibitionPage;

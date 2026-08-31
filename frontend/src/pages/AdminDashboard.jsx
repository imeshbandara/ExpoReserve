import React, { useEffect, useState } from 'react';
import { useReservations } from '../hooks/useReservations';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const { fetchAllReservationsAdmin, updateReservationStatus, loading } = useReservations();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchAllReservationsAdmin().then(setReservations).catch(console.error);
  }, [fetchAllReservationsAdmin]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReservationStatus(id, newStatus);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update');
    }
  };

  const filtered = reservations.filter(r => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch = r.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.exhibition.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Manage all incoming stall reservations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Total Requests</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{reservations.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {reservations.filter(r => r.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {reservations.filter(r => r.status === 'APPROVED').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Rejected</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {reservations.filter(r => r.status === 'REJECTED').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filter === status ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search vendor or exhibition..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Vendor</th>
                <th className="px-6 py-4 font-semibold">Exhibition</th>
                <th className="px-6 py-4 font-semibold">Stall Details</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No reservations found.</td>
                </tr>
              ) : (
                filtered.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{res.vendor.name}</p>
                      <p className="text-xs text-slate-500">{res.vendor.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">{res.exhibition.name}</td>
                    <td className="px-6 py-4">
                      {res.quantity}x {res.stall_size} ({res.stall_type})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(res.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {res.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(res.id, 'APPROVED')}
                            className="text-green-600 hover:text-green-800 font-medium px-2 py-1 bg-green-50 rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(res.id, 'REJECTED')}
                            className="text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

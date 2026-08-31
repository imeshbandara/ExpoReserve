import { useState, useCallback } from 'react';
import api from '../api/axiosInstance';

export const useReservations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyReservations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/reservations');
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch reservations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/reservations', data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create reservation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/reservations/${id}`);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel reservation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReservationsAdmin = useCallback(async (status) => {
    setLoading(true);
    try {
      const url = status ? `/admin/reservations?status=${status}` : '/admin/reservations';
      const response = await api.get(url);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch admin reservations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReservationStatus = async (id, status) => {
    setLoading(true);
    try {
      const url = status === 'APPROVED' ? `/admin/reservations/${id}/approve` : `/admin/reservations/${id}/reject`;
      const response = await api.patch(url);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update reservation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchMyReservations,
    createReservation,
    cancelReservation,
    fetchAllReservationsAdmin,
    updateReservationStatus
  };
};

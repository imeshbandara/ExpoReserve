import { useState, useCallback } from 'react';
import api from '../api/axiosInstance';

export const useExhibitions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailableExhibitions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/exhibitions');
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch exhibitions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminExhibitions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/exhibitions');
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch admin exhibitions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createExhibition = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/exhibitions', data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create exhibition');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStallInventory = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/stall-inventory', data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update inventory');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchAvailableExhibitions,
    fetchAdminExhibitions,
    createExhibition,
    updateStallInventory
  };
};

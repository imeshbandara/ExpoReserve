import { useState, useCallback } from 'react';
import api from '../api/axiosInstance';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/profile');
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const response = await api.put('/user/profile', data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchProfile,
    updateProfile
  };
};

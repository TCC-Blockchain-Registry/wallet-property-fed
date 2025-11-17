import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { PropertyWithBlockchain } from '@/types/api';

export const useProperties = () => {
  const [properties, setProperties] = useState<PropertyWithBlockchain[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getMyProperties();
      setProperties(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar propriedades';
      setError(errorMessage);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    fetchMyProperties,
  };
};


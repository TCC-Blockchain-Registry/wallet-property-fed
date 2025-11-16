import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import type { PropertyWithBlockchain, PropertyFull, PropertyRegistrationRequest } from '../types/api';

export const useProperties = () => {
  const [properties, setProperties] = useState<PropertyWithBlockchain[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getMyProperties();
      setProperties(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar propriedades';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPropertyDetails = useCallback(async (matriculaId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: PropertyFull = await apiClient.getPropertyDetails(matriculaId);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar detalhes da propriedade';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerProperty = useCallback(
    async (data: PropertyRegistrationRequest) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.registerProperty(data);
        await fetchMyProperties();
        return result;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao registrar propriedade';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchMyProperties]
  );

  const fetchPropertiesByOwner = useCallback(async (walletAddress: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getPropertiesByOwner(walletAddress);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar propriedades do proprietário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    properties,
    loading,
    error,
    fetchMyProperties,
    fetchPropertyDetails,
    registerProperty,
    fetchPropertiesByOwner,
  };
};

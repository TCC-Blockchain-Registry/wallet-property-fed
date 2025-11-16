import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import type { Transfer } from '../types/api';

export const useTransfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTransfers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getMyTransfers();
      setTransfers(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar transferências';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const configureTransfer = useCallback(
    async (data: {
      matriculaId: string;
      buyerWallet: string;
      approverWallets: string[];
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.configureTransfer(data);
        await fetchMyTransfers();
        return result;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao configurar transferência';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchMyTransfers]
  );

  const approveTransfer = useCallback(
    async (data: { matriculaId: string; approverWallet: string }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.approveTransfer(data);
        await fetchMyTransfers();
        return result;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao aprovar transferência';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchMyTransfers]
  );

  const acceptTransfer = useCallback(
    async (data: { matriculaId: string; buyerWallet: string }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.acceptTransfer(data);
        await fetchMyTransfers();
        return result;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao aceitar transferência';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchMyTransfers]
  );

  const executeTransfer = useCallback(
    async (matriculaId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.executeTransfer(matriculaId);
        await fetchMyTransfers();
        return result;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao executar transferência';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchMyTransfers]
  );

  return {
    transfers,
    loading,
    error,
    fetchMyTransfers,
    configureTransfer,
    approveTransfer,
    acceptTransfer,
    executeTransfer,
  };
};

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { Transfer } from '@/types/api';

export const useTransfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTransfers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getMyTransfers();
      setTransfers(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar transferências';
      setError(errorMessage);
      console.error('Error fetching transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  const configureTransfer = async (data: {
    matriculaId: string;
    buyerWallet: string;
    approverWallets: string[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.configureTransfer(data);
      await fetchMyTransfers(); // Refresh list
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao configurar transferência';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const approveTransfer = async (data: {
    matriculaId: string;
    approverWallet: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.approveTransfer(data);
      await fetchMyTransfers(); // Refresh list
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao aprovar transferência';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const acceptTransfer = async (data: {
    matriculaId: string;
    buyerWallet: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.acceptTransfer(data);
      await fetchMyTransfers(); // Refresh list
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao aceitar transferência';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const executeTransfer = async (matriculaId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.executeTransfer(matriculaId);
      await fetchMyTransfers(); // Refresh list
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao executar transferência';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTransfers();
  }, []);

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


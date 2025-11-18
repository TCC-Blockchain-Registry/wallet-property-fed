import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { Transfer } from '@/types/api';

export const useMyTransfers = () => {
  return useQuery<Transfer[], Error>({
    queryKey: ['transfers', 'my'],
    queryFn: () => apiClient.getMyTransfers(),
  });
};

export const useConfigureTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { matriculaId: number; toWalletAddress?: string; toCpf?: string }) =>
      apiClient.configureTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useApproveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { matriculaId: string; approverWallet: string }) =>
      apiClient.approveTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
};

export const useAcceptTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { matriculaId: string; buyerWallet: string }) =>
      apiClient.acceptTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
};

export const useExecuteTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matriculaId: string) => apiClient.executeTransfer(matriculaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

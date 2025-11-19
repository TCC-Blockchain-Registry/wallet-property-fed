import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

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

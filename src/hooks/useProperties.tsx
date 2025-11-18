import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { PropertyWithBlockchain, PropertyFull, PropertyRegistrationRequest } from '@/types/api';

export const useMyProperties = () => {
  return useQuery<PropertyWithBlockchain[], Error>({
    queryKey: ['properties', 'my'],
    queryFn: () => apiClient.getMyProperties(),
  });
};

export const usePropertyDetails = (matriculaId: string | null) => {
  return useQuery<PropertyFull, Error>({
    queryKey: ['properties', matriculaId],
    queryFn: () => apiClient.getPropertyDetails(matriculaId!),
    enabled: !!matriculaId,
  });
};

export const usePropertiesByOwner = (walletAddress: string | null) => {
  return useQuery<PropertyWithBlockchain[], Error>({
    queryKey: ['properties', 'owner', walletAddress],
    queryFn: () => apiClient.getPropertiesByOwner(walletAddress!),
    enabled: !!walletAddress,
  });
};

export const useRegisterProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PropertyRegistrationRequest) => apiClient.registerProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

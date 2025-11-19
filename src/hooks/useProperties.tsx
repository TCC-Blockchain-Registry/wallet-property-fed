import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { PropertyWithBlockchain, PropertyRegistrationRequest } from '@/types/api';

export const useMyProperties = () => {
  return useQuery<PropertyWithBlockchain[], Error>({
    queryKey: ['properties', 'my'],
    queryFn: () => apiClient.getMyProperties(),
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

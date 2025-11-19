export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getErrorMessage(error: unknown, defaultMessage = "Erro desconhecido"): string {
  const axiosError = error as { response?: { data?: { message?: string } } };
  return axiosError?.response?.data?.message || defaultMessage;
}

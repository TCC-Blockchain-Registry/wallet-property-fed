export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  walletAddress?: string;
  role: 'USER' | 'ADMIN' | 'NOTARY';
  active: boolean;
  createdAt: string;
}

export interface PropertyMetadata {
  matriculaId: number;
  folha: number;
  comarca: string;
  endereco: string;
  metragem: number;
  ownerWalletAddress: string;
  ownerCpf?: string;
  propertyType: string;
  regularStatus?: 'REGULAR' | 'IRREGULAR';
  registrationDate?: string;
  status?: 'PENDING' | 'PROCESSING' | 'PENDING_APPROVALS' | 'EXECUTED' | 'FAILED';
}

export interface PropertyBlockchainData {
  ownerWallet: string;
  tokenId: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  isFrozen: boolean;
}

export interface PropertyWithBlockchain extends PropertyMetadata {
  blockchain: PropertyBlockchainData | null;
}

export interface PropertyRegistrationRequest {
  matriculaId: number;
  folha: number;
  comarca: string;
  endereco: string;
  metragem: number;
  proprietario: string;
  matriculaOrigem?: number;
  tipo: 'URBANO' | 'RURAL' | 'LITORAL';
  isRegular?: boolean;
}


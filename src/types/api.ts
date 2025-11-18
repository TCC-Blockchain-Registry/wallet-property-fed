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

export interface RegisterRequest {
  name: string;
  email: string;
  cpf: string;
  password: string;
  walletAddress?: string;
  role?: 'USER' | 'ADMIN';
}

export interface RegisterResponse {
  message: string;
  userId: number;
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

export interface PropertyFull {
  dbData: PropertyMetadata;
  blockchainData: PropertyBlockchainData;
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

export interface Transfer {
  id: number;
  matriculaId: string;
  sellerWallet: string;
  buyerWallet: string;
  approverWallets: string[];
  status: 'PENDING_APPROVAL' | 'PENDING_BUYER' | 'READY_TO_EXECUTE' | 'COMPLETED' | 'CANCELLED';
  configuredAt: string;
  completedAt?: string;
}

export interface TransferConfigureRequest {
  matriculaId: number;
  toWalletAddress?: string;
  toCpf?: string;
}

export interface TransferApproveRequest {
  matriculaId: string;
  approverWallet: string;
}

export interface TransferAcceptRequest {
  matriculaId: string;
  buyerWallet: string;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded';
  services: {
    bff: {
      status: string;
      timestamp: string;
    };
    orchestrator: {
      status: string;
      url?: string;
    };
    offchainApi: {
      status: string;
      url?: string;
    };
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}

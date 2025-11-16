import axios, { AxiosInstance, AxiosError } from 'axios';
import { PropertyRegistrationRequest } from '../types/api';

const API_BASE_URL = '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token JWT
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(data: {
    name: string;
    email: string;
    cpf: string;
    password: string;
    walletAddress: string;
  }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async updateWallet(walletAddress: string) {
    const response = await this.client.put('/auth/wallet', { walletAddress });
    return response.data;
  }

  // Property endpoints
  async getMyProperties() {
    const response = await this.client.get('/properties/my');
    return response.data;
  }

  async getPropertyDetails(matriculaId: string) {
    const response = await this.client.get(`/properties/${matriculaId}/full`);
    return response.data;
  }

  async registerProperty(data: PropertyRegistrationRequest) {
    const response = await this.client.post('/properties/register', data);
    return response.data;
  }

  async getPropertiesByOwner(walletAddress: string) {
    const response = await this.client.get(`/properties/owner/${walletAddress}`);
    return response.data;
  }

  // Transfer endpoints
  async getMyTransfers() {
    const response = await this.client.get('/transfers/my');
    return response.data;
  }

  async configureTransfer(data: {
    matriculaId: string;
    buyerWallet: string;
    approverWallets: string[];
  }) {
    const response = await this.client.post('/transfers/configure', data);
    return response.data;
  }

  async approveTransfer(data: {
    matriculaId: string;
    approverWallet: string;
  }) {
    const response = await this.client.post('/transfers/approve', data);
    return response.data;
  }

  async acceptTransfer(data: {
    matriculaId: string;
    buyerWallet: string;
  }) {
    const response = await this.client.post('/transfers/accept', data);
    return response.data;
  }

  async executeTransfer(matriculaId: string) {
    const response = await this.client.post('/transfers/execute', { matriculaId });
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();

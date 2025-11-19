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

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(data: {
    name: string;
    email: string;
    cpf: string;
    password: string;
    walletAddress?: string;
  }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async updateWallet(walletAddress: string) {
    const response = await this.client.put('/auth/wallet', { walletAddress });
    return response.data;
  }

  async getMyProperties() {
    const response = await this.client.get('/properties/my');
    return response.data;
  }

  async registerProperty(data: PropertyRegistrationRequest) {
    const response = await this.client.post('/properties/register', data);
    return response.data;
  }

  async configureTransfer(data: {
    matriculaId: number;
    toWalletAddress?: string;
    toCpf?: string;
  }) {
    const response = await this.client.post('/transfers/configure', data);
    return response.data;
  }

  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();

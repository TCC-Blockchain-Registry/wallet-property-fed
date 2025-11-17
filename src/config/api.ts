/**
 * API Configuration
 * 
 * This file centralizes all API endpoint configurations
 */

// Base URL for API calls
// In production (Docker), this will use the nginx proxy
// In development, it will use the BFF directly
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Full API endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
  },

  // Properties
  properties: {
    list: `${API_BASE_URL}/properties`,
    my: `${API_BASE_URL}/properties/my`,
    byId: (id: string | number) => `${API_BASE_URL}/properties/${id}`,
    byMatricula: (matriculaId: string | number) => `${API_BASE_URL}/properties/${matriculaId}/full`,
    byOwner: (walletAddress: string) => `${API_BASE_URL}/properties/owner/${walletAddress}`,
    register: `${API_BASE_URL}/properties/register`,
    search: `${API_BASE_URL}/properties/search`,
  },

  // Transfers
  transfers: {
    list: `${API_BASE_URL}/transfers`,
    byId: (id: string | number) => `${API_BASE_URL}/transfers/${id}`,
    initiate: `${API_BASE_URL}/transfers/initiate`,
    approve: (id: string | number) => `${API_BASE_URL}/transfers/${id}/approve`,
    execute: (id: string | number) => `${API_BASE_URL}/transfers/${id}/execute`,
    cancel: (id: string | number) => `${API_BASE_URL}/transfers/${id}/cancel`,
  },

  // Health check
  health: `${API_BASE_URL}/health`,
} as const;

// HTTP Client configuration
export const httpConfig = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper to get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper to set auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};


import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "../services/api";
import type { User, LoginResponse } from "../types/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    cpf: string;
    password: string;
    walletAddress?: string;
  }) => Promise<void>;
  logout: () => void;
  updateWalletAddress: (address: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await apiClient.login(email, password);

      setToken(response.token);
      setUser(response.user);

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Falha ao fazer login");
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    cpf: string;
    password: string;
    walletAddress?: string;
  }) => {
    try {
      await apiClient.register(data);
      await login(data.email, data.password);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Falha ao registrar");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  const updateWalletAddress = async (address: string) => {
    if (!user) return;

    try {
      // Salvar wallet address no backend
      await apiClient.updateWallet(address);

      // Atualizar estado local após sucesso
      const updatedUser = { ...user, walletAddress: address };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update wallet address:", error);
      // Ainda assim atualiza localmente para não quebrar a UX
      // mas o backend ficará desatualizado
      const updatedUser = { ...user, walletAddress: address };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, updateWalletAddress, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

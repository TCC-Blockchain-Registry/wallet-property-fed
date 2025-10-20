import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  walletAddress: string;
  role: "USER" | "ADMIN";
  active: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateWalletAddress: (address: string) => void;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe um usuário no localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simular chamada de API
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("Credenciais inválidas");
    }

    const userData: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      walletAddress: foundUser.walletAddress || "",
      role: foundUser.role,
      active: true,
      createdAt: foundUser.createdAt,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    // Simular chamada de API
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error("Email já cadastrado");
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // Em produção, isso seria hasheado no backend
      walletAddress: "",
      role: "USER" as const,
      active: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      walletAddress: newUser.walletAddress,
      role: newUser.role,
      active: newUser.active,
      createdAt: newUser.createdAt,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateWalletAddress = (address: string) => {
    if (!user) return;

    const updatedUser = { ...user, walletAddress: address };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Atualizar também no array de usuários
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].walletAddress = address;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateWalletAddress, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

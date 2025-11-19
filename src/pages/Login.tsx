import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { validateCPF, formatCPF, cleanCPF } from "@/utils/cpfValidator";
import { ethers, isAddress } from "ethers";
import { Loader2 } from "lucide-react";
import { UserDataForm } from "@/components/auth/UserDataForm";
import { WalletConnectForm } from "@/components/auth/WalletConnectForm";

const METAMASK_USER_REJECTED = 4001;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading && location.pathname === "/login") {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate, location.pathname]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setRegisterData({ ...registerData, cpf: formatted });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!validateCPF(registerData.cpf)) {
      toast.error("CPF inválido. Por favor, verifique os dígitos.");
      return;
    }

    if (!registerData.email.trim()) {
      toast.error("Email é obrigatório");
      return;
    }

    if (!registerData.password || registerData.password.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    setRegisterStep(2);
  };

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);

    try {
      if (typeof (window as { ethereum?: unknown }).ethereum === "undefined") {
        toast.error("MetaMask não encontrado. Por favor, instale a extensão.");
        return;
      }

      const provider = new ethers.BrowserProvider(
        (window as { ethereum: ethers.Eip1193Provider }).ethereum
      );
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0 && isAddress(accounts[0])) {
        setConnectedWallet(accounts[0]);
        toast.success("Carteira conectada!");
      }
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && (error as { code: number }).code === METAMASK_USER_REJECTED) {
        toast.error("Conexão com MetaMask cancelada");
      } else {
        toast.error("Erro ao conectar com MetaMask");
      }
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleRegister = async () => {
    if (!connectedWallet) {
      toast.error("Conecte sua carteira MetaMask para continuar");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: registerData.name,
        email: registerData.email,
        cpf: cleanCPF(registerData.cpf),
        password: registerData.password,
        walletAddress: connectedWallet,
      });

      toast.success("Cadastro realizado com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  const resetRegisterForm = () => {
    setRegisterStep(1);
    setConnectedWallet(null);
    setRegisterData({ name: "", cpf: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Carteira de Imóveis
          </h1>
          <p className="text-muted-foreground">
            Plataforma de gestão imobiliária Web3
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full" onValueChange={() => resetRegisterForm()}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar sua conta
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>
                  {registerStep === 1 ? "Criar Conta" : "Conectar Carteira"}
                </CardTitle>
                <CardDescription>
                  {registerStep === 1
                    ? "Preencha seus dados para criar sua conta"
                    : "Conecte sua carteira MetaMask para finalizar"
                  }
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`h-2 flex-1 rounded-full ${registerStep >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                  <div className={`h-2 flex-1 rounded-full ${registerStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                </div>
              </CardHeader>

              {registerStep === 1 && (
                <UserDataForm
                  data={registerData}
                  onChange={setRegisterData}
                  onCpfChange={handleCpfChange}
                  onSubmit={handleStep1Submit}
                />
              )}

              {registerStep === 2 && (
                <WalletConnectForm
                  connectedWallet={connectedWallet}
                  isConnecting={isConnectingWallet}
                  isSubmitting={isLoading}
                  onConnect={handleConnectWallet}
                  onBack={() => setRegisterStep(1)}
                  onSubmit={handleRegister}
                />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;

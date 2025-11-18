import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { LogOut, Wallet, ArrowRightLeft, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { ethers } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyProperties } from "@/hooks/useProperties";
import { useConfigureTransfer } from "@/hooks/useTransfers";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout, updateWalletAddress } = useAuth();
  const { data: properties = [], isLoading: propertiesLoading, error: propertiesError, refetch: refetchProperties } = useMyProperties();
  const configureTransferMutation = useConfigureTransfer();
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedMatricula, setSelectedMatricula] = useState<number | null>(null);
  const [transferType, setTransferType] = useState<"cpf" | "wallet">("wallet");
  const [cpfValue, setCpfValue] = useState("");
  const [walletValue, setWalletValue] = useState("");

  const handleTransfer = (matriculaId: number) => {
    setSelectedMatricula(matriculaId);
    setIsTransferDialogOpen(true);
  };

  const confirmTransfer = async () => {
    const transferTo = transferType === "cpf" ? cpfValue : walletValue;

    if (!transferTo.trim()) {
      toast.error(
        transferType === "cpf"
          ? "Por favor, informe o CPF do destinatário"
          : "Por favor, informe o endereço da wallet"
      );
      return;
    }

    if (!selectedMatricula) {
      toast.error("Matrícula não selecionada");
      return;
    }

    try {
      setIsTransferDialogOpen(false);

      await configureTransferMutation.mutateAsync({
        matriculaId: selectedMatricula,
        toWalletAddress: transferType === "wallet" ? transferTo : undefined,
        toCpf: transferType === "cpf" ? transferTo.replace(/\D/g, "") : undefined,
      });

      toast.success(
        `Transferência da matrícula #${selectedMatricula} iniciada com sucesso!`,
        { duration: 4000 }
      );

      setCpfValue("");
      setWalletValue("");
      setSelectedMatricula(null);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao transferir propriedade";
      toast.error(errorMessage);
    }
  };

  const handleDialogClose = () => {
    setIsTransferDialogOpen(false);
    setCpfValue("");
    setWalletValue("");
    setSelectedMatricula(null);
    setTransferType("wallet");
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpfValue(formatted);
  };

  useEffect(() => {
    const connectWalletAutomatically = async () => {
      if (!user?.walletAddress && !isConnectingWallet) {
        setIsConnectingWallet(true);
        try {
          if (typeof (window as any).ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);

            if (accounts.length > 0) {
              updateWalletAddress(accounts[0]);
              toast.success("MetaMask conectado automaticamente!");
            }
          } else {
            toast.error("MetaMask não encontrado. Por favor, instale a extensão.");
          }
        } catch (error: any) {
          if (error.code === 4001) {
            toast.error("Conexão com MetaMask cancelada");
          } else {
            toast.error("Erro ao conectar com MetaMask");
          }
        } finally {
          setIsConnectingWallet(false);
        }
      }
    };

    connectWalletAutomatically();
  }, [user?.walletAddress, updateWalletAddress, isConnectingWallet]);


  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Carteira de Imóveis
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">{user?.name}</span>
              {user?.walletAddress && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Wallet className="h-3 w-3" />
                  {formatAddress(user.walletAddress)}
                </span>
              )}
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/register-property")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Imóvel
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-8 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meus Imóveis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie sua carteira de propriedades digitais de forma segura e transparente
          </p>
        </div>

        {propertiesLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando propriedades...</p>
          </div>
        )}

        {propertiesError && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-destructive mb-4">Erro ao carregar propriedades</p>
            <Button onClick={() => refetchProperties()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        )}

        {!propertiesLoading && !propertiesError && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground mb-4">Você ainda não possui propriedades cadastradas</p>
            <p className="text-sm text-muted-foreground">
              Registre sua primeira propriedade para começar
            </p>
          </div>
        )}

        {!propertiesLoading && !propertiesError && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.matriculaId}
                matriculaId={property.matriculaId}
                folha={property.folha}
                comarca={property.comarca}
                endereco={property.endereco}
                metragem={property.metragem}
                proprietario={property.ownerWalletAddress}
                tipo={property.propertyType as "URBANO" | "LITORAL" | "RURAL"}
                isRegular={property.regularStatus === "REGULAR"}
                status={property.status as any}
                onTransfer={() => handleTransfer(property.matriculaId)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container px-4 md:px-8 py-8 text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 Carteira de Imóveis. Plataforma de gestão imobiliária Web3.
          </p>
        </div>
      </footer>

      <Dialog open={isTransferDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              Transferir Propriedade
            </DialogTitle>
            <DialogDescription>
              Informe os dados do novo proprietário para transferir a matrícula #{selectedMatricula}.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs 
            value={transferType} 
            onValueChange={(value) => setTransferType(value as "cpf" | "wallet")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="cpf">CPF</TabsTrigger>
            </TabsList>

            <TabsContent value="wallet" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-address" className="text-sm font-medium">
                  Endereço da Wallet
                </Label>
                <Input
                  id="wallet-address"
                  placeholder="0x742d35Cc6634C0532925a3b844Bc..."
                  value={walletValue}
                  onChange={(e) => setWalletValue(e.target.value)}
                  className="w-full font-mono text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      confirmTransfer();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Digite o endereço da carteira Ethereum do destinatário
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cpf" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="cpf-number" className="text-sm font-medium">
                  CPF do Destinatário
                </Label>
                <Input
                  id="cpf-number"
                  placeholder="000.000.000-00"
                  value={cpfValue}
                  onChange={handleCpfChange}
                  className="w-full"
                  maxLength={14}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      confirmTransfer();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  O CPF será formatado automaticamente enquanto você digita
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={handleDialogClose}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmTransfer}
              disabled={configureTransferMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {configureTransferMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Confirmar Transferência
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

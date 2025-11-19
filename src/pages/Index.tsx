import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyCard } from "@/components/PropertyCard";
import { TransferDialog } from "@/components/TransferDialog";
import { Button } from "@/components/ui/button";
import { LogOut, Wallet, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { ethers } from "ethers";
import { useMyProperties } from "@/hooks/useProperties";
import { formatAddress } from "@/utils/formatters";

const METAMASK_USER_REJECTED = 4001;

const Index = () => {
  const navigate = useNavigate();
  const { user, logout, updateWalletAddress } = useAuth();
  const { data: properties = [], isLoading: propertiesLoading, error: propertiesError, refetch: refetchProperties } = useMyProperties();
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedMatricula, setSelectedMatricula] = useState<number | null>(null);

  const handleTransfer = (matriculaId: number) => {
    setSelectedMatricula(matriculaId);
    setIsTransferDialogOpen(true);
  };

  const handleTransferClose = () => {
    setIsTransferDialogOpen(false);
    setSelectedMatricula(null);
  };

  const handleTransferSuccess = () => {
    setIsTransferDialogOpen(false);
    setSelectedMatricula(null);
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
        } catch (error: unknown) {
          if (error instanceof Error && 'code' in error && error.code === METAMASK_USER_REJECTED) {
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
            © {new Date().getFullYear()} Carteira de Imóveis. Plataforma de gestão imobiliária Web3.
          </p>
        </div>
      </footer>

      <TransferDialog
        isOpen={isTransferDialogOpen}
        matriculaId={selectedMatricula}
        onClose={handleTransferClose}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Wallet } from "lucide-react";

export const WalletConnect = () => {
  const [account, setAccount] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) return;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      
      if (!ethereum) {
        toast.error("MetaMask não detectado", {
          description: "Por favor, instale a extensão MetaMask no seu navegador"
        });
        return;
      }

      setIsConnecting(true);
      
      const provider = new BrowserProvider(ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      setAccount(accounts[0]);
      toast.success("Carteira conectada!", {
        description: `Endereço: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error("Erro ao conectar", {
        description: error.message || "Não foi possível conectar à carteira"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    toast.info("Carteira desconectada");
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  return (
    <div className="flex items-center gap-3">
      {account ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
            <Wallet className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">
              {formatAddress(account)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
          >
            Desconectar
          </Button>
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? "Conectando..." : "Conectar MetaMask"}
        </Button>
      )}
    </div>
  );
};

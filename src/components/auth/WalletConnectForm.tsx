import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Wallet, CheckCircle, ArrowLeft } from "lucide-react";
import { formatAddress } from "@/utils/formatters";

interface WalletConnectFormProps {
  connectedWallet: string | null;
  isConnecting: boolean;
  isSubmitting: boolean;
  onConnect: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const WalletConnectForm = ({
  connectedWallet,
  isConnecting,
  isSubmitting,
  onConnect,
  onBack,
  onSubmit,
}: WalletConnectFormProps) => {
  return (
    <>
      <CardContent className="space-y-6">
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Para criar sua conta e gerenciar imóveis, conecte sua carteira MetaMask.
          </p>

          {!connectedWallet ? (
            <Button
              onClick={onConnect}
              disabled={isConnecting}
              variant="outline"
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Conectar MetaMask
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-mono text-sm">
                {formatAddress(connectedWallet)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !connectedWallet}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </CardFooter>
    </>
  );
};

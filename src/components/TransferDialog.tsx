import { useState } from "react";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isAddress } from "ethers";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfigureTransfer } from "@/hooks/useTransfers";
import { formatCPF } from "@/utils/cpfValidator";
import { getErrorMessage } from "@/utils/formatters";

interface TransferDialogProps {
  isOpen: boolean;
  matriculaId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TOAST_DURATION_MS = 4000;

export const TransferDialog = ({
  isOpen,
  matriculaId,
  onClose,
  onSuccess,
}: TransferDialogProps) => {
  const configureTransferMutation = useConfigureTransfer();
  const [transferType, setTransferType] = useState<"cpf" | "wallet">("wallet");
  const [cpfValue, setCpfValue] = useState("");
  const [walletValue, setWalletValue] = useState("");

  const resetForm = () => {
    setCpfValue("");
    setWalletValue("");
    setTransferType("wallet");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpfValue(formatCPF(e.target.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmTransfer();
    }
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

    if (transferType === "wallet" && !isAddress(transferTo)) {
      toast.error("Endereço Ethereum inválido");
      return;
    }

    if (!matriculaId) {
      toast.error("Matrícula não selecionada");
      return;
    }

    try {
      await configureTransferMutation.mutateAsync({
        matriculaId,
        toWalletAddress: transferType === "wallet" ? transferTo : undefined,
        toCpf: transferType === "cpf" ? transferTo.replace(/\D/g, "") : undefined,
      });

      toast.success(
        `Transferência da matrícula #${matriculaId} iniciada com sucesso!`,
        { duration: TOAST_DURATION_MS }
      );

      resetForm();
      onSuccess();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao transferir propriedade"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Transferir Propriedade
          </DialogTitle>
          <DialogDescription>
            Informe os dados do novo proprietário para transferir a matrícula #{matriculaId}.
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
                onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
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
            onClick={handleClose}
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
  );
};

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, Ruler, Shield, ArrowRightLeft, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export type PropertyType = "URBANO" | "RURAL" | "LITORAL";
export type PropertyStatus = "PENDING" | "PROCESSING" | "PENDING_APPROVALS" | "EXECUTED" | "FAILED";

interface PropertyCardProps {
  matriculaId: number;
  folha: number;
  comarca: string;
  endereco: string;
  metragem: number;
  proprietario: string;
  tipo: PropertyType;
  isRegular: boolean;
  status?: PropertyStatus;
  onTransfer?: () => void;
}

export const PropertyCard = ({
  matriculaId,
  folha,
  comarca,
  endereco,
  metragem,
  tipo,
  isRegular,
  status = "PENDING",
  onTransfer,
}: PropertyCardProps) => {
  const getTipoLabel = (tipo: PropertyType) => {
    const labels = {
      URBANO: "Urbano",
      RURAL: "Rural",
      LITORAL: "Litoral"
    };
    return labels[tipo];
  };

  const getTipoColor = (tipo: PropertyType) => {
    const colors = {
      URBANO: "bg-blue-600 text-white shadow-lg",
      RURAL: "bg-green-600 text-white shadow-lg",
      LITORAL: "bg-cyan-600 text-white shadow-lg"
    };
    return colors[tipo];
  };

  const getStatusInfo = (status?: PropertyStatus | string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
      PENDING: {
        label: "Pendente",
        color: "bg-gray-500 text-white",
        icon: Clock
      },
      PROCESSING: {
        label: "Processando",
        color: "bg-blue-500 text-white",
        icon: Loader2
      },
      PENDING_APPROVALS: {
        label: "Aguardando Aprovações",
        color: "bg-yellow-500 text-white",
        icon: AlertCircle
      },
      EXECUTED: {
        label: "Executado",
        color: "bg-green-600 text-white",
        icon: CheckCircle
      },
      FAILED: {
        label: "Falhou",
        color: "bg-red-600 text-white",
        icon: AlertCircle
      }
    };
    
    // Se o status não for reconhecido, retorna PENDING como fallback
    return statusConfig[status || "PENDING"] || statusConfig.PENDING;
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="relative p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge className={`font-semibold text-sm px-3 py-1.5 ${getTipoColor(tipo)}`}>
              {getTipoLabel(tipo)}
            </Badge>
            {isRegular && (
              <Badge className="bg-green-600 text-white shadow-lg font-semibold text-sm px-2 py-1.5">
                <Shield className="w-3 h-3" />
              </Badge>
            )}
          </div>
          <Badge className={`font-semibold text-xs px-2 py-1.5 flex items-center gap-1 ${statusInfo.color}`}>
            <StatusIcon className={`w-3 h-3 ${status === "PROCESSING" ? "animate-spin" : ""}`} />
            {statusInfo.label}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            Matrícula #{matriculaId}
          </h3>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">{endereco}</p>
              <p className="text-xs">{comarca}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 pt-4 border-t border-border text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Ruler className="w-4 h-4" />
            <span className="font-medium">{metragem.toLocaleString('pt-BR')}m²</span>
          </div>
          
          <div className="text-muted-foreground">
            <span className="text-xs">Folha:</span>
            <span className="font-medium ml-1">{folha}</span>
          </div>
        </div>

        {onTransfer && (
          <Button 
            onClick={onTransfer}
            className="w-full mt-4 bg-primary hover:bg-primary/90"
            size="sm"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Transferir
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

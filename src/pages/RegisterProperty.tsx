import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, AlertCircle, Building2 } from "lucide-react";

/**
 * NOTA: Esta funcionalidade simula o papel administrativo de um cartório para fins de demonstração/testes.
 * Em produção, o registro de propriedades seria realizado por sistemas notariais externos autorizados.
 *
 * O frontend do usuário comum NÃO deveria ter acesso a esta funcionalidade.
 * Esta página existe apenas para facilitar testes do TCC.
 */

const RegisterProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { registerProperty, loading } = useProperties();

  const [formData, setFormData] = useState({
    matriculaId: "",
    folha: "",
    comarca: "",
    endereco: "",
    metragem: "",
    tipo: "URBANO" as "URBANO" | "RURAL" | "LITORAL",
    isRegular: true,
    matriculaOrigem: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.matriculaId || !formData.folha || !formData.comarca ||
        !formData.endereco || !formData.metragem) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!user?.walletAddress) {
      toast.error("Conecte sua carteira MetaMask para registrar propriedades");
      return;
    }

    try {
      await registerProperty({
        matriculaId: parseInt(formData.matriculaId),
        folha: parseInt(formData.folha),
        comarca: formData.comarca,
        endereco: formData.endereco,
        metragem: parseInt(formData.metragem),
        proprietario: user.walletAddress,
        tipo: formData.tipo,
        isRegular: formData.isRegular,
        matriculaOrigem: formData.matriculaOrigem ? parseInt(formData.matriculaOrigem) : undefined,
      });

      toast.success("Propriedade registrada com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao registrar propriedade");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Registrar Propriedade</h1>
          </div>
          <p className="text-muted-foreground">
            Cadastre uma nova propriedade no sistema
          </p>
        </div>

        {/* Warning Badge */}
        <div className="mb-6 p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-500 dark:text-yellow-400">
              ⚠️ Funcionalidade Administrativa - Apenas para Demonstração
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Em produção, o registro de propriedades seria realizado por sistemas notariais externos (cartórios).
              Esta interface existe apenas para facilitar testes do sistema.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Propriedade</CardTitle>
            <CardDescription>
              Preencha as informações da matrícula do imóvel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Matrícula e Folha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matriculaId">
                    Matrícula <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="matriculaId"
                    type="number"
                    placeholder="Ex: 12345"
                    value={formData.matriculaId}
                    onChange={(e) => handleInputChange("matriculaId", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Número único da matrícula do imóvel
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="folha">
                    Folha <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="folha"
                    type="number"
                    placeholder="Ex: 100"
                    value={formData.folha}
                    onChange={(e) => handleInputChange("folha", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Número da folha no livro de registro
                  </p>
                </div>
              </div>

              {/* Comarca */}
              <div className="space-y-2">
                <Label htmlFor="comarca">
                  Comarca <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="comarca"
                  type="text"
                  placeholder="Ex: São Paulo - SP"
                  value={formData.comarca}
                  onChange={(e) => handleInputChange("comarca", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Jurisdição/comarca onde o imóvel está registrado
                </p>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco">
                  Endereço Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endereco"
                  type="text"
                  placeholder="Ex: Rua das Flores, 123, Centro"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange("endereco", e.target.value)}
                  required
                />
              </div>

              {/* Metragem e Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metragem">
                    Metragem (m²) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="metragem"
                    type="number"
                    placeholder="Ex: 250"
                    value={formData.metragem}
                    onChange={(e) => handleInputChange("metragem", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">
                    Tipo de Imóvel <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => handleInputChange("tipo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="URBANO">Urbano</SelectItem>
                      <SelectItem value="RURAL">Rural</SelectItem>
                      <SelectItem value="LITORAL">Litoral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Matrícula Origem */}
              <div className="space-y-2">
                <Label htmlFor="matriculaOrigem">
                  Matrícula de Origem (Opcional)
                </Label>
                <Input
                  id="matriculaOrigem"
                  type="number"
                  placeholder="Ex: 11111"
                  value={formData.matriculaOrigem}
                  onChange={(e) => handleInputChange("matriculaOrigem", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Caso seja desmembramento ou remembramento de outra matrícula
                </p>
              </div>

              {/* Status Regular */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRegular"
                  checked={formData.isRegular}
                  onCheckedChange={(checked) => handleInputChange("isRegular", checked as boolean)}
                />
                <Label htmlFor="isRegular" className="cursor-pointer">
                  Situação regular (sem pendências)
                </Label>
              </div>

              {/* Proprietário Info */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <Label className="text-sm font-medium">Proprietário</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{user?.name}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {user?.walletAddress
                      ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
                      : "Carteira não conectada"
                    }
                  </span>
                </div>
                {!user?.walletAddress && (
                  <p className="text-xs text-red-500">
                    ⚠️ Conecte sua carteira MetaMask para continuar
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || !user?.walletAddress}
                >
                  {loading ? "Registrando..." : "Registrar Propriedade"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Campos marcados com <span className="text-red-500">*</span> são obrigatórios
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterProperty;

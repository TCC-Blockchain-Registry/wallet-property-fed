import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useRegisterProperty } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, AlertCircle, Building2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const propertyFormSchema = z.object({
  matriculaId: z.coerce.number().int().positive("Matrícula deve ser um número positivo"),
  folha: z.coerce.number().int().positive("Folha deve ser um número positivo"),
  comarca: z.string().min(1, "Comarca é obrigatória"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  metragem: z.coerce.number().int().positive("Metragem deve ser um número positivo"),
  tipo: z.enum(["URBANO", "RURAL", "LITORAL"]),
  isRegular: z.boolean(),
  matriculaOrigem: z.union([z.coerce.number().int().positive(), z.literal("")]).optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const RegisterProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const registerMutation = useRegisterProperty();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      matriculaId: undefined,
      folha: undefined,
      comarca: "",
      endereco: "",
      metragem: undefined,
      tipo: "URBANO",
      isRegular: true,
      matriculaOrigem: "",
    },
  });

  const onSubmit = async (data: PropertyFormValues) => {
    if (!user?.walletAddress) {
      toast.error("Conecte sua carteira MetaMask para registrar propriedades");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        matriculaId: data.matriculaId,
        folha: data.folha,
        comarca: data.comarca,
        endereco: data.endereco,
        metragem: data.metragem,
        proprietario: user.walletAddress,
        tipo: data.tipo,
        isRegular: data.isRegular,
        matriculaOrigem: data.matriculaOrigem ? Number(data.matriculaOrigem) : undefined,
      });

      toast.success("Propriedade registrada com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao registrar propriedade");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
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

        <div className="mb-6 p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-500 dark:text-yellow-400">
              Funcionalidade Administrativa - Apenas para Demonstração
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Em produção, o registro de propriedades seria realizado por sistemas notariais externos (cartórios).
              Esta interface existe apenas para facilitar testes do sistema.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados da Propriedade</CardTitle>
            <CardDescription>
              Preencha as informações da matrícula do imóvel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="matriculaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Matrícula <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 12345"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Número único da matrícula do imóvel
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="folha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Folha <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 100"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Número da folha no livro de registro
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="comarca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Comarca <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: São Paulo - SP"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Jurisdição/comarca onde o imóvel está registrado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Endereço Completo <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Rua das Flores, 123, Centro"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="metragem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Metragem (m²) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 250"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tipo de Imóvel <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="URBANO">Urbano</SelectItem>
                            <SelectItem value="RURAL">Rural</SelectItem>
                            <SelectItem value="LITORAL">Litoral</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="matriculaOrigem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula de Origem (Opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 11111"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Caso seja desmembramento ou remembramento de outra matrícula
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRegular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Situação regular (sem pendências)
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm font-medium">Proprietário</p>
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
                      Conecte sua carteira MetaMask para continuar
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={registerMutation.isPending || !user?.walletAddress}
                  >
                    {registerMutation.isPending ? "Registrando..." : "Registrar Propriedade"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    disabled={registerMutation.isPending}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

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

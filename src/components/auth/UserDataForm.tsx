import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface UserData {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

interface UserDataFormProps {
  data: UserData;
  onChange: (data: UserData) => void;
  onCpfChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const UserDataForm = ({
  data,
  onChange,
  onCpfChange,
  onSubmit,
}: UserDataFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="register-name">Nome Completo</Label>
          <Input
            id="register-name"
            type="text"
            placeholder="João da Silva"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-cpf">CPF</Label>
          <Input
            id="register-cpf"
            type="text"
            placeholder="000.000.000-00"
            value={data.cpf}
            onChange={onCpfChange}
            maxLength={14}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            placeholder="seu@email.com"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Senha</Label>
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••"
            value={data.password}
            onChange={(e) => onChange({ ...data, password: e.target.value })}
            required
          />
          <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">
          Próximo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </form>
  );
};

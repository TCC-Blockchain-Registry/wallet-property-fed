import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Página não encontrada
        </p>
        <Button onClick={() => navigate("/")}>
          Voltar ao início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

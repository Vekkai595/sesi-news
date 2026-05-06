import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-5">
        <h1 className="text-7xl font-light text-muted-foreground/40">404</h1>
        <h2 className="text-2xl font-bold text-foreground">Página não encontrada</h2>
        <p className="text-muted-foreground">
          O endereço <span className="font-medium">{location.pathname}</span> não existe no Sesi News.
        </p>
        <Link to="/">
          <Button>Voltar ao início</Button>
        </Link>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabaseService } from '@/services/supabaseService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await supabaseService.verificarAutenticacion();
      setIsAuthenticated(auth);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Mostrar un indicador de carga mientras se verifica la autenticación
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
} 
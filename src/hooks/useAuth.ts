import { useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí deberías implementar la lógica de autenticación real
    // Por ahora, simulamos un usuario autenticado
    setUser({
      email: 'ejecutivo@example.com',
      name: 'Ejecutivo Demo',
      role: 'ejecutivo'
    });
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user
  };
}; 
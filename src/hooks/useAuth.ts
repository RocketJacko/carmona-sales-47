import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';

interface User {
  email: string;
  name: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Obtener la sesión actual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Usar los datos reales del usuario
          setUser({
            email: session.user.email || '',
            name: session.user.user_metadata?.username || '',
            role: 'ejecutivo'
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.username || '',
          role: 'ejecutivo'
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user
  };
}; 
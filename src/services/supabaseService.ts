// Servicio para interactuar con Supabase
import { supabase } from '@/config/supabase';
import { toast } from 'sonner';

// Tipos para la autenticación
export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  username: string;
};

export type AuthResponse = {
  success: boolean;
  error?: string;
  user?: any;
};

export const supabaseService = {
  // Registrar usuario
  registrarUsuario: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username
          }
        }
      });

      if (error) {
        console.error('Error al registrar:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (data?.user) {
        toast.success('Usuario registrado exitosamente');
        return {
          success: true,
          user: data.user
        };
      }

      return {
        success: false,
        error: 'Error al registrar usuario'
      };
    } catch (error) {
      console.error('Error inesperado:', error);
      return {
        success: false,
        error: 'Error inesperado al registrar usuario'
      };
    }
  },
  
  // Iniciar sesión
  iniciarSesion: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        console.error('Error al iniciar sesión:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (data?.user) {
        // Guardar datos de sesión
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username
        }));

        toast.success('Bienvenido');
        return {
          success: true,
          user: data.user
        };
      }

      return {
        success: false,
        error: 'Error al iniciar sesión'
      };
    } catch (error) {
      console.error('Error inesperado:', error);
      return {
        success: false,
        error: 'Error inesperado al iniciar sesión'
      };
    }
  },
  
  // Cerrar sesión
  cerrarSesion: async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Limpiar datos de sesión
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      
      toast.success('Sesión cerrada exitosamente');
      return { success: true };
    } catch (error) {
      console.error('Error inesperado:', error);
      return {
        success: false,
        error: 'Error inesperado al cerrar sesión'
      };
    }
  },
  
  // Verificar autenticación
  verificarAutenticacion: async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  },
  
  // Obtener datos del usuario actual
  obtenerDatosUsuario: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error al obtener datos del usuario:', error);
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error inesperado:', error);
      return null;
    }
  },

  // Restablecer contraseña
  restablecerPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Error al restablecer contraseña:', error);
        return {
          success: false,
          error: error.message
        };
      }

      toast.success('Se ha enviado un correo para restablecer tu contraseña');
      return { success: true };
    } catch (error) {
      console.error('Error inesperado:', error);
      return {
        success: false,
        error: 'Error inesperado al restablecer contraseña'
      };
    }
  }
};

// Servicio para interactuar con Supabase
import { Test } from '@/utils/Test';
import { toast } from 'sonner';

// Inicializamos la clase Test
const test = Test.getInstance();

export const supabaseService = {
  // Verificar si un correo está autorizado usando el procedimiento almacenado
  verificarCorreoAutorizado: async (email: string): Promise<boolean> => {
    try {
      console.log(`Verificando si el correo ${email} está autorizado...`);
      const resultado = await test.validarEmail(email);
      console.log(`Resultado de verificación de correo: ${resultado}`);
      return resultado;
    } catch (error) {
      console.error('Error al verificar correo autorizado:', error);
      toast('Error al verificar correo', {
        description: 'No se pudo verificar si el correo está autorizado',
      });
      return false;
    }
  },
  
  // Registrar usuario de forma eficiente en la tabla Credenciales
  registrarUsuario: async (userData: { username: string; email: string; password: string }): Promise<boolean> => {
    try {
      console.log(`Intentando registrar usuario: ${userData.username}, ${userData.email}`);
      
      // Verificamos primero si el correo está autorizado
      const autorizado = await supabaseService.verificarCorreoAutorizado(userData.email);
      
      if (!autorizado) {
        console.error('El correo no está autorizado para registro');
        toast('Correo no autorizado', {
          description: 'Este correo no está autorizado para registrarse en el sistema',
        });
        return false;
      }
      
      // Si está autorizado, registramos el usuario
      const resultado = await test.registrarUsuario(
        userData.username,
        userData.email,
        userData.password
      );
      
      console.log(`Resultado del registro: ${resultado ? 'Exitoso' : 'Fallido'}`);
      
      if (resultado) {
        toast('Usuario registrado', {
          description: 'El usuario ha sido registrado correctamente',
        });
      }
      
      return resultado;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      toast('Error al registrar', {
        description: 'Ocurrió un error al intentar registrar el usuario',
      });
      throw new Error('Error al registrar usuario');
    }
  },
  
  // Iniciar sesión (usando la clase Test)
  iniciarSesion: async (credentials: { username: string; password: string }): Promise<any> => {
    try {
      console.log(`Intentando iniciar sesión con usuario: ${credentials.username}`);
      
      const resultado = await test.loginUsuario(
        credentials.username,
        credentials.password
      );
      
      console.log('Resultado de inicio de sesión:', resultado);
      
      if (resultado) {
        console.log('Login exitoso');
        
        // Almacenamos los datos del usuario en localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify({
          usuario: credentials.username
        }));
        
        toast('Inicio de sesión exitoso', {
          description: `Bienvenido ${credentials.username}`,
        });
      } else {
        toast('Error de autenticación', {
          description: 'Credenciales incorrectas',
        });
      }
      
      return { success: resultado };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast('Error de autenticación', {
        description: 'Ocurrió un error al intentar iniciar sesión',
      });
      throw new Error('Error al iniciar sesión');
    }
  },
  
  // Cerrar sesión
  cerrarSesion: (): boolean => {
    try {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      
      toast('Sesión cerrada', {
        description: 'Se ha cerrado la sesión correctamente',
      });
      
      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return false;
    }
  },
  
  // Verificar si el usuario está autenticado
  verificarAutenticacion: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  
  // Obtener datos del usuario actual
  obtenerDatosUsuario: (): any => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
};

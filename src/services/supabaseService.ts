
// Servicio para interactuar con Supabase
import { DBHandler } from '@/utils/DBHandler';
import { DataHandler } from '@/utils/DataHandler';
import { toast } from 'sonner';

const SUPABASE_URL = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwODE2ODYsImV4cCI6MjAzNjY1NzY4Nn0.r1LbV5Ml4Wyws4rxwgytJLzzyZGvHtbofuqzUXxFLjE';

// Inicializamos nuestras clases
const dbHandler = DBHandler.getInstance();
const dataHandler = DataHandler.getInstance();

// Configuramos las credenciales
dbHandler.setCredentials(SUPABASE_ANON_KEY);
dbHandler.setUrl(SUPABASE_URL);

export const supabaseService = {
  // Verificar si un correo está autorizado usando el procedimiento almacenado
  verificarCorreoAutorizado: async (email: string): Promise<boolean> => {
    try {
      console.log(`Verificando si el correo ${email} está autorizado...`);
      const resultado = await dbHandler.verificarCorreoAutorizado(email);
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
      const resultado = await dbHandler.registrarUsuarioEficiente({
        usuario: userData.username,
        email: userData.email,
        password: userData.password
      });
      
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
  
  // Iniciar sesión (usando la clase DBHandler)
  iniciarSesion: async (credentials: { username: string; password: string }): Promise<any> => {
    try {
      console.log(`Intentando iniciar sesión con usuario: ${credentials.username}`);
      
      const resultado = await dbHandler.iniciarSesion({
        usuario: credentials.username,
        password: credentials.password
      });
      
      console.log('Resultado de inicio de sesión:', resultado);
      
      if (resultado.success) {
        console.log('Login exitoso, asignando clientes...');
        
        // Almacenamos los datos del usuario en localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify({
          id: resultado.id,
          usuario: resultado.usuario,
          email: resultado.email,
          agente: resultado.agente
        }));
        
        // Asignamos clientes automáticamente
        const asignacionExitosa = await supabaseService.asignarClientesAutomaticamente(resultado.usuario);
        console.log(`Asignación de clientes: ${asignacionExitosa ? 'Exitosa' : 'Fallida'}`);
        
        toast('Inicio de sesión exitoso', {
          description: `Bienvenido ${resultado.usuario}`,
        });
      } else {
        toast('Error de autenticación', {
          description: resultado.message || 'Credenciales incorrectas',
        });
      }
      
      return resultado;
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
  },
  
  // Asignar clientes automáticamente a un ejecutivo
  asignarClientesAutomaticamente: async (ejecutivo: string): Promise<boolean> => {
    try {
      console.log(`Asignando clientes automáticamente al ejecutivo ${ejecutivo}...`);
      const resultado = await dbHandler.asignarClientesAutomaticamente(ejecutivo);
      console.log(`Resultado de asignación automática: ${resultado ? 'Exitosa' : 'Fallida'}`);
      return resultado;
    } catch (error) {
      console.error('Error al asignar clientes automáticamente:', error);
      return false;
    }
  },
  
  // Obtener los clientes asignados a un ejecutivo
  obtenerClientesAsignados: async (ejecutivo: string): Promise<any[]> => {
    try {
      console.log(`Obteniendo clientes asignados al ejecutivo ${ejecutivo}...`);
      const clientes = await dbHandler.obtenerClientesAsignados(ejecutivo);
      console.log(`Se encontraron ${clientes.length} clientes asignados`);
      
      // Usar el DataHandler para tabular los datos
      return dataHandler.tabularUsuarios(clientes);
    } catch (error) {
      console.error('Error al obtener clientes asignados:', error);
      return [];
    }
  }
};

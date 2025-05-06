
// Servicio para interactuar con Supabase
import { DBHandler } from '@/utils/DBHandler';
import { DataHandler } from '@/utils/DataHandler';

const SUPABASE_URL = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwODE2ODYsImV4cCI6MjAzNjY1NzY4Nn0.r1LbV5Ml4Wyws4rxwgytJLzzyZGvHtbofuqzUXxFLjE'; // Clave anónima para acceso público

// Inicializamos nuestras clases
const dbHandler = DBHandler.getInstance();
const dataHandler = DataHandler.getInstance();

// Configuramos las credenciales
dbHandler.setCredentials(SUPABASE_ANON_KEY);

export const supabaseService = {
  // Verificar si un correo está autorizado usando el procedimiento almacenado
  verificarCorreoAutorizado: async (email: string): Promise<boolean> => {
    try {
      return await dbHandler.verificarCorreoAutorizado(email);
    } catch (error) {
      console.error('Error al verificar correo autorizado:', error);
      return false;
    }
  },
  
  // Registrar usuario de forma eficiente en la tabla Credenciales
  registrarUsuario: async (userData: { username: string; email: string; password: string }): Promise<boolean> => {
    try {
      // Usamos el nuevo método eficiente
      return await dbHandler.registrarUsuarioEficiente({
        usuario: userData.username,
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new Error('Error al registrar usuario');
    }
  },
  
  // Iniciar sesión (usando la clase DBHandler)
  iniciarSesion: async (credentials: { username: string; password: string }): Promise<any> => {
    try {
      return await dbHandler.iniciarSesion({
        usuario: credentials.username,
        password: credentials.password
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Error al iniciar sesión');
    }
  }
};

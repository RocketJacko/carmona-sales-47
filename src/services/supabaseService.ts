
// Servicio para interactuar con Supabase
// En un proyecto real, usarías la librería oficial de Supabase con API keys seguras

const SUPABASE_URL = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
const SUPABASE_ANON_KEY = ''; // Este valor debe ser proporcionado correctamente

export const supabaseService = {
  // Verificar si un correo está autorizado
  verificarCorreoAutorizado: async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/correos_autorizados?email=eq.${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      return data && data.length > 0;
    } catch (error) {
      console.error('Error al verificar correo autorizado:', error);
      throw new Error('Error al verificar correo autorizado');
    }
  },
  
  // Registrar usuario en la tabla Registro_inicial
  registrarUsuario: async (userData: { username: string; email: string; password: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/Registro_inicial`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(userData)
      });
      
      return response.status === 201;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new Error('Error al registrar usuario');
    }
  },
  
  // Iniciar sesión (simulado por ahora)
  iniciarSesion: async (credentials: { username: string; password: string }): Promise<boolean> => {
    try {
      // En un caso real, aquí verificarías las credenciales contra Supabase Auth
      // Por ahora, simularemos un inicio de sesión exitoso
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Error al iniciar sesión');
    }
  }
};

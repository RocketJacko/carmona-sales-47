
import { DBHandlerBase } from './DBHandlerBase';

/**
 * Manejador para operaciones relacionadas con autenticación y credenciales
 */
export class AuthDBHandler extends DBHandlerBase {
  private static authInstance: AuthDBHandler;
  
  private constructor() {
    super();
  }

  /**
   * Retorna la instancia única de AuthDBHandler
   */
  public static getInstance(): AuthDBHandler {
    if (!AuthDBHandler.authInstance) {
      AuthDBHandler.authInstance = new AuthDBHandler();
    }
    return AuthDBHandler.authInstance;
  }

  /**
   * Verifica si un correo está autorizado para registrarse
   */
  public async verificarCorreoAutorizado(email: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/correos_autorizados?email=eq.${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      return data && data.length > 0;
    } catch (error) {
      console.error('Error al verificar correo autorizado:', error);
      throw new Error('Error al verificar correo autorizado');
    }
  }

  /**
   * Registra un nuevo usuario en la tabla credenciales
   */
  public async registrarCredenciales(userData: { usuario: string; email: string; pasasword: string }): Promise<boolean> {
    try {
      const response = await fetch(`${this.SUPABASE_URL}/rest/v1/credenciales`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(userData)
      });
      
      return response.status === 201;
    } catch (error) {
      console.error('Error al registrar credenciales:', error);
      throw new Error('Error al registrar credenciales');
    }
  }

  /**
   * Iniciar sesión verificando las credenciales
   */
  public async iniciarSesion(credentials: { usuario: string; password: string }): Promise<any> {
    try {
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/credenciales?usuario=eq.${encodeURIComponent(credentials.usuario)}`,
        {
          method: 'GET',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // En un caso real, aquí deberíamos verificar la contraseña con bcrypt o similar
        // Por simplicidad, comparamos directamente (NO HACER ESTO EN PRODUCCIÓN)
        if (data[0].pasasword === credentials.password) {
          // Obtenemos la información del agente
          const agenteResponse = await fetch(
            `${this.SUPABASE_URL}/rest/v1/agentes?email=eq.${encodeURIComponent(data[0].email)}`,
            {
              method: 'GET',
              headers: {
                'apikey': this.SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
              }
            }
          );
          
          const agenteData = await agenteResponse.json();
          
          // Devolvemos la información combinada
          return {
            success: true,
            id: data[0].id,
            usuario: data[0].usuario,
            email: data[0].email,
            agente: agenteData.length > 0 ? agenteData[0] : null
          };
        }
      }
      
      return { success: false, message: 'Credenciales incorrectas' };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Error al iniciar sesión');
    }
  }
}

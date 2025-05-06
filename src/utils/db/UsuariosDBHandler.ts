
import { DBHandlerBase } from './DBHandlerBase';

/**
 * Manejador para operaciones relacionadas con usuarios
 */
export class UsuariosDBHandler extends DBHandlerBase {
  private static usuariosInstance: UsuariosDBHandler;
  
  private constructor() {
    super();
  }

  /**
   * Retorna la instancia única de UsuariosDBHandler
   */
  public static getInstance(): UsuariosDBHandler {
    if (!UsuariosDBHandler.usuariosInstance) {
      UsuariosDBHandler.usuariosInstance = new UsuariosDBHandler();
    }
    return UsuariosDBHandler.usuariosInstance;
  }

  /**
   * Ejecuta procedimiento almacenado para obtener todos los usuarios
   */
  public async obtenerUsuarios(): Promise<any[]> {
    try {
      // En Supabase no tenemos procedimientos almacenados tradicionales, pero podemos usar RPC o consultas directas
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/usuarios`,
        {
          method: 'GET',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error('Error al obtener usuarios');
    }
  }

  /**
   * Ejecuta una consulta para buscar usuarios por criterio
   */
  public async buscarUsuarios(criterio: string): Promise<any[]> {
    try {
      // Búsqueda por nombre o cédula
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/usuarios?or=(nombre.ilike.%${encodeURIComponent(criterio)}%,cedula.ilike.%${encodeURIComponent(criterio)}%)`,
        {
          method: 'GET',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw new Error('Error al buscar usuarios');
    }
  }

  /**
   * Obtiene los teléfonos de un usuario específico
   */
  public async obtenerTelefonosUsuario(usuarioId: number): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/telefonos?usuario_id=eq.${usuarioId}`,
        {
          method: 'GET',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener teléfonos:', error);
      throw new Error('Error al obtener teléfonos');
    }
  }
}

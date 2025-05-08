/**
 * Clase encargada de interactuar con la base de datos Supabase mediante llamadas a API.
 * Esta clase sigue el patrón Singleton para garantizar una única instancia en toda la aplicación.
 * 
 * NOTA: La autenticación y registro se manejan a través del sistema de autenticación de Supabase
 * en la clase SupabaseService. Esta clase solo maneja operaciones de datos.
 */
export class DBHandler {
  private static instance: DBHandler;
  private SUPABASE_URL: string;
  private SUPABASE_ANON_KEY: string;
  
  private constructor() {
    // Constructor privado para implementar el patrón Singleton
    this.SUPABASE_URL = '';
    this.SUPABASE_ANON_KEY = ''; // Se debe proporcionar la clave correcta cuando se use
  }

  /**
   * Retorna la instancia única de DBHandler
   */
  public static getInstance(): DBHandler {
    if (!DBHandler.instance) {
      DBHandler.instance = new DBHandler();
    }
    return DBHandler.instance;
  }

  /**
   * Configura las credenciales de acceso a Supabase
   */
  public setCredentials(anonKey: string): void {
    this.SUPABASE_ANON_KEY = anonKey;
    console.log('Credenciales de Supabase configuradas');
  }
  
  /**
   * Configura la URL de Supabase
   */
  public setUrl(url: string): void {
    this.SUPABASE_URL = url;
    console.log(`URL de Supabase configurada: ${url}`);
  }

  /**
   * Asigna automáticamente 10 clientes al ejecutivo que inicia sesión
   * @param ejecutivo - Email o identificador del ejecutivo autenticado
   */
  public async asignarClientesAutomaticamente(ejecutivo: string): Promise<boolean> {
    try {
      console.log(`Asignando clientes al ejecutivo: ${ejecutivo}`);
      
      // 1. Obtenemos 10 clientes sin asignar (estado = 0)
      const clientesResponse = await fetch(
        `${this.SUPABASE_URL}/rest/v1/fidupensionados?estado=eq.0&limit=10`,
        {
          method: 'GET',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const clientes = await clientesResponse.json();
      console.log(`Se encontraron ${clientes.length} clientes sin asignar`);
      
      if (clientes.length === 0) {
        console.log('No hay clientes sin asignar disponibles');
        return false;
      }
      
      // 2. Actualizamos el estado de estos clientes a 1 y asignamos el ejecutivo
      const actualizaciones = clientes.map(async (cliente: any) => {
        console.log(`Asignando cliente ID ${cliente.id} al ejecutivo ${ejecutivo}`);
        
        const updateResponse = await fetch(
          `${this.SUPABASE_URL}/rest/v1/fidupensionados?id=eq.${cliente.id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': this.SUPABASE_ANON_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              estado: 1,
              ejecutivo: ejecutivo,
              fecha_asignacion: new Date().toISOString()
            })
          }
        );
        
        console.log(`Respuesta de actualización: código ${updateResponse.status}`);
        return updateResponse.ok;
      });
      
      const resultados = await Promise.all(actualizaciones);
      const exito = resultados.every(resultado => resultado === true);
      
      console.log(`Asignación de clientes ${exito ? 'exitosa' : 'fallida'}`);
      return exito;
    } catch (error) {
      console.error('Error al asignar clientes automáticamente:', error);
      return false;
    }
  }

  /**
   * Obtiene los clientes asignados a un ejecutivo específico
   * @param ejecutivo - Email o identificador del ejecutivo autenticado
   */
  public async obtenerClientesAsignados(ejecutivo: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/fidupensionados?ejecutivo=eq.${encodeURIComponent(ejecutivo)}&estado=eq.1`,
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
      console.error('Error al obtener clientes asignados:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los usuarios del sistema
   */
  public async obtenerUsuarios(): Promise<any[]> {
    try {
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
   * Busca usuarios por nombre o cédula
   */
  public async buscarUsuarios(criterio: string): Promise<any[]> {
    try {
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

  /**
   * Registra un contacto con un usuario
   */
  public async registrarContacto(contactoData: { 
    usuario_id: number; 
    tipo_contacto: string; 
    tipificacion: string; 
    observaciones?: string; 
    resultado?: string
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.SUPABASE_URL}/rest/v1/contactos`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          ...contactoData,
          fecha_contacto: new Date().toISOString()
        })
      });
      
      return response.status === 201;
    } catch (error) {
      console.error('Error al registrar contacto:', error);
      throw new Error('Error al registrar contacto');
    }
  }

  /**
   * Registra un agendamiento para un usuario
   */
  public async registrarAgendamiento(agendamientoData: { 
    usuario_id: number; 
    fecha_agendada: string; 
    estado: string; 
    observaciones?: string; 
    notas?: string; 
    responsable_id?: number
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.SUPABASE_URL}/rest/v1/agendamientos`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(agendamientoData)
      });
      
      return response.status === 201;
    } catch (error) {
      console.error('Error al registrar agendamiento:', error);
      throw new Error('Error al registrar agendamiento');
    }
  }
}

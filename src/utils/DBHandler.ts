/**
 * Clase encargada de interactuar con la base de datos Supabase mediante llamadas a API y procedimientos almacenados.
 * Esta clase sigue el patrón Singleton para garantizar una única instancia en toda la aplicación.
 */
export class DBHandler {
  private static instance: DBHandler;
  private SUPABASE_URL: string;
  private SUPABASE_ANON_KEY: string;
  
  private constructor() {
    // Constructor privado para implementar el patrón Singleton
    this.SUPABASE_URL = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
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
  }

  /**
   * Verifica si un correo está autorizado usando el procedimiento almacenado
   */
  public async verificarCorreoAutorizado(email: string): Promise<boolean> {
    try {
      // Usar la función validacionpermisos creada en Supabase
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/rpc/validacionpermisos`,
        {
          method: 'POST',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ p_email: email })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta del RPC:', errorData);
        return false;
      }
      
      // La respuesta será directamente el valor booleano de la función
      const resultado = await response.json();
      return resultado === true;
    } catch (error) {
      console.error('Error al verificar correo autorizado:', error);
      throw new Error('Error al verificar correo autorizado');
    }
  }

  /**
   * Registra un nuevo usuario usando un procedimiento almacenado
   */
  public async registrarUsuarioEficiente(userData: { usuario: string; email: string; password: string }): Promise<boolean> {
    try {
      // Primero verificamos si el email está autorizado
      const autorizado = await this.verificarCorreoAutorizado(userData.email);
      
      if (!autorizado) {
        console.error('El correo no está autorizado para registro');
        return false;
      }
      
      // Si está autorizado, registramos las credenciales
      const response = await fetch(`${this.SUPABASE_URL}/rest/v1/credenciales`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          usuario: userData.usuario,
          email: userData.email,
          pasasword: userData.password // Nota: el campo en la base de datos se llama "pasasword" con una 's' extra
        })
      });
      
      return response.status === 201;
    } catch (error) {
      console.error('Error al registrar usuario de forma eficiente:', error);
      throw new Error('Error al registrar usuario');
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
   * Registra un nuevo agente vinculado a una credencial
   */
  public async registrarAgente(agenteData: { nombre: string; telefono: string; email: string; rol: string; estado: string }): Promise<boolean> {
    try {
      const response = await fetch(`${this.SUPABASE_URL}/rest/v1/agentes`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(agenteData)
      });
      
      return response.status === 201;
    } catch (error) {
      console.error('Error al registrar agente:', error);
      throw new Error('Error al registrar agente');
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

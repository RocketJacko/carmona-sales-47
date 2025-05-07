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
   * Verifica si un correo está autorizado usando el procedimiento almacenado
   */
  public async verificarCorreoAutorizado(email: string): Promise<boolean> {
    try {
      console.log(`Llamando a la función validacionpermisos para el email: ${email}`);
      console.log('URL completa:', `${this.SUPABASE_URL}/rest/v1/rpc/validacionpermisos`);
      
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/rpc/validacionpermisos`,
        {
          method: 'POST',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ p_email: email })
        }
      );

      console.log('Status de la respuesta:', response.status);
      console.log('Headers de la respuesta:', response.headers);

      const data = await response.json();
      console.log('Resultado de la validación:', data);

      return data === true;
    } catch (error) {
      console.error('Error al llamar a la función:', error);
      return false;
    }
  }

  /**
   * Registra un nuevo usuario usando un procedimiento almacenado
   */
  public async registrarUsuarioEficiente(userData: { usuario: string; email: string; password: string }): Promise<boolean> {
    try {
      console.log(`Iniciando registro eficiente para usuario: ${userData.usuario}, email: ${userData.email}`);
      
      // Primero verificamos si el email está autorizado
      const autorizado = await this.verificarCorreoAutorizado(userData.email);
      console.log(`¿Email autorizado?: ${autorizado}`);
      
      if (!autorizado) {
        console.error('El correo no está autorizado para registro');
        return false;
      }
      
      // Si está autorizado, registramos las credenciales
      console.log(`Registrando credenciales para: ${userData.usuario}`);
      
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
          password: userData.password // Corregido el nombre del campo
        })
      });
      
      console.log(`Respuesta del servidor: código ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al registrar usuario:', errorData);
        return false;
      }
      
      // Si el registro es exitoso, también asignamos clientes automáticamente
      if (response.status === 201) {
        console.log('Registro exitoso, asignando clientes automáticamente...');
        await this.asignarClientesAutomaticamente(userData.usuario);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error detallado al registrar usuario:', error);
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
      console.log(`Verificando credenciales para usuario: ${credentials.usuario}`);
      
      // Buscar el usuario en la tabla de credenciales
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
      console.log(`Datos obtenidos para el usuario: ${JSON.stringify(data)}`);
      
      if (data && data.length > 0) {
        // Comparamos la contraseña (en un caso real, debería usar bcrypt o similar)
        if (data[0].pasasword === credentials.password) {
          console.log('Contraseña correcta, buscando información del agente...');
          
          // Obtenemos la información del agente si existe
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
          console.log(`Información del agente: ${JSON.stringify(agenteData)}`);
          
          // Después de un inicio de sesión exitoso, asignamos clientes automáticamente
          console.log(`Asignando clientes automáticamente a ${credentials.usuario}...`);
          await this.asignarClientesAutomaticamente(credentials.usuario);
          
          // Devolvemos la información combinada
          return {
            success: true,
            id: data[0].id,
            usuario: data[0].usuario,
            email: data[0].email,
            agente: agenteData.length > 0 ? agenteData[0] : null
          };
        } else {
          console.error('Contraseña incorrecta');
          return { success: false, message: 'Contraseña incorrecta' };
        }
      } else {
        console.error('Usuario no encontrado');
        return { success: false, message: 'Usuario no encontrado' };
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Error al iniciar sesión');
    }
  }

  /**
   * Asigna automáticamente 10 clientes al ejecutivo que inicia sesión
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

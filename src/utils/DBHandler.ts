/**
 * Clase encargada de interactuar con la base de datos Supabase mediante llamadas a API.
 * Esta clase sigue el patrón Singleton para garantizar una única instancia en toda la aplicación.
 * 
 * NOTA: La autenticación y registro se manejan a través del sistema de autenticación de Supabase
 * en la clase SupabaseService. Esta clase solo maneja operaciones de datos.
 */
import { createClient } from '@supabase/supabase-js';

export class DBHandler {
  private static instance: DBHandler;
  private supabase;
  
  private constructor() {
    const SUPABASE_URL = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjc0NzUsImV4cCI6MjA2MDkwMzQ3NX0.KrXbn9U45Qq-srDXoVF3RsMkTIY729knVSwlOISh3as';
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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
    this.supabase = createClient(this.supabase.getUrl(), anonKey);
    console.log('Credenciales de Supabase configuradas');
  }
  
  /**
   * Configura la URL de Supabase
   */
  public setUrl(url: string): void {
    this.supabase = createClient(url, this.supabase.auth.signIn(this.supabase.auth.currentUser));
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
        `${this.supabase.getUrl()}/rest/v1/fidupensionados?estado=eq.0&limit=1`,
        {
          method: 'GET',
          headers: {
            'apikey': this.supabase.auth.currentUser,
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
          `${this.supabase.getUrl()}/rest/v1/fidupensionados?id=eq.${cliente.id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': this.supabase.auth.currentUser,
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
        `${this.supabase.getUrl()}/rest/v1/rpc/obtener_clientes_asignados`,
        {
          method: 'POST',
          headers: {
            'apikey': this.supabase.auth.currentUser,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.supabase.auth.currentUser}`
          },
          body: JSON.stringify({ p_ejecutivo: ejecutivo })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta de obtenerClientesAsignados:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener clientes asignados:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los usuarios del sistema
   */
  public async obtenerUsuarios(): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.supabase.getUrl()}/rest/v1/usuarios`,
        {
          method: 'GET',
          headers: {
            'apikey': this.supabase.auth.currentUser,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
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
        `${this.supabase.getUrl()}/rest/v1/usuarios?or=(nombre.ilike.%${encodeURIComponent(criterio)}%,cedula.ilike.%${encodeURIComponent(criterio)}%)`,
        {
          method: 'GET',
          headers: {
            'apikey': this.supabase.auth.currentUser,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
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
        `${this.supabase.getUrl()}/rest/v1/telefonos?usuario_id=eq.${usuarioId}`,
        {
          method: 'GET',
          headers: {
            'apikey': this.supabase.auth.currentUser,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
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
      const response = await fetch(`${this.supabase.getUrl()}/rest/v1/contactos`, {
        method: 'POST',
        headers: {
          'apikey': this.supabase.auth.currentUser,
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
      const response = await fetch(`${this.supabase.getUrl()}/rest/v1/agendamientos`, {
        method: 'POST',
        headers: {
          'apikey': this.supabase.auth.currentUser,
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

  /**
   * Busca un cliente disponible y lo asigna al ejecutivo actual
   * @param ejecutivo - Email o identificador del ejecutivo autenticado
   * @returns Promise con el resultado de la operación
   */
  public async buscarYAsignarCliente(ejecutivo: string): Promise<{ exito: boolean; mensaje: string; cliente?: any }> {
    try {
      console.log('Buscando cliente disponible...');
      
      // 1. Buscar cliente
      const { data: clienteData, error: clienteError } = await this.supabase.rpc('buscarcliente');
      
      if (clienteError) {
        console.error('Error al buscar cliente:', clienteError);
        return {
          exito: false,
          mensaje: clienteError.message
        };
      }

      if (!clienteData || clienteData.length === 0) {
        return {
          exito: false,
          mensaje: 'No hay clientes disponibles para asignar'
        };
      }

      // Extraer solo los datos relevantes del cliente
      const cliente = {
        idcliente: clienteData[0].idcliente,
        comprobante: clienteData[0]['COMPROBANTE DE NOMINA No.'],
        nombre: clienteData[0]['Nombres docente'],
        apellido: clienteData[0]['Apellidos docente']
      };
      
      // Mostrar solo los datos relevantes
      console.log('Cliente encontrado:', JSON.stringify(cliente, null, 2));

      // Obtener el usuario del localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return {
          exito: false,
          mensaje: 'No se encontró el usuario en el localStorage'
        };
      }

      const user = JSON.parse(userStr);

      // 2. Asignar cliente
      const { error: asignarError } = await this.supabase.rpc('update_ejecutivo_asignado', {
        p_username: user.email,
        p_comprobante_nomina: cliente.comprobante
      });

      if (asignarError) {
        console.error('Error al asignar cliente:', asignarError);
        return {
          exito: false,
          mensaje: asignarError.message
        };
      }

      return {
        exito: true,
        mensaje: 'Cliente asignado exitosamente',
        cliente: cliente
      };

    } catch (error) {
      console.error('Error en buscarYAsignarCliente:', error);
      return {
        exito: false,
        mensaje: error instanceof Error ? error.message : 'Error desconocido al buscar y asignar cliente'
      };
    }
  }
}

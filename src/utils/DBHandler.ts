/**
 * Clase encargada de interactuar con la base de datos Supabase mediante llamadas a API.
 * Esta clase sigue el patrón Singleton para garantizar una única instancia en toda la aplicación.
 * 
 * NOTA: La autenticación y registro se manejan a través del sistema de autenticación de Supabase
 * en la clase SupabaseService. Esta clase solo maneja operaciones de datos.
 */
import { createClient } from '@supabase/supabase-js';
import { Concepto } from '@/models/concepto';

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
  }
  
  /**
   * Configura la URL de Supabase
   */
  public setUrl(url: string): void {
    this.supabase = createClient(url, this.supabase.auth.signIn(this.supabase.auth.currentUser));
  }

  /**
   * Asigna automáticamente 10 clientes al ejecutivo que inicia sesión
   * @param ejecutivo - Email o identificador del ejecutivo autenticado
   */
  public async asignarClientesAutomaticamente(ejecutivo: string): Promise<boolean> {
    try {
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
      
      if (clientes.length === 0) {
        return false;
      }
      
      // 2. Actualizamos el estado de estos clientes a 1 y asignamos el ejecutivo
      const actualizaciones = clientes.map(async (cliente: any) => {
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
        
        return updateResponse.ok;
      });
      
      const resultados = await Promise.all(actualizaciones);
      const exito = resultados.every(resultado => resultado === true);
      
      return exito;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene los clientes asignados a un ejecutivo específico
   * @param ejecutivo - Email o identificador del ejecutivo autenticado
   */
  public async obtenerClientesAsignados(ejecutivo: string): Promise<any[]> {
    try {
      // Usar el procedimiento almacenado buscarcliente
      const { data, error } = await this.supabase.rpc('buscarcliente');
      
      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
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
      // 1. Buscar cliente
      const { data: clienteData, error: clienteError } = await this.supabase.rpc('buscarcliente');
      
      if (clienteError) {
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

      const cliente = clienteData[0];

      // Obtener el usuario del localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return {
          exito: false,
          mensaje: 'No se encontró el usuario en el localStorage'
        };
      }

      const user = JSON.parse(userStr);

      // 2. Asignar cliente usando el email del ejecutivo directamente
      const { error: asignarError } = await this.supabase.rpc('update_ejecutivo_asignado', {
        p_username: ejecutivo, // Usar el email del ejecutivo directamente
        p_comprobante_nomina: cliente['COMPROBANTE DE NOMINA No.']
      });

      if (asignarError) {
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
      return {
        exito: false,
        mensaje: error instanceof Error ? error.message : 'Error desconocido al buscar y asignar cliente'
      };
    }
  }

  /**
   * Obtiene los conceptos desde el procedimiento almacenado
   * @returns Promise<Concepto[]> - Array de conceptos
   */
  public async obtenerConceptos(): Promise<Concepto[]> {
    try {
      const { data, error } = await this.supabase.rpc('obtener_conceptos');
      
      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  }
}

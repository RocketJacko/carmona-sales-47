
import { DBHandlerBase } from './DBHandlerBase';

/**
 * Manejador para operaciones relacionadas con contactos y agendamientos
 */
export class ContactosDBHandler extends DBHandlerBase {
  private static contactosInstance: ContactosDBHandler;
  
  private constructor() {
    super();
  }

  /**
   * Retorna la instancia única de ContactosDBHandler
   */
  public static getInstance(): ContactosDBHandler {
    if (!ContactosDBHandler.contactosInstance) {
      ContactosDBHandler.contactosInstance = new ContactosDBHandler();
    }
    return ContactosDBHandler.contactosInstance;
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

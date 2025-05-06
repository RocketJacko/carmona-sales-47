
import { DBHandlerBase } from './DBHandlerBase';

/**
 * Manejador para operaciones relacionadas con agentes
 */
export class AgentesDBHandler extends DBHandlerBase {
  private static agentesInstance: AgentesDBHandler;
  
  private constructor() {
    super();
  }

  /**
   * Retorna la instancia única de AgentesDBHandler
   */
  public static getInstance(): AgentesDBHandler {
    if (!AgentesDBHandler.agentesInstance) {
      AgentesDBHandler.agentesInstance = new AgentesDBHandler();
    }
    return AgentesDBHandler.agentesInstance;
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
}

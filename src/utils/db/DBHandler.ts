
import { DBHandlerBase } from './DBHandlerBase';
import { AuthDBHandler } from './AuthDBHandler';
import { AgentesDBHandler } from './AgentesDBHandler';
import { UsuariosDBHandler } from './UsuariosDBHandler';
import { ContactosDBHandler } from './ContactosDBHandler';

/**
 * Clase principal que integra todos los manejadores de base de datos
 * Mantiene compatibilidad con el código existente mediante delegación
 */
export class DBHandler extends DBHandlerBase {
  private static mainInstance: DBHandler;
  private authHandler: AuthDBHandler;
  private agentesHandler: AgentesDBHandler;
  private usuariosHandler: UsuariosDBHandler;
  private contactosHandler: ContactosDBHandler;
  
  private constructor() {
    super();
    this.authHandler = AuthDBHandler.getInstance() as AuthDBHandler;
    this.agentesHandler = AgentesDBHandler.getInstance() as AgentesDBHandler;
    this.usuariosHandler = UsuariosDBHandler.getInstance() as UsuariosDBHandler;
    this.contactosHandler = ContactosDBHandler.getInstance() as ContactosDBHandler;
  }

  /**
   * Retorna la instancia única de DBHandler
   */
  public static getInstance(): DBHandler {
    if (!DBHandler.mainInstance) {
      DBHandler.mainInstance = new DBHandler();
    }
    return DBHandler.mainInstance;
  }

  /**
   * Configura las credenciales de acceso a Supabase en todos los handlers
   */
  public setCredentials(anonKey: string): void {
    super.setCredentials(anonKey);
    this.authHandler.setCredentials(anonKey);
    this.agentesHandler.setCredentials(anonKey);
    this.usuariosHandler.setCredentials(anonKey);
    this.contactosHandler.setCredentials(anonKey);
  }

  // Delegación de métodos para mantener compatibilidad con código existente

  // Métodos de autenticación
  public async verificarCorreoAutorizado(email: string): Promise<boolean> {
    return this.authHandler.verificarCorreoAutorizado(email);
  }

  public async registrarCredenciales(userData: { usuario: string; email: string; pasasword: string }): Promise<boolean> {
    return this.authHandler.registrarCredenciales(userData);
  }

  public async iniciarSesion(credentials: { usuario: string; password: string }): Promise<any> {
    return this.authHandler.iniciarSesion(credentials);
  }

  // Métodos de agentes
  public async registrarAgente(agenteData: { nombre: string; telefono: string; email: string; rol: string; estado: string }): Promise<boolean> {
    return this.agentesHandler.registrarAgente(agenteData);
  }

  // Métodos de usuarios
  public async obtenerUsuarios(): Promise<any[]> {
    return this.usuariosHandler.obtenerUsuarios();
  }

  public async buscarUsuarios(criterio: string): Promise<any[]> {
    return this.usuariosHandler.buscarUsuarios(criterio);
  }

  public async obtenerTelefonosUsuario(usuarioId: number): Promise<any[]> {
    return this.usuariosHandler.obtenerTelefonosUsuario(usuarioId);
  }

  // Métodos de contactos y agendamientos
  public async registrarContacto(contactoData: {
    usuario_id: number;
    tipo_contacto: string;
    tipificacion: string;
    observaciones?: string;
    resultado?: string
  }): Promise<boolean> {
    return this.contactosHandler.registrarContacto(contactoData);
  }

  public async registrarAgendamiento(agendamientoData: {
    usuario_id: number;
    fecha_agendada: string;
    estado: string;
    observaciones?: string;
    notas?: string;
    responsable_id?: number
  }): Promise<boolean> {
    return this.contactosHandler.registrarAgendamiento(agendamientoData);
  }
}

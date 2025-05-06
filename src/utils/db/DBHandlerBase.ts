
/**
 * Clase base que implementa el patrón Singleton para manejar la conexión a Supabase.
 */
export class DBHandlerBase {
  protected static instance: DBHandlerBase;
  protected SUPABASE_URL: string;
  protected SUPABASE_ANON_KEY: string;
  
  protected constructor() {
    this.SUPABASE_URL = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
    this.SUPABASE_ANON_KEY = ''; // Se debe proporcionar la clave correcta cuando se use
  }

  /**
   * Retorna la instancia única de DBHandlerBase
   */
  public static getInstance(): DBHandlerBase {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   * Configura las credenciales de acceso a Supabase
   */
  public setCredentials(anonKey: string): void {
    this.SUPABASE_ANON_KEY = anonKey;
  }
}

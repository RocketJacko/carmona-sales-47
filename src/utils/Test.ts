/**
 * Clase de prueba para testear las funcionalidades de Supabase de manera desacoplada
 */
export class Test {
  private static instance: Test;
  private readonly SUPABASE_URL: string = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
  private readonly SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjc0NzUsImV4cCI6MjA2MDkwMzQ3NX0.KrXbn9U45Qq-srDXoVF3RsMkTIY729knVSwlOISh3as';
  private readonly PROJECT_ID: string = 'eaaijmcjevhrpfwpxtwg';

  private constructor() {}

  public static getInstance(): Test {
    if (!Test.instance) {
      Test.instance = new Test();
    }
    return Test.instance;
  }

  /**
   * Verifica la conexión a Supabase y las credenciales
   */
  public async verificarConexion(): Promise<{
    conexionExitosa: boolean;
    detalles: {
      urlValida: boolean;
      claveValida: boolean;
      proyectoActivo: boolean;
      mensaje: string;
    };
  }> {
    try {
      console.log('=== VERIFICANDO CONEXIÓN A SUPABASE ===');
      console.log('URL:', this.SUPABASE_URL);
      console.log('Project ID:', this.PROJECT_ID);

      // 1. Verificar URL
      const urlValida = this.SUPABASE_URL.startsWith('https://') && 
                       this.SUPABASE_URL.includes('supabase.co');
      
      // 2. Verificar clave anónima
      const claveValida = this.SUPABASE_ANON_KEY.startsWith('eyJ') && 
                         this.SUPABASE_ANON_KEY.length > 100;

      // 3. Verificar conexión al proyecto
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/credenciales?select=count`,
        {
          method: 'GET',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const proyectoActivo = response.status === 200;

      // Determinar mensaje de estado
      let mensaje = '';
      if (!urlValida) mensaje += 'URL de Supabase inválida. ';
      if (!claveValida) mensaje += 'Clave anónima inválida. ';
      if (!proyectoActivo) mensaje += 'No se pudo conectar al proyecto. ';
      if (urlValida && claveValida && proyectoActivo) {
        mensaje = 'Conexión exitosa a Supabase';
      }

      const resultado = {
        conexionExitosa: urlValida && claveValida && proyectoActivo,
        detalles: {
          urlValida,
          claveValida,
          proyectoActivo,
          mensaje
        }
      };

      console.log('\nResultado de la verificación:');
      console.log('URL válida:', urlValida);
      console.log('Clave válida:', claveValida);
      console.log('Proyecto activo:', proyectoActivo);
      console.log('Mensaje:', mensaje);

      return resultado;
    } catch (error) {
      console.error('❌ Error al verificar conexión:', error);
      return {
        conexionExitosa: false,
        detalles: {
          urlValida: false,
          claveValida: false,
          proyectoActivo: false,
          mensaje: `Error al verificar conexión: ${error.message}`
        }
      };
    }
  }

  public async validarEmail(email: string): Promise<boolean> {
    try {
      console.log('Request:', {
        url: `${this.SUPABASE_URL}/rest/v1/rpc/validacion_email`,
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: { p_email: email }
      });

      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/rpc/validacion_email`,
        {
          method: 'POST',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ p_email: email })
        }
      );

      const data = await response.json();
      console.log('Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });

      return data;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  public async registrarUsuario(usuario: string, correoelectronico: string, clave: string): Promise<any> {
    try {
      console.log('Request:', {
        url: `${this.SUPABASE_URL}/rest/v1/rpc/registrousuario`,
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: {
          usuario,
          correoelectronico,
          clave
        }
      });

      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/rpc/registrousuario`,
        {
          method: 'POST',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario,
            correoelectronico,
            clave
          })
        }
      );

      const data = await response.json();
      console.log('Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });

      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  public async loginUsuario(usuario: string, clave: string): Promise<boolean> {
    try {
      console.log('Request:', {
        url: `${this.SUPABASE_URL}/rest/v1/rpc/login_usuario`,
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: {
          p_usuario: usuario,
          p_clave: clave
        }
      });

      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/rpc/login_usuario`,
        {
          method: 'POST',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            p_usuario: usuario,
            p_clave: clave
          })
        }
      );

      const data = await response.json();
      console.log('Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });

      return data;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }
}
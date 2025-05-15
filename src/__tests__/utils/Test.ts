export class Test {
  private static instance: Test;
  private readonly SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  private readonly SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  private constructor() {}

  public static getInstance(): Test {
    if (!Test.instance) {
      Test.instance = new Test();
    }
    return Test.instance;
  }

  public async validarEmail(email: string): Promise<boolean> {
    // Implementación básica de validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public async probarProspectoFidu(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // 1. Probar conexión a la tabla
      const response = await fetch(
        `${this.SUPABASE_URL}/rest/v1/prospectoFidu?select=*&limit=1`,
        {
          method: 'GET',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la conexión: ${response.statusText}`);
      }

      const data = await response.json();

      // 2. Validar estructura de la tabla
      if (data && data.length > 0) {
        const primerRegistro = data[0];
        const camposRequeridos = ['campo1', 'campo2']; // Ajusta estos campos según tus necesidades

        const camposFaltantes = camposRequeridos.filter(
          campo => !(campo in primerRegistro)
        );

        if (camposFaltantes.length > 0) {
          return {
            success: false,
            error: `Campos faltantes en la tabla: ${camposFaltantes.join(', ')}`
          };
        }

        // Guardar camposRequeridos en this para usarlo después
        (this as any)._camposRequeridos = camposRequeridos;
      }

      // 3. Probar inserción de prueba
      const registroPrueba = {
        "IdCliente": `TEST-${Date.now()}`,
        "COMPROBANTE DE NÓMINA No.": 123456,
        "Nombres docente": "Juan",
        "Apellidos docente": "Pérez",
        "Tipo documento": "CC",
        "Número documento": 1234567890
      };

      const insertResponse = await fetch(
        `${this.SUPABASE_URL}/rest/v1/prospectoFidu`,
        {
          method: 'POST',
          headers: {
            'apikey': this.SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(registroPrueba)
        }
      );

      if (!insertResponse.ok) {
        throw new Error(`Error en la inserción: ${insertResponse.statusText}`);
      }

      return {
        success: true,
        data: {
          conexion: 'OK',
          estructura: 'OK',
          insercion: 'OK',
          campos_validados: (this as any)._camposRequeridos || []
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
} 
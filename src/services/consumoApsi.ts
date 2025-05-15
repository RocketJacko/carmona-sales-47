// Clase principal para consumo de APIs externas
const API_URL = 'https://TU_BACKEND_REAL.COM'; // Cambia por tu dominio real

export class ConsumoApsi {
  // Subclase para Activos y Finanzas
  static ApiActivosYfinanzas = class {
    static async simularCredito({
      EST_VDBLE,
      TNOMINAL,
      GSC_NUMID,
      GSC_MONTOSOL,
      TIPO_LINCLI,
      GSC_PLAZOSOL,
      TIP_CREDLIB
    }: {
      EST_VDBLE: string | number,
      TNOMINAL: string,
      GSC_NUMID: string | number,
      GSC_MONTOSOL: string | number,
      TIPO_LINCLI: string,
      GSC_PLAZOSOL: string | number,
      TIP_CREDLIB: string
    }) {
      try {
        const response = await fetch(`${API_URL}/api/simular-credito`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            EST_VDBLE,
            TNOMINAL,
            GSC_NUMID,
            GSC_MONTOSOL,
            TIPO_LINCLI,
            GSC_PLAZOSOL,
            TIP_CREDLIB
          })
        });

        if (!response.ok) {
          throw new Error(`Error en la simulación: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.html;
      } catch (error: any) {
        console.error('Error detallado en simularCredito:', error);
        throw new Error(`Error al consumir la API de simulación: ${error.message || 'Error desconocido'}`);
      }
    }
  }
} 
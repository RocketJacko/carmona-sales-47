export class TestPruebaApiActivosYFinanzas {
  static async test() {
    const payload = {
      EST_VDBLE: '574000',
      TNOMINAL: '1%2C9426',
      GSC_NUMID: '40976849',
      GSC_MONTOSOL: '1000000',
      TIPO_LINCLI: 'Linea%20Bancoomeva%20Oro',
      GSC_PLAZOSOL: '168',
      TIP_CREDLIB: 'Libre%20Inversion'
    };
    try {
      const response = await fetch('http://localhost:4000/api/simular-credito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log('Respuesta de prueba API Activos y Finanzas:', data);
      return data;
    } catch (error) {
      console.error('Error en test API Activos y Finanzas:', error);
      throw error;
    }
  }
} 
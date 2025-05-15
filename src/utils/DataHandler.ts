import { Usuario } from '@/models/usuario';
import { Concepto, ConceptoFormateado } from '@/models/concepto';

/**
 * Clase encargada de manejar los arreglos de datos y tabularlos para mostrar en el aplicativo.
 * Esta clase sigue el patrón Singleton para garantizar una única instancia en toda la aplicación.
 */
export class DataHandler {
  private static instance: DataHandler;
  
  private constructor() {
    // Constructor privado para implementar el patrón Singleton
  }

  /**
   * Retorna la instancia única de DataHandler
   */
  public static getInstance(): DataHandler {
    if (!DataHandler.instance) {
      DataHandler.instance = new DataHandler();
    }
    return DataHandler.instance;
  }

  /**
   * Tabula y formatea datos de usuarios para mostrar en la interfaz
   */
  public tabularUsuarios(data: any[]): Usuario[] {
    if (!Array.isArray(data)) {
      return [];
    }
    const usuarios = data.map((cliente, index) => {
      const usuario: Usuario = {
        id: cliente.id || 0,
        idcliente: cliente.idcliente || 0,
        nombres: cliente['Nombres docente'] || '',
        apellidos: cliente['Apellidos docente'] || '',
        documento: cliente.documento || '',
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        comprobante: cliente.comprobante || '',
        email_agente: cliente.email_agente || '',
        created_at: cliente.created_at || '',
        updated_at: cliente.updated_at || ''
      };
      return usuario;
    });
    return usuarios;
  }

  /**
   * Tabula y formatea datos de contactos para mostrar en la interfaz
   */
  public tabularContactos(datos: any[]): any[] {
    if (!datos || datos.length === 0) return [];
    
    return datos.map(contacto => ({
      id: contacto.id,
      usuarioId: contacto.usuario_id,
      fecha: new Date(contacto.fecha_contacto).toLocaleString(),
      tipo: contacto.tipo_contacto,
      tipificacion: contacto.tipificacion || 'no contesta',
      observaciones: contacto.observaciones || '',
      resultado: contacto.resultado || ''
    }));
  }

  /**
   * Tabula y formatea datos de teléfonos para mostrar en la interfaz
   */
  public tabularTelefonos(datos: any[]): any[] {
    if (!datos || datos.length === 0) return [];
    
    return datos.map(telefono => ({
      id: telefono.id,
      usuarioId: telefono.usuario_id,
      numero: telefono.numero,
      tipo: telefono.tipo,
      ciudad: telefono.ciudad || '',
      pagaduria: telefono.pagaduria || '',
      tipificacion: telefono.estado || 'no contesta'
    }));
  }

  /**
   * Tabula y formatea datos de agentes para mostrar en la interfaz
   */
  public tabularAgentes(datos: any[]): any[] {
    if (!datos || datos.length === 0) return [];
    
    return datos.map(agente => ({
      id: agente.idagente,
      nombre: agente.nombre || '',
      telefono: agente.telefono || '',
      email: agente.email,
      rol: agente.rol || 'Usuario',
      estado: agente.estado || 'Activo'
    }));
  }

  /**
   * Organiza datos para mostrar en gráficas o reportes
   */
  public prepararDatosParaGraficas(datos: any[], campoAgrupacion: string): Record<string, number> {
    if (!datos || datos.length === 0) return {};
    
    const resultado: Record<string, number> = {};
    
    datos.forEach(item => {
      const valor = item[campoAgrupacion] || 'Sin especificar';
      if (resultado[valor]) {
        resultado[valor]++;
      } else {
        resultado[valor] = 1;
      }
    });
    
    return resultado;
  }

  /**
   * Formatea los conceptos recibidos de la base de datos
   * @param conceptos - Array de conceptos en formato raw
   * @returns Array de conceptos formateados
   */
  public formatearConceptos(conceptos: Concepto[]): ConceptoFormateado[] {
    if (!Array.isArray(conceptos)) {
      console.log('❌ DataHandler: Los conceptos no son un array');
      return [];
    }

    return conceptos.map(concepto => {
      // Convertir strings de moneda a números
      const ingresos = this.convertirMonedaANumero(concepto.INGRESOS);
      const descuentos = this.convertirMonedaANumero(concepto.DESCUENTOS);

      return {
        concepto: concepto.CONCEPTO,
        ingresos,
        descuentos
      };
    });
  }

  /**
   * Convierte un string de moneda a número
   * @param moneda - String en formato "$1,234.56"
   * @returns número
   */
  private convertirMonedaANumero(moneda: string): number {
    if (!moneda) return 0;
    // Remover el símbolo de moneda y las comas
    const numeroStr = moneda.replace(/[$,]/g, '');
    return parseFloat(numeroStr) || 0;
  }

  static procesarDatosUsuario(datos: any): Usuario {
    const usuario: Usuario = {
      id: datos.id || 0,
      idcliente: datos.idcliente || 0,
      nombres: datos.nombres || '',
      apellidos: datos.apellidos || '',
      documento: datos.documento || '',
      email: datos.email || '',
      telefono: datos.telefono || '',
      direccion: datos.direccion || '',
      comprobante: datos.comprobante || '',
      email_agente: datos.email_agente,
      created_at: datos.created_at,
      updated_at: datos.updated_at
    };
    return usuario;
  }
}



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
  public tabularUsuarios(datos: any[]): any[] {
    if (!datos || datos.length === 0) return [];
    
    return datos.map(usuario => ({
      id: usuario.id,
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      fechaNacimiento: new Date(usuario.fecha_nacimiento).toLocaleDateString(),
      estado: usuario.estado || 'Inactivo',
      fechaAsignacion: usuario.fecha_asignacion ? new Date(usuario.fecha_asignacion).toLocaleDateString() : '',
      tipificacion: usuario.tipificacion || ''
    }));
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
}



// Interface for contact info
export interface ContactoInfo {
  id: number;
  pagaduria: string;
  tipo: 'movil' | 'fijo';
  numero: string;
  ciudad?: string; // Solo para teléfonos fijos
  tipificacion: 'no contesta' | 'equivocado' | 'fuera de servicio' | 'contactado';
  fechaGestion?: Date;
}

export interface HistorialContacto {
  id: number;
  numero: string;
  tipo: 'movil' | 'fijo';
  tipificacion: ContactoInfo['tipificacion'];
  fecha: Date;
}

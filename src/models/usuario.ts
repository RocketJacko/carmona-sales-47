export interface Usuario {
  idcliente: string;
  comprobante: number;
  nombre: string;
  apellido: string;
  estado?: 'Activo' | 'Inactivo';
  fechaAsignacion?: string;
  tipificacion?: string;
}

export interface UsuarioGestion {
  idcliente: string;
  nombreCompleto: string;
  comprobante: number;
  estado: 'Activo' | 'Inactivo';
  fechaAsignacion: string;
  tipificacion: string;
}

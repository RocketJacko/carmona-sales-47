export interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  fechaNacimiento: string;
  estado: 'Activo' | 'Inactivo';
  fechaAsignacion: string;
  tipificacion: string;
}

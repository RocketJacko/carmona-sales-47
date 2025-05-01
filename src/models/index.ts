
// Los modelos representan los datos y la lógica de negocio
// Aquí definiremos las interfaces y tipos para nuestros datos

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

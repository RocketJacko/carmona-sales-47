
// Controlador para productos

import { Producto } from '../models';

export const productoController = {
  // Estos métodos serán reemplazados con llamadas a API reales más adelante
  obtenerProductos: async (): Promise<Producto[]> => {
    console.log('Simulando obtención de productos');
    return [];
  },
  
  obtenerProductoPorId: async (id: number): Promise<Producto | null> => {
    console.log('Simulando obtención de producto por ID:', id);
    return null;
  }
};


// Los controladores manejan la lógica de la aplicación
// Aquí implementaremos métodos para gestionar los datos

import { Usuario } from '../models';

// Datos de muestra para visualización
const usuariosMuestra: Usuario[] = [
  {
    id: 1,
    cedula: "1098765432",
    nombre: "Carlos Rodríguez",
    fechaNacimiento: "1985-04-12",
    estado: "Activo",
    fechaAsignacion: "2023-10-15",
    tipificacion: "Interesado"
  },
  {
    id: 2,
    cedula: "1076543210",
    nombre: "María López",
    fechaNacimiento: "1990-08-22",
    estado: "Activo",
    fechaAsignacion: "2023-09-05",
    tipificacion: "Localizado"
  },
  {
    id: 3,
    cedula: "1054321098",
    nombre: "Juan Pérez",
    fechaNacimiento: "1978-11-30",
    estado: "Inactivo",
    fechaAsignacion: "2023-08-20",
    tipificacion: "No interesado"
  },
  {
    id: 4,
    cedula: "1032109876",
    nombre: "Ana Martínez",
    fechaNacimiento: "1992-05-17",
    estado: "Activo",
    fechaAsignacion: "2023-11-10",
    tipificacion: ""
  },
  {
    id: 5,
    cedula: "1010987654",
    nombre: "Luis Sánchez",
    fechaNacimiento: "1983-09-25",
    estado: "Inactivo",
    fechaAsignacion: "2023-07-30",
    tipificacion: "Interesado"
  }
];

// Esta es una implementación básica sin conexiones reales
export const usuarioController = {
  // Estos métodos serán reemplazados con llamadas a API reales más adelante
  obtenerUsuarios: async (): Promise<Usuario[]> => {
    console.log('Simulando obtención de usuarios');
    return [...usuariosMuestra];
  },
  
  obtenerUsuarioPorId: async (id: number): Promise<Usuario | null> => {
    console.log('Simulando obtención de usuario por ID:', id);
    return usuariosMuestra.find(usuario => usuario.id === id) || null;
  },
  
  buscarUsuarios: async (termino: string): Promise<Usuario[]> => {
    console.log('Simulando búsqueda de usuarios con término:', termino);
    if (!termino) return [...usuariosMuestra];
    
    const terminoLower = termino.toLowerCase();
    return usuariosMuestra.filter(
      usuario => 
        usuario.nombre.toLowerCase().includes(terminoLower) || 
        usuario.cedula.includes(termino)
    );
  }
};

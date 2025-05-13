import { create } from 'zustand';
import { supabase } from '@/config/supabase';
import { Usuario } from '@/models/usuario';
import { DBHandler } from '@/utils/DBHandler';
import { DataHandler } from '@/utils/DataHandler';

interface UsuarioState {
  usuarios: Usuario[];
  setUsuarios: (usuarios: Usuario[]) => void;
  filtrarUsuarios: (termino: string) => void;
  actualizarTablaUsuarios: (ejecutivo: string) => Promise<void>;
  buscarYAsignarCliente: (ejecutivo: string) => Promise<{ exito: boolean; mensaje: string }>;
}

export const useUsuarioStore = create<UsuarioState>((set, get) => ({
  usuarios: [],
  setUsuarios: (usuarios) => set({ usuarios }),
  
  filtrarUsuarios: (termino) => {
    const { usuarios } = get();
    if (!termino.trim()) {
      // Si el término está vacío, recargar todos los usuarios
      const ejecutivo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : null;
      if (ejecutivo) {
        get().actualizarTablaUsuarios(ejecutivo);
      }
      return;
    }

    const terminoLower = termino.toLowerCase();
    const usuariosFiltrados = usuarios.filter(usuario => 
      usuario.idcliente.toString().includes(terminoLower) ||
      usuario.comprobante.toLowerCase().includes(terminoLower) ||
      usuario.nombres.toLowerCase().includes(terminoLower) ||
      usuario.apellidos.toLowerCase().includes(terminoLower)
    );
    set({ usuarios: usuariosFiltrados });
  },

  actualizarTablaUsuarios: async (ejecutivo: string) => {
    try {
      console.log('1. Obteniendo clientes asignados para:', ejecutivo);
      const { data: clientes, error } = await supabase
        .from('prospectoFidu')
        .select('"IdCliente", "Nombres docente", "Apellidos docente"')
        .eq('ejecutivoAsignado', ejecutivo);

      if (error) {
        console.error('Error al obtener clientes:', error);
        throw error;
      }

      console.log('2. Clientes obtenidos:', clientes);

      if (!clientes || clientes.length === 0) {
        console.log('No se encontraron clientes asignados');
        set({ usuarios: [] });
        return;
      }

      // Transformar los datos al formato esperado por la tabla
      const usuariosProcesados = clientes.map(cliente => ({
        idcliente: cliente.IdCliente,
        nombres: cliente["Nombres docente"],
        apellidos: cliente["Apellidos docente"]
      }));

      console.log('3. Usuarios procesados:', usuariosProcesados);
      set({ usuarios: usuariosProcesados });
    } catch (error) {
      console.error('Error al actualizar tabla:', error);
      throw error;
    }
  },

  buscarYAsignarCliente: async (ejecutivo: string) => {
    try {
      console.log('1. Iniciando búsqueda de cliente para:', ejecutivo);
      const dbHandler = new DBHandler();
      const cliente = await dbHandler.buscarYAsignarCliente(ejecutivo);
      
      if (!cliente) {
        console.log('No se encontró ningún cliente disponible');
        return { 
          exito: false, 
          mensaje: 'No hay clientes disponibles para asignar' 
        };
      }

      console.log('2. Cliente encontrado:', cliente);
      return { 
        exito: true, 
        mensaje: 'Cliente asignado exitosamente' 
      };
    } catch (error) {
      console.error('Error al buscar y asignar cliente:', error);
      return { 
        exito: false, 
        mensaje: 'Error al buscar y asignar cliente' 
      };
    }
  }
})); 
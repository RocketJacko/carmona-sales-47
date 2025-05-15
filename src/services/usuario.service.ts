import { create } from 'zustand';
import { supabase } from '@/config/supabase';
import { Usuario } from '@/models/usuario';
import { DBHandler } from '@/utils/DBHandler';
import { DataHandler } from '@/utils/DataHandler';

interface UsuarioState {
  usuarios: Usuario[];
  setUsuarios: (usuarios: Usuario[]) => void;
  filtrarUsuarios: (termino: string) => void;
  actualizarTablaUsuarios: (email: string) => Promise<void>;
  buscarYAsignarCliente: (email: string) => Promise<{ exito: boolean; mensaje: string }>;
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

  actualizarTablaUsuarios: async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email_agente', email);

      if (error) {
        console.error('Error al obtener usuarios:', error);
        return;
      }

      set({ usuarios: data || [] });
    } catch (error) {
      console.error('Error al actualizar tabla de usuarios:', error);
    }
  },

  buscarYAsignarCliente: async (email: string) => {
    try {
      // Primero verificamos si el usuario ya tiene clientes asignados
      const { data: usuariosExistentes, error: errorExistentes } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email_agente', email);

      if (errorExistentes) {
        throw new Error('Error al verificar usuarios existentes');
      }

      // Si ya tiene clientes, no permitimos asignar más
      if (usuariosExistentes && usuariosExistentes.length > 0) {
        return {
          exito: false,
          mensaje: 'Ya tienes clientes asignados. No puedes agregar más.'
        };
      }

      // Buscamos un cliente sin asignar
      const { data: clienteSinAsignar, error: errorBusqueda } = await supabase
        .from('usuarios')
        .select('*')
        .is('email_agente', null)
        .limit(1)
        .single();

      if (errorBusqueda) {
        throw new Error('Error al buscar cliente sin asignar');
      }

      if (!clienteSinAsignar) {
        return {
          exito: false,
          mensaje: 'No hay clientes disponibles para asignar'
        };
      }

      // Asignamos el cliente al agente
      const { error: errorAsignacion } = await supabase
        .from('usuarios')
        .update({ email_agente: email })
        .eq('id', clienteSinAsignar.id);

      if (errorAsignacion) {
        throw new Error('Error al asignar cliente');
      }

      return {
        exito: true,
        mensaje: 'Cliente asignado exitosamente'
      };
    } catch (error) {
      console.error('Error en buscarYAsignarCliente:', error);
      return {
        exito: false,
        mensaje: 'Error al asignar cliente'
      };
    }
  }
})); 
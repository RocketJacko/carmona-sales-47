import { create } from 'zustand';
import { supabase } from '@/config/supabase';
import { Usuario } from '@/models/usuario';
import { DBHandler } from '@/utils/DBHandler';
import { DataHandler } from '@/utils/DataHandler';

interface UsuarioState {
  usuarios: Usuario[];
  setUsuarios: (usuarios: Usuario[]) => void;
  filtrarUsuarios: (termino: string) => void;
}

export const useUsuarioStore = create<UsuarioState>((set, get) => ({
  usuarios: [],
  setUsuarios: (usuarios) => set({ usuarios }),
  filtrarUsuarios: (termino) => {
    const { usuarios } = get();
    if (!termino.trim()) {
      set({ usuarios });
      return;
    }
    const terminoLower = termino.toLowerCase();
    const usuariosFiltrados = usuarios.filter(usuario => 
      (usuario.idcliente && usuario.idcliente.toString().includes(terminoLower)) ||
      (usuario.comprobante && usuario.comprobante.toLowerCase().includes(terminoLower)) ||
      (usuario.nombres && usuario.nombres.toLowerCase().includes(terminoLower)) ||
      (usuario.apellidos && usuario.apellidos.toLowerCase().includes(terminoLower))
    );
    set({ usuarios: usuariosFiltrados });
  },
})); 
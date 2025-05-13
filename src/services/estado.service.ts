import { create } from 'zustand';

interface ClienteSeleccionado {
  id: number;
  nombre: string;
  numeroDocumento: string;
  pagaduria: string;
  tipificacion: string;
  fechaAgendada?: Date;
  observaciones?: string;
  notas?: string;
  estado: 'pendiente' | 'agendado' | 'en_proceso' | 'completado';
}

interface EstadoStore {
  clienteSeleccionado: ClienteSeleccionado | null;
  setClienteSeleccionado: (cliente: ClienteSeleccionado | null) => void;
  actualizarTipificacion: (tipificacion: string) => void;
  actualizarAgendamiento: (fecha: Date, observaciones: string, notas: string) => void;
  actualizarEstado: (estado: ClienteSeleccionado['estado']) => void;
}

export const useEstadoStore = create<EstadoStore>((set) => ({
  clienteSeleccionado: null,
  
  setClienteSeleccionado: (cliente) => set({ clienteSeleccionado: cliente }),
  
  actualizarTipificacion: (tipificacion) => 
    set((state) => ({
      clienteSeleccionado: state.clienteSeleccionado 
        ? { ...state.clienteSeleccionado, tipificacion }
        : null
    })),
    
  actualizarAgendamiento: (fecha, observaciones, notas) =>
    set((state) => ({
      clienteSeleccionado: state.clienteSeleccionado
        ? {
            ...state.clienteSeleccionado,
            fechaAgendada: fecha,
            observaciones,
            notas,
            estado: 'agendado'
          }
        : null
    })),
    
  actualizarEstado: (estado) =>
    set((state) => ({
      clienteSeleccionado: state.clienteSeleccionado
        ? { ...state.clienteSeleccionado, estado }
        : null
    }))
})); 
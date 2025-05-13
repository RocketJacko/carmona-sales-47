import { create } from 'zustand';
import { DBHandler } from '@/utils/DBHandler';
import { DataHandler } from '@/utils/DataHandler';

interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  fechaNacimiento: string;
  estado: string;
  fechaAsignacion: string;
  tipificacion: string;
}

interface UsuarioStore {
  usuarios: Usuario[];
  setUsuarios: (usuarios: Usuario[]) => void;
  filtrarUsuarios: (busqueda: string) => void;
  buscarClienteDisponible: () => Promise<Usuario | null>;
  asignarCliente: (usuarioId: number, ejecutivo: string) => Promise<boolean>;
  actualizarTablaUsuarios: (ejecutivo: string) => Promise<void>;
  buscarYAsignarCliente: (ejecutivo: string) => Promise<{ exito: boolean; mensaje: string; cliente?: any }>;
}

class UsuarioService {
  private static instance: UsuarioService;
  private dbHandler: DBHandler;
  private dataHandler: DataHandler;

  private constructor() {
    this.dbHandler = DBHandler.getInstance();
    this.dataHandler = DataHandler.getInstance();
  }

  public static getInstance(): UsuarioService {
    if (!UsuarioService.instance) {
      UsuarioService.instance = new UsuarioService();
    }
    return UsuarioService.instance;
  }

  public async cargarUsuarios(ejecutivo: string): Promise<Usuario[]> {
    try {
      const clientes = await this.dbHandler.obtenerClientesAsignados(ejecutivo);
      return this.dataHandler.tabularUsuarios(clientes);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      return [];
    }
  }

  public filtrarUsuarios(usuarios: Usuario[], busqueda: string): Usuario[] {
    if (!busqueda.trim()) return usuarios;
    
    const terminoBusqueda = busqueda.toLowerCase();
    return usuarios.filter(usuario => 
      usuario.nombre.toLowerCase().includes(terminoBusqueda) ||
      usuario.cedula.includes(terminoBusqueda)
    );
  }

  public async buscarClienteDisponible(): Promise<Usuario | null> {
    try {
      const clientes = await this.dbHandler.obtenerClientesAsignados('');
      if (clientes.length > 0) {
        return this.dataHandler.tabularUsuarios([clientes[0]])[0];
      }
      return null;
    } catch (error) {
      console.error('Error al buscar cliente disponible:', error);
      return null;
    }
  }

  public async asignarCliente(usuarioId: number, ejecutivo: string): Promise<boolean> {
    try {
      // Aquí deberías implementar la lógica de asignación en DBHandler
      return true;
    } catch (error) {
      console.error('Error al asignar cliente:', error);
      return false;
    }
  }

  public async actualizarTablaUsuarios(ejecutivo: string): Promise<Usuario[]> {
    try {
      const clientes = await this.dbHandler.obtenerClientesAsignados(ejecutivo);
      return this.dataHandler.tabularUsuarios(clientes);
    } catch (error) {
      console.error('Error al actualizar tabla de usuarios:', error);
      return [];
    }
  }

  public async buscarYAsignarCliente(ejecutivo: string): Promise<{ exito: boolean; mensaje: string; cliente?: any }> {
    try {
      const resultado = await this.dbHandler.buscarYAsignarCliente(ejecutivo);
      
      if (resultado.exito && resultado.cliente) {
        // Actualizar la tabla de usuarios después de asignar
        await this.actualizarTablaUsuarios(ejecutivo);
      }
      
      return resultado;
    } catch (error) {
      console.error('Error en UsuarioService.buscarYAsignarCliente:', error);
      return {
        exito: false,
        mensaje: error instanceof Error ? error.message : 'Error desconocido al buscar y asignar cliente'
      };
    }
  }
}

export const useUsuarioStore = create<UsuarioStore>((set) => ({
  usuarios: [],
  setUsuarios: (usuarios) => set({ usuarios }),
  filtrarUsuarios: (busqueda) => {
    const service = UsuarioService.getInstance();
    set((state) => ({
      usuarios: service.filtrarUsuarios(state.usuarios, busqueda)
    }));
  },
  buscarClienteDisponible: async () => {
    const service = UsuarioService.getInstance();
    return await service.buscarClienteDisponible();
  },
  asignarCliente: async (usuarioId, ejecutivo) => {
    const service = UsuarioService.getInstance();
    return await service.asignarCliente(usuarioId, ejecutivo);
  },
  actualizarTablaUsuarios: async (ejecutivo) => {
    const service = UsuarioService.getInstance();
    const usuarios = await service.actualizarTablaUsuarios(ejecutivo);
    set({ usuarios });
  },
  buscarYAsignarCliente: async (ejecutivo) => {
    const service = UsuarioService.getInstance();
    return await service.buscarYAsignarCliente(ejecutivo);
  }
}));

export default UsuarioService; 
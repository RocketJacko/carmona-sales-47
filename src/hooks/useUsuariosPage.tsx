
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usuarioController } from '@/controllers/usuarioController';
import { Usuario } from '@/models';
import { useNavigate } from 'react-router-dom';
import { useContactoGestion } from '@/hooks/useContactoGestion';

export const useUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const [mostrarContacto, setMostrarContacto] = useState(false);
  const [mostrarRadicacion, setMostrarRadicacion] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use our custom hook for contact management
  const {
    usuarioEnGestion,
    contactosInfo,
    indiceContactoActual,
    historialContactos,
    inicializarContactos,
    handleIniciarGestion,
    handleTipificacionChange,
    handleSimularCredito
  } = useContactoGestion();

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await usuarioController.obtenerUsuarios();
        setUsuarios(data);

        // Initialize contact information for each user
        inicializarContactos(data.map(u => u.id));
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los usuarios',
          variant: 'destructive'
        });
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, [toast, inicializarContactos]);

  const filtrarUsuarios = async () => {
    try {
      const resultados = await usuarioController.buscarUsuarios(busqueda);
      setUsuarios(resultados);
    } catch (error) {
      console.error('Error al filtrar usuarios:', error);
      toast({
        title: 'Error',
        description: 'Error al realizar la búsqueda',
        variant: 'destructive'
      });
    }
  };

  const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      filtrarUsuarios();
    }, 300);

    return () => clearTimeout(timeout);
  }, [busqueda]);

  const handleClickSimularCredito = (userId: number) => {
    handleSimularCredito(userId);
    setMostrarSimulador(true);
    setMostrarContacto(false);
    setMostrarRadicacion(false);
  };

  const handleCerrarSimulador = () => {
    setMostrarSimulador(false);
    setMostrarContacto(false);
    setMostrarRadicacion(false);
  };
  
  const handleIniciarContacto = () => {
    setMostrarContacto(true);
  };

  // When starting management, now we directly show the simulator
  const handleIniciarGestionUsuario = (userId: number) => {
    handleIniciarGestion(userId);
    setMostrarSimulador(true);
    setMostrarContacto(false);
    setMostrarRadicacion(false);
  };
  
  const handleMostrarRadicacion = () => {
    setMostrarRadicacion(true);
  };
  
  const handleCerrarRadicacion = () => {
    setMostrarRadicacion(false);
    setMostrarSimulador(false);
    setMostrarContacto(false);
  };

  // Handler for migrating clients to Creditos section
  const handleMigrarACreditos = (usuarioId: number) => {
    toast({
      title: 'Cliente migrado a Créditos',
      description: 'El cliente ha sido migrado a la sección de Créditos',
      variant: 'default'
    });
    
    // Navigate to the creditos page after a short delay
    setTimeout(() => {
      navigate('/crm/creditos');
    }, 1500);
  };

  // Handler for migrating clients to Agendamientos section
  const handleMigrarAAgendamientos = (usuarioId: number, fechaAgendada: Date, observaciones: string, notas: string) => {
    toast({
      title: 'Cliente migrado a Agendamientos',
      description: `El cliente ha sido agendado para ${fechaAgendada.toLocaleDateString()}`,
      variant: 'default'
    });
    
    // Navigate to the agendamientos page after a short delay
    setTimeout(() => {
      navigate('/crm/agendamientos');
    }, 1500);
  };

  return {
    usuarios,
    busqueda,
    cargando,
    hoveredRowId,
    mostrarSimulador,
    mostrarContacto,
    mostrarRadicacion,
    usuarioEnGestion,
    contactosInfo,
    indiceContactoActual,
    historialContactos,
    setHoveredRowId,
    handleBusqueda,
    handleIniciarGestionUsuario,
    handleClickSimularCredito,
    handleCerrarSimulador,
    handleIniciarContacto,
    handleMostrarRadicacion,
    handleCerrarRadicacion,
    handleTipificacionChange,
    handleMigrarACreditos,
    handleMigrarAAgendamientos
  };
};

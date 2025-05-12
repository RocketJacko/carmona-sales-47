import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usuarioController } from '@/controllers/usuarioController';
import { Usuario } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import our components
import BuscadorUsuarios from '@/components/usuarios/BuscadorUsuarios';
import UsuariosTable from '@/components/usuarios/UsuariosTable';
import ContactoGestion from '@/components/usuarios/ContactoGestion';
import { useContactoGestion } from '@/hooks/useContactoGestion';
import SimuladorCredito from '@/components/credito/SimuladorCredito';
import RadicacionForm from '@/components/credito/RadicacionForm';

const PAGADURIAS = [
  'Colpensiones',
  'Fiduprevisora',
  'FOPEP',
  'Cremil',
  'Casur',
  'Educame',
  'Seduca',
  'Armada',
  'Cagen',
  'Dian',
  'EPM',
  'Fiscalia',
  'Mindefensa',
  'Municipios'
];

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const [mostrarContacto, setMostrarContacto] = useState(false);
  const [mostrarRadicacion, setMostrarRadicacion] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pagaduriaSeleccionada, setPagaduriaSeleccionada] = useState<string | null>(null);

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
  }, [toast]);

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

  const handlePagaduriaSelect = async (pagaduria: string) => {
    setPagaduriaSeleccionada(pagaduria);
    toast({
      title: 'Nuevo Cliente',
      description: `Iniciando registro para ${pagaduria}`,
      variant: 'default'
    });

    // Aquí irá el llamado a la base de datos
    try {
      // TODO: Implementar llamado a la base de datos
      // const response = await usuarioController.crearNuevoCliente({
      //   pagaduria,
      //   // otros datos necesarios
      // });
      
      // Por ahora solo mostramos el toast
    } catch (error) {
      console.error('Error al crear nuevo cliente:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el nuevo cliente',
        variant: 'destructive'
      });
    }
  };

  const handleAgregarCliente = () => {
    toast({
      title: 'Nuevo Cliente',
      description: 'Iniciando proceso de registro de nuevo cliente',
      variant: 'default'
    });
  };

  return (
    <div className="animate-fade-in">
      <Card className="shadow-lg border-none rounded-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Gestión de Clientes</CardTitle>
            <Button
              onClick={handleAgregarCliente}
              className="bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search component */}
          <BuscadorUsuarios 
            busqueda={busqueda}
            onBusquedaChange={handleBusqueda}
          />

          {/* Users table component */}
          <UsuariosTable 
            usuarios={usuarios}
            cargando={cargando}
            hoveredRowId={hoveredRowId}
            usuarioEnGestion={usuarioEnGestion}
            onHoverChange={setHoveredRowId}
            onIniciarGestion={handleIniciarGestionUsuario}
          />
        </CardContent>
      </Card>

      {/* Credit Simulator - shown when user clicks "Iniciar Gestión" */}
      {mostrarSimulador && usuarioEnGestion !== null && (
        <div className="mt-10">
          <SimuladorCredito
            usuarioId={usuarioEnGestion}
            nombreUsuario={usuarios.find(u => u.id === usuarioEnGestion)?.nombre}
            onClose={handleCerrarSimulador}
            onContactar={handleIniciarContacto}
          />
        </div>
      )}

      {/* Contact section - only shown after "Contactar" from the simulator is clicked */}
      {mostrarContacto && usuarioEnGestion !== null && (
        <div className="mt-10">
          <ContactoGestion 
            usuarioId={usuarioEnGestion}
            contactosInfo={contactosInfo}
            indiceContactoActual={indiceContactoActual}
            historialContactos={historialContactos}
            onTipificacionChange={handleTipificacionChange}
            onSimularCredito={handleClickSimularCredito}
            nombreUsuario={usuarios.find(u => u.id === usuarioEnGestion)?.nombre}
            onMigrarACreditos={handleMigrarACreditos}
            onMigrarAAgendamientos={handleMigrarAAgendamientos}
          />
        </div>
      )}
      
      {/* Radicación section - shown when "Acepta" is selected in the contact dropdown */}
      {mostrarRadicacion && usuarioEnGestion !== null && (
        <RadicacionForm
          usuarioId={usuarioEnGestion}
          nombreUsuario={usuarios.find(u => u.id === usuarioEnGestion)?.nombre}
          onClose={handleCerrarRadicacion}
        />
      )}
    </div>
  );
};

export default UsuariosPage;

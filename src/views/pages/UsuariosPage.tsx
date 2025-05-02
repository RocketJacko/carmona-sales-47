
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usuarioController } from '@/controllers/usuarioController';
import { Usuario } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import our components
import BuscadorUsuarios from '@/components/usuarios/BuscadorUsuarios';
import UsuariosTable from '@/components/usuarios/UsuariosTable';
import ContactoGestion from '@/components/usuarios/ContactoGestion';
import { useContactoGestion } from '@/hooks/useContactoGestion';
import SimuladorCredito from '@/components/credito/SimuladorCredito';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const { toast } = useToast();

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
  };

  const handleCerrarSimulador = () => {
    setMostrarSimulador(false);
  };

  return (
    <div className="animate-fade-in">
      <Card className="shadow-lg border-none rounded-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-2xl font-bold text-gray-800">Gestión de Clientes</CardTitle>
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
            onIniciarGestion={handleIniciarGestion}
          />
        </CardContent>
      </Card>

      {/* Simulador de Crédito */}
      {mostrarSimulador && usuarioEnGestion !== null && (
        <div className="mt-10">
          <SimuladorCredito
            usuarioId={usuarioEnGestion}
            nombreUsuario={usuarios.find(u => u.id === usuarioEnGestion)?.nombre}
            onClose={handleCerrarSimulador}
          />
        </div>
      )}

      {/* Contact management section - positioned outside with spacing */}
      {usuarioEnGestion !== null && (
        <div className="mt-10">
          <ContactoGestion 
            usuarioId={usuarioEnGestion}
            contactosInfo={contactosInfo}
            indiceContactoActual={indiceContactoActual}
            historialContactos={historialContactos}
            onTipificacionChange={handleTipificacionChange}
            onSimularCredito={handleClickSimularCredito}
            nombreUsuario={usuarios.find(u => u.id === usuarioEnGestion)?.nombre}
          />
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;

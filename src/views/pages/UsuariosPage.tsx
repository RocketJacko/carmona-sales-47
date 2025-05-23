import React, { useState, useEffect, ChangeEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUsuarioStore } from '@/services/usuario.service';
import { useContactoGestion } from '@/hooks/useContactoGestion';
import BuscadorUsuarios from '@/components/usuarios/BuscadorUsuarios';
import UsuariosTable from '@/components/usuarios/UsuariosTable';
import ContactoGestion from '@/components/usuarios/ContactoGestion';
import { Usuario } from '@/models/usuario';
import { supabase } from '@/config/supabase';

interface Concepto {
  CONCEPTO: string;
  INGRESOS: number;
  DESCUENTOS: number;
}

const UsuariosPage: React.FC = () => {
  const [cargando, setCargando] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [usuarioEnGestion, setUsuarioEnGestion] = useState<string | null>(null);
  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const [mostrarContacto, setMostrarContacto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [conceptos, setConceptos] = useState<Concepto[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { usuarios, setUsuarios, filtrarUsuarios, actualizarTablaUsuarios, buscarYAsignarCliente } = useUsuarioStore();
  const { 
    contactosInfo, 
    indiceContactoActual, 
    historialContactos, 
    inicializarContactos,
    handleTipificacionChange,
    handleSimularCredito
  } = useContactoGestion();

  useEffect(() => {
    const cargarDatos = async () => {
      if (user?.email) {
        await actualizarTablaUsuarios(user.email);
        setCargando(false);
      }
    };

    cargarDatos();
  }, [user?.email, actualizarTablaUsuarios]);

  useEffect(() => {
    if (usuarios.length > 0) {
      inicializarContactos(usuarios.map(u => Number(u.idcliente)));
    }
  }, [usuarios]);

  const handleBusqueda = (e: ChangeEvent<HTMLInputElement>) => {
    const termino = e.target.value;
    setBusqueda(termino);
    filtrarUsuarios(termino);
  };

  const handleIniciarGestionUsuario = async (usuarioId: string) => {
    setUsuarioEnGestion(usuarioId);
    setMostrarContacto(true);
    // Guardar el idCliente en localStorage para trazabilidad
    localStorage.setItem('idCliente', usuarioId);
    // Si necesitas cargar conceptos u otros datos, hazlo aquí
  };

  const handleCerrarSimulador = () => {
    setMostrarSimulador(false);
    setUsuarioEnGestion(null);
  };

  const handleIniciarContacto = () => {
    setMostrarContacto(true);
  };

  const handleCerrarContacto = () => {
    setMostrarContacto(false);
    setUsuarioEnGestion(null);
  };

  const handleAgregarCliente = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "No hay un usuario autenticado",
        variant: "destructive"
      });
      return;
    }
    // Guardar usuario en localStorage
    localStorage.setItem('user', JSON.stringify(user));
    try {
      setCargando(true);
      const resultado = await buscarYAsignarCliente(user.email);
      if (resultado.exito) {
        await actualizarTablaUsuarios(user.email);
        toast({
          title: "Éxito",
          description: resultado.mensaje
        });
      } else {
        toast({
          title: "Error",
          description: resultado.mensaje,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar agregar el cliente",
        variant: "destructive"
      });
    } finally {
      setCargando(false);
    }
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
          <BuscadorUsuarios 
            busqueda={busqueda}
            onBusquedaChange={handleBusqueda}
          />

          <UsuariosTable 
            usuarios={usuarios}
            cargando={cargando}
            usuarioEnGestion={usuarioEnGestion}
            onIniciarGestion={handleIniciarGestionUsuario}
          />
        </CardContent>
      </Card>

      {mostrarContacto && usuarioEnGestion !== null && (
        <div className="mt-10">
          <ContactoGestion
            usuarioId={parseInt(usuarioEnGestion)}
            contactosInfo={contactosInfo}
            indiceContactoActual={indiceContactoActual}
            historialContactos={historialContactos}
            onTipificacionChange={handleTipificacionChange}
            onSimularCredito={handleSimularCredito}
            nombreUsuario={usuarios.find(u => String(u.idcliente) === usuarioEnGestion)?.nombres}
            onClose={handleCerrarContacto}
          />
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;

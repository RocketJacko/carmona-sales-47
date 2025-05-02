
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usuarioController } from '@/controllers/usuarioController';
import { Usuario } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, FileText, Check, Loader2, Search, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select"

interface ContactoInfo {
  id: number;
  pagaduria: string;
  movil: string;
  tipificacion: 'no contesta' | 'equivocado' | 'fuera de servicio' | 'contactado';
  telefonoFijo: string;
}

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const { toast } = useToast();

  // Nuevos estados para la gestión de contacto
  const [usuarioEnGestion, setUsuarioEnGestion] = useState<number | null>(null);
  const [contactosInfo, setContactosInfo] = useState<Record<number, ContactoInfo[]>>({});

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await usuarioController.obtenerUsuarios();
        setUsuarios(data);

        // Inicializar la información de contacto para cada usuario
        const contactosIniciales: Record<number, ContactoInfo[]> = {};
        data.forEach(usuario => {
          contactosIniciales[usuario.id] = [
            {
              id: 1,
              pagaduria: 'Empresa ABC',
              movil: '300' + Math.floor(1000000 + Math.random() * 9000000),
              tipificacion: 'no contesta',
              telefonoFijo: '601' + Math.floor(1000000 + Math.random() * 9000000)
            },
            {
              id: 2,
              pagaduria: 'Empresa XYZ',
              movil: '310' + Math.floor(1000000 + Math.random() * 9000000),
              tipificacion: 'no contesta',
              telefonoFijo: '601' + Math.floor(1000000 + Math.random() * 9000000)
            }
          ];
        });
        setContactosInfo(contactosIniciales);
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

  const handleIniciarGestion = (usuarioId: number) => {
    // Si ya hay una gestión activa, se cierra primero
    if (usuarioEnGestion === usuarioId) {
      setUsuarioEnGestion(null);
    } else {
      setUsuarioEnGestion(usuarioId);
      
      toast({
        title: 'Gestión Iniciada',
        description: `Se ha iniciado la gestión para el cliente seleccionado`,
        duration: 3000,
      });
    }
  };

  const handleTipificacionChange = (usuarioId: number, contactoId: number, nuevaTipificacion: ContactoInfo['tipificacion']) => {
    setContactosInfo(prevContactos => {
      const nuevosContactos = { ...prevContactos };
      
      if (nuevosContactos[usuarioId]) {
        nuevosContactos[usuarioId] = nuevosContactos[usuarioId].map(contacto => {
          if (contacto.id === contactoId) {
            // Si la tipificación cambia a "no contesta" o "equivocado", generamos un nuevo número
            let nuevoMovil = contacto.movil;
            if (nuevaTipificacion === 'no contesta' || nuevaTipificacion === 'equivocado') {
              nuevoMovil = '320' + Math.floor(1000000 + Math.random() * 9000000);
            }
            
            return { 
              ...contacto, 
              tipificacion: nuevaTipificacion,
              movil: nuevoMovil
            };
          }
          return contacto;
        });
      }
      
      return nuevosContactos;
    });

    toast({
      title: 'Tipificación Actualizada',
      description: `La tipificación ha sido actualizada a ${nuevaTipificacion}`,
      duration: 2000,
    });
  };

  const handleSimularCredito = (usuarioId: number, contactoId: number) => {
    toast({
      title: 'Simulación de Crédito',
      description: 'Iniciando la simulación de crédito para el cliente',
      duration: 3000,
    });
  };

  const getStatusBadgeColor = (estado: string) => {
    return estado === 'Activo'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="animate-fade-in">
      <Card className="shadow-lg border-none rounded-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-2xl font-bold text-gray-800">Gestión de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 relative">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={handleBusqueda}
                className="pl-10 border-gray-300 rounded-lg h-12 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
            </div>
          </div>

          {cargando ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-3 text-lg text-gray-600">Cargando clientes...</span>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-bold">Nombre</TableHead>
                      <TableHead className="font-bold">Fecha Nac.</TableHead>
                      <TableHead className="font-bold">Estado</TableHead>
                      <TableHead className="font-bold">Asignación</TableHead>
                      <TableHead className="text-right font-bold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                          No se encontraron clientes con los criterios de búsqueda
                        </TableCell>
                      </TableRow>
                    ) : (
                      usuarios.map((usuario) => (
                        <React.Fragment key={usuario.id}>
                          <TableRow 
                            className={`transition-all duration-300 hover:bg-gray-50 ${usuarioEnGestion === usuario.id ? 'bg-blue-50' : ''}`}
                            onMouseEnter={() => setHoveredRowId(usuario.id)}
                            onMouseLeave={() => setHoveredRowId(null)}
                            style={{
                              transform: hoveredRowId === usuario.id ? 'scale(1.01)' : 'scale(1)',
                              boxShadow: hoveredRowId === usuario.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                            }}
                          >
                            <TableCell className="font-medium">{usuario.nombre}</TableCell>
                            <TableCell>{new Date(usuario.fechaNacimiento).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span 
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                  getStatusBadgeColor(usuario.estado)
                                }`}
                              >
                                {usuario.estado}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(usuario.fechaAsignacion).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                onClick={() => handleIniciarGestion(usuario.id)}
                                className={`bg-[#9b87f5] hover:bg-[#8a76e4] text-white transition-all duration-300 transform hover:scale-105`}
                              >
                                {usuarioEnGestion === usuario.id ? 'Cerrar Gestión' : 'Iniciar Gestión'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>

                          {/* Sección de Contacto (visible solo cuando se inicia la gestión) */}
                          {usuarioEnGestion === usuario.id && contactosInfo[usuario.id] && (
                            <TableRow className="bg-gray-50">
                              <TableCell colSpan={5} className="p-0">
                                <div className="p-4 border-t border-b border-blue-200 bg-blue-50 animate-fade-down">
                                  <h3 className="text-lg font-semibold mb-3 text-blue-800">Información de Contacto</h3>
                                  
                                  <Table>
                                    <TableHeader className="bg-blue-100/50">
                                      <TableRow>
                                        <TableHead className="font-medium text-blue-800">Pagaduría</TableHead>
                                        <TableHead className="font-medium text-blue-800">Móvil</TableHead>
                                        <TableHead className="font-medium text-blue-800">Tipificación</TableHead>
                                        <TableHead className="font-medium text-blue-800">Teléfono Fijo</TableHead>
                                        <TableHead className="font-medium text-blue-800">Acción</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {contactosInfo[usuario.id].map(contacto => (
                                        <TableRow key={contacto.id} className="bg-white">
                                          <TableCell>{contacto.pagaduria}</TableCell>
                                          <TableCell>{contacto.movil}</TableCell>
                                          <TableCell>
                                            <select 
                                              value={contacto.tipificacion}
                                              onChange={(e) => handleTipificacionChange(
                                                usuario.id, 
                                                contacto.id, 
                                                e.target.value as ContactoInfo['tipificacion']
                                              )}
                                              className="p-2 text-sm rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm w-full"
                                            >
                                              <option value="no contesta">No contesta</option>
                                              <option value="equivocado">Equivocado</option>
                                              <option value="fuera de servicio">Fuera de servicio</option>
                                              <option value="contactado">Contactado</option>
                                            </select>
                                          </TableCell>
                                          <TableCell>{contacto.telefonoFijo}</TableCell>
                                          <TableCell>
                                            <Button 
                                              onClick={() => handleSimularCredito(usuario.id, contacto.id)}
                                              disabled={contacto.tipificacion !== 'contactado'}
                                              className={`bg-[#F97316] hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-105 ${contacto.tipificacion !== 'contactado' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                              Simular Crédito
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuariosPage;

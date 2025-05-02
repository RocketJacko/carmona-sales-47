
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usuarioController } from '@/controllers/usuarioController';
import { Usuario } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, FileText, Check, Loader2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [dialogAction, setDialogAction] = useState<'contactar' | 'agendar' | 'radicar' | 'cerrar'>('contactar');
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await usuarioController.obtenerUsuarios();
        setUsuarios(data);
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

  const handleOpenDialog = (usuario: Usuario, action: 'contactar' | 'agendar' | 'radicar' | 'cerrar') => {
    setSelectedUsuario(usuario);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUsuario(null);
  };

  const getDialogTitle = () => {
    switch (dialogAction) {
      case 'contactar': return 'Gestión de Contacto';
      case 'agendar': return 'Agendar Visita';
      case 'radicar': return 'Radicar Crédito';
      case 'cerrar': return 'Cerrar Cliente';
    }
  };

  const getDialogDescription = () => {
    if (!selectedUsuario) return '';
    
    switch (dialogAction) {
      case 'contactar': return `¿Desea iniciar gestión de contacto para ${selectedUsuario.nombre}?`;
      case 'agendar': return `¿Desea agendar una visita para ${selectedUsuario.nombre}?`;
      case 'radicar': return `¿Desea iniciar la radicación de crédito para ${selectedUsuario.nombre}?`;
      case 'cerrar': return `¿Está seguro de que desea cerrar el cliente ${selectedUsuario.nombre}? Esta acción no se puede deshacer.`;
    }
  };

  const handleConfirmAction = () => {
    if (!selectedUsuario) return;
    
    switch (dialogAction) {
      case 'contactar':
        handleGestionContacto(selectedUsuario);
        break;
      case 'agendar':
        handleAgendarVisita(selectedUsuario);
        break;
      case 'radicar':
        handleRadicacionCredito(selectedUsuario);
        break;
      case 'cerrar':
        handleCerrarCliente(selectedUsuario);
        break;
    }
    
    handleCloseDialog();
  };

  const handleGestionContacto = (usuario: Usuario) => {
    toast({
      title: 'Gestión de Contacto',
      description: `Iniciando gestión para ${usuario.nombre}`,
    });
  };

  const handleAgendarVisita = (usuario: Usuario) => {
    toast({
      title: 'Visita Agendada',
      description: `Se ha agendado una visita para ${usuario.nombre}`,
    });
  };

  const handleRadicacionCredito = (usuario: Usuario) => {
    toast({
      title: 'Radicación de Crédito',
      description: `Iniciando radicación para ${usuario.nombre}`,
    });
  };

  const handleCerrarCliente = (usuario: Usuario) => {
    // En un caso real, esto haría una llamada a la API
    setUsuarios(prevUsuarios => 
      prevUsuarios.filter(u => u.id !== usuario.id)
    );
    
    toast({
      title: 'Cliente Cerrado',
      description: `El cliente ${usuario.nombre} ha sido cerrado con éxito.`,
    });
  };

  const handleTipificacion = (usuario: Usuario, nuevaTipificacion: Usuario['tipificacion']) => {
    // En un caso real, esto haría una llamada a la API
    setUsuarios(prevUsuarios => 
      prevUsuarios.map(u => 
        u.id === usuario.id ? { ...u, tipificacion: nuevaTipificacion } : u
      )
    );
    
    toast({
      title: 'Tipificación Actualizada',
      description: `${usuario.nombre} ahora está ${nuevaTipificacion || 'sin tipificar'}`,
    });
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'contactar': return 'bg-blue-500 hover:bg-blue-600';
      case 'agendar': return 'bg-green-500 hover:bg-green-600';
      case 'radicar': return 'bg-amber-500 hover:bg-amber-600';
      case 'cerrar': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadgeColor = (estado: string) => {
    return estado === 'Activo'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getActionButtonStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background text-white shadow h-9 px-3 transform hover:scale-105 transition-all duration-300";

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
                placeholder="Buscar por nombre o cédula..."
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
                      <TableHead className="w-[100px] font-bold">Cédula</TableHead>
                      <TableHead className="font-bold">Nombre</TableHead>
                      <TableHead className="font-bold">Fecha Nac.</TableHead>
                      <TableHead className="font-bold">Estado</TableHead>
                      <TableHead className="font-bold">Asignación</TableHead>
                      <TableHead className="font-bold">Tipificación</TableHead>
                      <TableHead className="text-right font-bold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                          No se encontraron clientes con los criterios de búsqueda
                        </TableCell>
                      </TableRow>
                    ) : (
                      usuarios.map((usuario) => (
                        <TableRow 
                          key={usuario.id} 
                          className="transition-all duration-300 hover:bg-gray-50"
                          onMouseEnter={() => setHoveredRowId(usuario.id)}
                          onMouseLeave={() => setHoveredRowId(null)}
                          style={{
                            transform: hoveredRowId === usuario.id ? 'scale(1.01)' : 'scale(1)',
                            boxShadow: hoveredRowId === usuario.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                          }}
                        >
                          <TableCell className="font-medium">{usuario.cedula}</TableCell>
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
                          <TableCell>
                            <select 
                              value={usuario.tipificacion || ''} 
                              onChange={(e) => handleTipificacion(
                                usuario, 
                                e.target.value as Usuario['tipificacion']
                              )}
                              className="p-2 text-sm rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                            >
                              <option value="">Sin tipificar</option>
                              <option value="Interesado">Interesado</option>
                              <option value="No interesado">No interesado</option>
                              <option value="Localizado">Localizado</option>
                            </select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleOpenDialog(usuario, 'contactar')}
                                className={`${getActionButtonStyles} ${getButtonColor('contactar')}`}
                                title="Gestión de contacto"
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Contactar</span>
                              </button>
                              <button 
                                onClick={() => handleOpenDialog(usuario, 'agendar')}
                                className={`${getActionButtonStyles} ${getButtonColor('agendar')}`}
                                title="Agendar visita"
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Agendar</span>
                              </button>
                              <button 
                                onClick={() => handleOpenDialog(usuario, 'radicar')}
                                className={`${getActionButtonStyles} ${getButtonColor('radicar')}`}
                                title="Radicar crédito"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Radicar</span>
                              </button>
                              <button 
                                onClick={() => handleOpenDialog(usuario, 'cerrar')}
                                className={`${getActionButtonStyles} ${getButtonColor('cerrar')}`}
                                title="Cerrar cliente"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Cerrar</span>
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmAction}
              variant="default" 
              className={getButtonColor(dialogAction)}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsuariosPage;

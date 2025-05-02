
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usuarioController } from '@/controllers/usuarioController';
import { Usuario } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Phone, DollarSign, CreditCard } from 'lucide-react';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
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

  const handleGestionContacto = (usuario: Usuario) => {
    toast({
      title: 'Gestión de Contacto',
      description: `Iniciando gestión para ${usuario.nombre}`,
    });
  };

  const handleRadicacionVenta = (usuario: Usuario) => {
    toast({
      title: 'Radicación de Venta',
      description: `Iniciando radicación para ${usuario.nombre}`,
    });
  };

  const handleFormalizacionCredito = (usuario: Usuario) => {
    toast({
      title: 'Formalización de Crédito',
      description: `Iniciando formalización para ${usuario.nombre}`,
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

  return (
    <div className="animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestión de Ventas de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por nombre o cédula..."
                value={busqueda}
                onChange={handleBusqueda}
                className="pl-10 bg-background border-input"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" x2="16.65" y1="21" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Cédula</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha Nac.</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Asignación</TableHead>
                    <TableHead>Tipificación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cargando ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Cargando usuarios...
                      </TableCell>
                    </TableRow>
                  ) : usuarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  ) : (
                    usuarios.map((usuario) => (
                      <TableRow key={usuario.id} className="hover-scale">
                        <TableCell className="font-medium">{usuario.cedula}</TableCell>
                        <TableCell>{usuario.nombre}</TableCell>
                        <TableCell>{new Date(usuario.fechaNacimiento).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs ${
                              usuario.estado === 'Activo' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
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
                            className="p-1 text-sm rounded border border-gray-300"
                          >
                            <option value="">Sin tipificar</option>
                            <option value="Interesado">Interesado</option>
                            <option value="No interesado">No interesado</option>
                            <option value="Localizado">Localizado</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleGestionContacto(usuario)}
                              title="Gestión de contacto"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleRadicacionVenta(usuario)}
                              title="Radicación de venta"
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleFormalizacionCredito(usuario)}
                              title="Formalización de crédito"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuariosPage;

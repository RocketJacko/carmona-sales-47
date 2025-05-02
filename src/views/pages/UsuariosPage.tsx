
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usuarioController } from '@/controllers/usuarioController';
import { Usuario } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Search, ArrowRight, Check } from 'lucide-react';

// Interfaces para el manejo de contactos
interface ContactoInfo {
  id: number;
  pagaduria: string;
  movil: string;
  tipificacion: 'no contesta' | 'equivocado' | 'fuera de servicio' | 'contactado';
}

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const { toast } = useToast();

  // Estados para la gestión de contacto
  const [usuarioEnGestion, setUsuarioEnGestion] = useState<number | null>(null);
  const [contactosInfo, setContactosInfo] = useState<Record<number, ContactoInfo[]>>({});
  const [indiceContactoActual, setIndiceContactoActual] = useState<Record<number, number>>({});

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await usuarioController.obtenerUsuarios();
        setUsuarios(data);

        // Inicializar la información de contacto para cada usuario
        const contactosIniciales: Record<number, ContactoInfo[]> = {};
        const indicesIniciales: Record<number, number> = {};
        
        data.forEach(usuario => {
          contactosIniciales[usuario.id] = [
            {
              id: 1,
              pagaduria: 'Empresa ABC',
              movil: '300' + Math.floor(1000000 + Math.random() * 9000000),
              tipificacion: 'no contesta',
            },
            {
              id: 2,
              pagaduria: 'Empresa XYZ',
              movil: '310' + Math.floor(1000000 + Math.random() * 9000000),
              tipificacion: 'no contesta',
            },
            {
              id: 3,
              pagaduria: 'Empresa DEF',
              movil: '320' + Math.floor(1000000 + Math.random() * 9000000),
              tipificacion: 'no contesta',
            }
          ];
          indicesIniciales[usuario.id] = 0; // Comenzamos con el primer número
        });
        
        setContactosInfo(contactosIniciales);
        setIndiceContactoActual(indicesIniciales);
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

  const handleTipificacionChange = (usuarioId: number, nuevaTipificacion: ContactoInfo['tipificacion']) => {
    setContactosInfo(prevContactos => {
      const nuevosContactos = { ...prevContactos };
      const indiceActual = indiceContactoActual[usuarioId];
      
      if (nuevosContactos[usuarioId]) {
        // Actualizamos la tipificación del contacto actual
        nuevosContactos[usuarioId] = nuevosContactos[usuarioId].map((contacto, idx) => {
          if (idx === indiceActual) {
            return { 
              ...contacto, 
              tipificacion: nuevaTipificacion
            };
          }
          return contacto;
        });
      }
      
      return nuevosContactos;
    });

    // Si la tipificación es "no contesta" o "equivocado", pasamos al siguiente número automáticamente
    if (nuevaTipificacion === 'no contesta' || nuevaTipificacion === 'equivocado') {
      const contactosUsuario = contactosInfo[usuarioId] || [];
      const indiceActual = indiceContactoActual[usuarioId];
      
      // Si hay más números disponibles, avanzamos al siguiente
      if (indiceActual < contactosUsuario.length - 1) {
        setIndiceContactoActual(prevIndices => ({
          ...prevIndices,
          [usuarioId]: indiceActual + 1
        }));
        
        toast({
          title: 'Número Actualizado',
          description: `Se ha cambiado al siguiente número de contacto`,
          duration: 2000,
        });
      }
    }

    toast({
      title: 'Tipificación Actualizada',
      description: `La tipificación ha sido actualizada a ${nuevaTipificacion}`,
      duration: 2000,
    });
  };

  const handleSimularCredito = (usuarioId: number) => {
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

  const obtenerContactoActual = (usuarioId: number) => {
    const contactos = contactosInfo[usuarioId] || [];
    const indice = indiceContactoActual[usuarioId] || 0;
    return contactos[indice] || null;
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
                        <TableRow 
                          key={usuario.id}
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Sección de Contacto (visible solo cuando se inicia la gestión y fuera de la tabla) */}
          {usuarioEnGestion !== null && (
            <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50 animate-fade-down">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">
                Información de Contacto - {usuarios.find(u => u.id === usuarioEnGestion)?.nombre}
              </h3>
              
              {(() => {
                const contactoActual = obtenerContactoActual(usuarioEnGestion);
                
                if (!contactoActual) {
                  return <div className="text-center py-4">No hay información de contacto disponible</div>;
                }
                
                return (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Pagaduría</label>
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                          {contactoActual.pagaduria}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Número de Contacto</label>
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 font-medium">
                          {contactoActual.movil}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Tipificación</label>
                        <select 
                          value={contactoActual.tipificacion}
                          onChange={(e) => handleTipificacionChange(
                            usuarioEnGestion, 
                            e.target.value as ContactoInfo['tipificacion']
                          )}
                          className="w-full p-3 text-sm rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                        >
                          <option value="no contesta">No contesta</option>
                          <option value="equivocado">Equivocado</option>
                          <option value="fuera de servicio">Fuera de servicio</option>
                          <option value="contactado">Contactado</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          onClick={() => handleSimularCredito(usuarioEnGestion)}
                          disabled={contactoActual.tipificacion !== 'contactado'}
                          className={`bg-[#F97316] hover:bg-orange-600 text-white w-full transition-all duration-300 transform hover:scale-105 ${contactoActual.tipificacion !== 'contactado' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Simular Crédito
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        {indiceContactoActual[usuarioEnGestion] < (contactosInfo[usuarioEnGestion]?.length - 1) ? (
                          <span>Hay {contactosInfo[usuarioEnGestion]?.length - indiceContactoActual[usuarioEnGestion] - 1} número(s) adicional(es) disponible(s)</span>
                        ) : (
                          <span>Este es el último número de contacto disponible</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuariosPage;

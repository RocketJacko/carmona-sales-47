import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Phone, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEstadoStore } from '@/services/estado.service';

// This will contain clients who are scheduled for second contact
interface ClienteAgendamiento {
  id: number;
  numeroDocumento: string;
  nombre: string;
  pagaduria: string;
  fechaAgendada: Date;
  observaciones: string;
  notas: string;
  estado: string;
}

const AgendamientosPage: React.FC = () => {
  const [clientesAgendados, setClientesAgendados] = useState<ClienteAgendamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const { toast } = useToast();
  const { clienteSeleccionado } = useEstadoStore();

  useEffect(() => {
    if (clienteSeleccionado && clienteSeleccionado.estado === 'agendado') {
      setClientesAgendados(prev => {
        const existe = prev.some(cliente => cliente.id === clienteSeleccionado.id);
        if (!existe) {
          return [...prev, {
            id: clienteSeleccionado.id,
            numeroDocumento: clienteSeleccionado.numeroDocumento,
            nombre: clienteSeleccionado.nombre,
            pagaduria: clienteSeleccionado.pagaduria,
            fechaAgendada: clienteSeleccionado.fechaAgendada!,
            observaciones: clienteSeleccionado.observaciones!,
            notas: clienteSeleccionado.notas!,
            estado: 'Pendiente'
          }];
        }
        return prev;
      });
    }
    setCargando(false);
  }, [clienteSeleccionado]);

  const formatFecha = (fecha: Date) => {
    return format(fecha, "PPP 'a las' p", { locale: es });
  };

  const handleVerDetalles = (id: number) => {
    const cliente = clientesAgendados.find(c => c.id === id);
    if (cliente) {
      toast({
        title: "Detalles del Agendamiento",
        description: (
          <div className="mt-2">
            <p><strong>Cliente:</strong> {cliente.nombre}</p>
            <p><strong>Documento:</strong> {cliente.numeroDocumento}</p>
            <p><strong>Pagaduría:</strong> {cliente.pagaduria}</p>
            <p><strong>Fecha:</strong> {formatFecha(cliente.fechaAgendada)}</p>
            <p><strong>Observaciones:</strong> {cliente.observaciones}</p>
            <p><strong>Notas:</strong> {cliente.notas}</p>
          </div>
        ),
      });
    }
  };

  const handleContactar = (id: number) => {
    toast({
      title: "Contactar cliente",
      description: `Iniciando contacto con el cliente ID: ${id}`,
    });
  };

  return (
    <div className="animate-fade-in">
      <Card className="shadow-lg border-none rounded-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-2xl font-bold text-gray-800">Agendamientos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {cargando ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-3 text-lg text-gray-600">Cargando agendamientos...</span>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-bold">Documento</TableHead>
                      <TableHead className="font-bold">Nombre</TableHead>
                      <TableHead className="font-bold">Pagaduría</TableHead>
                      <TableHead className="font-bold">Fecha Agendada</TableHead>
                      <TableHead className="font-bold">Estado</TableHead>
                      <TableHead className="text-right font-bold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesAgendados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                          No se encontraron agendamientos
                        </TableCell>
                      </TableRow>
                    ) : (
                      clientesAgendados.map((cliente) => (
                        <TableRow 
                          key={cliente.id}
                          className="transition-all duration-300 hover:bg-gray-50"
                          onMouseEnter={() => setHoveredRowId(cliente.id)}
                          onMouseLeave={() => setHoveredRowId(null)}
                          style={{
                            transform: hoveredRowId === cliente.id ? 'scale(1.01)' : 'scale(1)',
                            boxShadow: hoveredRowId === cliente.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                          }}
                        >
                          <TableCell>{cliente.numeroDocumento}</TableCell>
                          <TableCell className="font-medium">{cliente.nombre}</TableCell>
                          <TableCell>{cliente.pagaduria}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              {formatFecha(cliente.fechaAgendada)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-100 text-yellow-800 border-yellow-200">
                              {cliente.estado}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                onClick={() => handleVerDetalles(cliente.id)}
                                variant="outline"
                                size="sm"
                                className="bg-white hover:bg-gray-50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Detalles
                              </Button>
                              <Button 
                                onClick={() => handleContactar(cliente.id)}
                                className="bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800"
                                size="sm"
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Contactar
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendamientosPage;

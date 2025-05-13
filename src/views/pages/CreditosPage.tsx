import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, FileText } from 'lucide-react';
import { useEstadoStore } from '@/services/estado.service';

// This will contain clients who accepted credit offers
interface ClienteCredito {
  id: number;
  numeroDocumento: string;
  nombre: string;
  pagaduria: string;
  montoOfertado: number;
  estado: string;
  tipificacion: string;
  observaciones?: string;
}

const CreditosPage: React.FC = () => {
  const [clientesCredito, setClientesCredito] = useState<ClienteCredito[]>([]);
  const [cargando, setCargando] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const { toast } = useToast();
  const { clienteSeleccionado } = useEstadoStore();

  useEffect(() => {
    if (clienteSeleccionado && clienteSeleccionado.estado === 'en_proceso') {
      setClientesCredito(prev => {
        const existe = prev.some(cliente => cliente.id === clienteSeleccionado.id);
        if (!existe) {
          return [...prev, {
            id: clienteSeleccionado.id,
            numeroDocumento: clienteSeleccionado.numeroDocumento,
            nombre: clienteSeleccionado.nombre,
            pagaduria: clienteSeleccionado.pagaduria,
            montoOfertado: 0, // Este valor debería venir del simulador
            estado: 'En Radicación',
            tipificacion: clienteSeleccionado.tipificacion,
            observaciones: clienteSeleccionado.observaciones
          }];
        }
        return prev;
      });
    }
    setCargando(false);
  }, [clienteSeleccionado]);

  // Format currency to Colombian pesos
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleVerDetalles = (id: number) => {
    const cliente = clientesCredito.find(c => c.id === id);
    if (cliente) {
      toast({
        title: "Detalles del Crédito",
        description: (
          <div className="mt-2">
            <p><strong>Cliente:</strong> {cliente.nombre}</p>
            <p><strong>Documento:</strong> {cliente.numeroDocumento}</p>
            <p><strong>Pagaduría:</strong> {cliente.pagaduria}</p>
            <p><strong>Monto Ofertado:</strong> {formatCurrency(cliente.montoOfertado)}</p>
            <p><strong>Estado:</strong> {cliente.estado}</p>
            <p><strong>Tipificación:</strong> {cliente.tipificacion}</p>
            {cliente.observaciones && (
              <p><strong>Observaciones:</strong> {cliente.observaciones}</p>
            )}
          </div>
        ),
      });
    }
  };

  const handleSubsanar = (id: number) => {
    toast({
      title: "Subsanar",
      description: `Iniciando subsanación para cliente con ID: ${id}`,
    });
  };

  // Get status badge color - maintain consistency with existing styles
  const getStatusBadgeColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aprobado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en radicación':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="shadow-lg border-none rounded-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-2xl font-bold text-gray-800">Créditos en Proceso</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {cargando ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-3 text-lg text-gray-600">Cargando créditos...</span>
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
                      <TableHead className="font-bold">Monto Ofertado</TableHead>
                      <TableHead className="font-bold">Estado</TableHead>
                      <TableHead className="text-right font-bold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesCredito.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                          No se encontraron créditos en proceso
                        </TableCell>
                      </TableRow>
                    ) : (
                      clientesCredito.map((cliente) => (
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
                          <TableCell>{formatCurrency(cliente.montoOfertado)}</TableCell>
                          <TableCell>
                            <span 
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                getStatusBadgeColor(cliente.estado)
                              }`}
                            >
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
                                Ver
                              </Button>
                              <Button 
                                onClick={() => handleSubsanar(cliente.id)}
                                className="bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800"
                                size="sm"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Subsanar
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

export default CreditosPage;

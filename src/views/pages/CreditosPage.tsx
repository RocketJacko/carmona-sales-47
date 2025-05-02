
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, FileText } from 'lucide-react';

// This will contain clients who accepted credit offers
interface ClienteCredito {
  id: number;
  numeroDocumento: string;
  nombre: string;
  pagaduria: string;
  montoOfertado: number;
  estado: string;
}

const CreditosPage: React.FC = () => {
  const [clientesCredito, setClientesCredito] = useState<ClienteCredito[]>([]);
  const [cargando, setCargando] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const { toast } = useToast();

  // Simulate loading data from a controller or service
  useEffect(() => {
    // In a real app, this would be an API call
    const cargarClientesCredito = () => {
      // Simulate loading delay
      setTimeout(() => {
        // Sample data - in a real implementation this would come from a database or service
        const datosEjemplo: ClienteCredito[] = [
          {
            id: 1,
            numeroDocumento: "1098765432",
            nombre: "Ana María Gómez",
            pagaduria: "Empresa ABC",
            montoOfertado: 5000000,
            estado: "En Radicación",
          },
          {
            id: 2,
            numeroDocumento: "1076543210",
            nombre: "Carlos Rodríguez",
            pagaduria: "Empresa XYZ",
            montoOfertado: 3500000,
            estado: "Aprobado",
          }
        ];
        
        setClientesCredito(datosEjemplo);
        setCargando(false);
      }, 800);
    };

    cargarClientesCredito();
  }, []);

  // Format currency to Colombian pesos
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleVerDetalles = (id: number) => {
    toast({
      title: "Ver detalles",
      description: `Viendo detalles del cliente con ID: ${id}`,
    });
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
        <CardContent className="pt-6">
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

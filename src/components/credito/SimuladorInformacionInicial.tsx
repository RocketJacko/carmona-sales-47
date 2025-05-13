import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface ConceptoSupabase {
  CONCEPTO: string;
  INGRESOS: string;
  DESCUENTOS: string;
}

interface SimuladorInformacionInicialProps {
  entidadOfertada: string;
  monto: string;
  conceptosEjemplo: ConceptoSupabase[];
  onEntidadOfertadaChange: (value: string) => void;
  onMontoChange: (value: string) => void;
  onContinuar: () => void;
  onClose: () => void;
  continuarHabilitado: boolean;
}

const SimuladorInformacionInicial: React.FC<SimuladorInformacionInicialProps> = ({
  entidadOfertada,
  monto,
  conceptosEjemplo,
  onEntidadOfertadaChange,
  onMontoChange,
  onContinuar,
  onClose,
  continuarHabilitado,
}) => {
  // Formateador de moneda colombiana
  const formatCurrency = (value: string) => {
    if (!value) return '$0';
    // Si ya viene formateado, lo retorna igual
    if (value.includes('$')) return value;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Number(value));
  };

  console.log('📋 Conceptos a renderizar en SimuladorInformacionInicial:', conceptosEjemplo);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Entidad Ofertada</label>
          <Input 
            type="text" 
            value={entidadOfertada}
            onChange={(e) => onEntidadOfertadaChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Monto</label>
          <Input 
            type="number" 
            value={monto}
            onChange={(e) => onMontoChange(e.target.value)}
          />
        </div>
      </div>
      <h4 className="font-medium text-gray-700 mb-2">Conceptos</h4>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Ingresos</TableHead>
              <TableHead>Descuentos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conceptosEjemplo.map((concepto, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{concepto.CONCEPTO}</TableCell>
                <TableCell>{formatCurrency(concepto.INGRESOS)}</TableCell>
                <TableCell>{formatCurrency(concepto.DESCUENTOS)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={onClose}>Guardar</Button>
        <Button 
          onClick={onContinuar} 
          disabled={!continuarHabilitado}
          className="bg-[#A5BECC] hover:bg-[#8EACBB] text-gray-800"
        >
          Continuar <ArrowRight className="ml-1 w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default SimuladorInformacionInicial;

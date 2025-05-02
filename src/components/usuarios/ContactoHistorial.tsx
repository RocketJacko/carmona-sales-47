
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HistorialContacto } from './ContactoGestion';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ContactoHistorialProps {
  usuarioId: number;
  historialContactos: HistorialContacto[];
}

const ContactoHistorial: React.FC<ContactoHistorialProps> = ({ 
  usuarioId, 
  historialContactos 
}) => {
  
  const getTipificacionBadge = (tipificacion: string) => {
    switch(tipificacion) {
      case 'contactado':
        return <Badge variant="default" className="bg-green-500">Contactado</Badge>;
      case 'no contesta':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">No contesta</Badge>;
      case 'equivocado':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Equivocado</Badge>;
      case 'fuera de servicio':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Fuera de servicio</Badge>;
      default:
        return <Badge variant="outline">{tipificacion}</Badge>;
    }
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (historialContactos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Clock className="h-12 w-12 mb-3 text-gray-400" />
        <p className="text-lg">No hay registros de contacto previos</p>
        <p className="text-sm mt-2">El historial se actualiza cuando se realizan tipificaciones</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <h4 className="text-md font-medium text-gray-700 mb-4">
        Historial de contactos realizados
      </h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Fecha</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Tipificación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historialContactos.map((registro, index) => (
            <TableRow key={`${registro.id}-${index}`}>
              <TableCell className="font-medium whitespace-nowrap">
                {formatearFecha(registro.fecha)}
              </TableCell>
              <TableCell>{registro.movil}</TableCell>
              <TableCell>{getTipificacionBadge(registro.tipificacion)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactoHistorial;

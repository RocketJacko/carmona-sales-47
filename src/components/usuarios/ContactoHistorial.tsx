
import React from 'react';
import { HistorialContacto } from './interfaces/ContactoInterfaces';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Phone } from 'lucide-react';

interface ContactoHistorialProps {
  usuarioId: number | null;
  historialContactos: HistorialContacto[];
}

const ContactoHistorial: React.FC<ContactoHistorialProps> = ({
  usuarioId,
  historialContactos
}) => {
  if (!usuarioId) return null;

  // Get status badge color
  const getTipificacionColor = (tipificacion: HistorialContacto['tipificacion']) => {
    switch (tipificacion) {
      case 'contactado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'no contesta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'equivocado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'fuera de servicio':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (historialContactos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay historial de contactos registrado
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Historial de contactos</h4>
      
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipificación
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historialContactos.map(contacto => (
              <tr key={contacto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(contacto.fecha, "dd MMM yyyy, HH:mm", { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {contacto.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Badge variant="outline" className="capitalize">
                    {contacto.tipo}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`${getTipificacionColor(contacto.tipificacion)} px-2 py-1`}>
                    {contacto.tipificacion}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactoHistorial;

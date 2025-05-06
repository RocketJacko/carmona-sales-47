
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ContactoInfo } from '../interfaces/ContactoInterfaces';

interface TipificacionBadgeProps {
  tipificacion: ContactoInfo['tipificacion'];
  indiceActual: number;
  totalContactos: number;
}

const TipificacionBadge: React.FC<TipificacionBadgeProps> = ({
  tipificacion,
  indiceActual,
  totalContactos
}) => {
  // Obtiene el color para el badge de tipificación
  const getTipificacionColor = (tipificacion: ContactoInfo['tipificacion']) => {
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

  return (
    <div className="mt-4 text-sm text-gray-600">
      <div className="flex items-center space-x-2">
        <Badge className={`${getTipificacionColor(tipificacion)} px-2 py-1`}>
          {tipificacion}
        </Badge>
        
        <span>
          {indiceActual < (totalContactos - 1) ? (
            <span>Hay {totalContactos - indiceActual - 1} número(s) adicional(es) disponible(s)</span>
          ) : (
            <span>Este es el último número de contacto disponible</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default TipificacionBadge;

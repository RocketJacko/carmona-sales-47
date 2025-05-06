
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Progress } from '@/components/ui/progress';
import { ContactoInfo } from '../interfaces/ContactoInterfaces';

interface ProgresoContactoProps {
  indiceActual: number;
  totalContactos: number;
}

const ProgresoContacto: React.FC<ProgresoContactoProps> = ({
  indiceActual,
  totalContactos
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.max(
    0, 
    Math.min(100, (indiceActual / (totalContactos - 1 || 1)) * 100)
  );

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-700">
          Progreso de contacto: {indiceActual + 1} de {totalContactos} números
        </div>
        <Badge 
          variant={indiceActual === totalContactos - 1 ? "destructive" : "secondary"}
          className="px-2 py-1"
        >
          {indiceActual === totalContactos - 1 ? "Último número" : `${totalContactos - indiceActual - 1} restantes`}
        </Badge>
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-2"
        style={{
          backgroundColor: '#E2E8F0',
          '--progress-bar-color': '#9b87f5'
        } as React.CSSProperties}
      />
    </div>
  );
};

export default ProgresoContacto;


import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface SimuladorContactoProps {
  nombreUsuario?: string;
  resultadosCalculados: {
    capacidadLibreInversion: number;
    capacidadCompraCartera: number;
    fullCapacidad: number;
  } | null;
  onContactar: () => void;
}

const SimuladorContacto: React.FC<SimuladorContactoProps> = ({ 
  nombreUsuario, 
  resultadosCalculados,
  onContactar
}) => {
  // Formateador de moneda colombiana
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (!resultadosCalculados) {
    return null;
  }

  return (
    <>
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-blue-800 mb-3">Cliente: {nombreUsuario || 'Cliente seleccionado'}</h4>
        
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Propuestas disponibles:</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <h6 className="text-xs font-medium text-gray-500">Libre Inversión</h6>
              <p className="text-lg font-bold">{formatCurrency(resultadosCalculados.capacidadLibreInversion)}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h6 className="text-xs font-medium text-gray-500">Compra de Cartera</h6>
              <p className="text-lg font-bold">{formatCurrency(resultadosCalculados.capacidadCompraCartera)}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h6 className="text-xs font-medium text-gray-500">Full Capacidad</h6>
              <p className="text-lg font-bold">{formatCurrency(resultadosCalculados.fullCapacidad)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-4 text-gray-700">Contacto</h4>
        
        <div>
          <div className="text-center py-12">
            <div className="flex flex-col items-center justify-center">
              <Check className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">Simulación completada exitosamente</p>
              <p className="text-gray-500 mt-2">
                Ahora puede proceder al contacto del cliente
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={onContactar} 
              className="bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800"
            >
              Iniciar Contacto <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimuladorContacto;

import React, { useRef } from 'react';

interface SimuladorCalculadoraProps {
  nombreUsuario?: string;
  onResultadosCalculados: (resultados: any) => void;
  onContactar: () => void;
}

const SimuladorCalculadora: React.FC<SimuladorCalculadoraProps> = ({ 
  nombreUsuario,
  onResultadosCalculados,
  onContactar
}) => {
  const refCalculadora = useRef<HTMLDivElement>(null);

  return (
    <div ref={refCalculadora} tabIndex={-1} className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Calculadora de Crédito</h3>
        {nombreUsuario && (
          <span className="text-sm text-gray-600">Cliente: {nombreUsuario}</span>
        )}
      </div>
      
      {/* ... rest of the component ... */}
    </div>
  );
};

export default SimuladorCalculadora; 
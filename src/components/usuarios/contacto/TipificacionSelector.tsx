
import React from 'react';
import { ContactoInfo } from '../interfaces/ContactoInterfaces';

interface TipificacionSelectorProps {
  tipificacion: ContactoInfo['tipificacion'];
  onTipificacionChange: (nuevaTipificacion: ContactoInfo['tipificacion']) => void;
}

const TipificacionSelector: React.FC<TipificacionSelectorProps> = ({
  tipificacion,
  onTipificacionChange
}) => {
  return (
    <div className="md:col-span-3">
      <label className="block text-sm font-medium text-gray-600 mb-1">Tipificación</label>
      <select 
        value={tipificacion}
        onChange={(e) => onTipificacionChange(e.target.value as ContactoInfo['tipificacion'])}
        className="w-full p-3 text-sm rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
      >
        <option value="contactado">Contactado</option>
        <option value="no contesta">No contesta</option>
        <option value="equivocado">Equivocado</option>
        <option value="fuera de servicio">Fuera de servicio</option>
      </select>
    </div>
  );
};

export default TipificacionSelector;

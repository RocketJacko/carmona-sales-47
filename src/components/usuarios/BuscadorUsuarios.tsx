
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BuscadorUsuariosProps {
  busqueda: string;
  onBusquedaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BuscadorUsuarios: React.FC<BuscadorUsuariosProps> = ({ busqueda, onBusquedaChange }) => {
  return (
    <div className="mb-6 relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={onBusquedaChange}
          className="pl-10 border-gray-300 rounded-lg h-12 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default BuscadorUsuarios;

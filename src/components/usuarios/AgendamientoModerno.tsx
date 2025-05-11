import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const AgendamientoModerno: React.FC = () => {
  const [fecha, setFecha] = useState<Date | null>(null);
  const [comentario, setComentario] = useState('');

  const handleGuardar = () => {
    // Aquí iría la lógica para guardar el agendamiento
    alert(`Agendado para: ${fecha?.toLocaleString() || 'Sin fecha'}\nComentario: ${comentario}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto mt-8 border-t-4 border-blue-200 animate-fade-in">
      <div className="flex items-center mb-6">
        <Calendar className="text-blue-500 mr-3" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Agendar Segundo Contacto</h2>
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-2">Fecha y hora</label>
        <input
          type="datetime-local"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none"
          value={fecha ? fecha.toISOString().slice(0, 16) : ''}
          onChange={e => setFecha(e.target.value ? new Date(e.target.value) : null)}
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-2">Comentario</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-2 min-h-[80px] focus:border-blue-400 focus:outline-none"
          placeholder="Agrega un comentario para el seguimiento..."
          value={comentario}
          onChange={e => setComentario(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          onClick={handleGuardar}
        >
          Guardar Agendamiento
        </Button>
      </div>
    </div>
  );
};

export default AgendamientoModerno; 
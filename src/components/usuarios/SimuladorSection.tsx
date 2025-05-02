
import React from 'react';
import SimuladorCredito from '@/components/credito/SimuladorCredito';
import { Usuario } from '@/models';

interface SimuladorSectionProps {
  usuarioId: number | null;
  usuarios: Usuario[];
  onClose: () => void;
  onContactar: () => void;
}

const SimuladorSection: React.FC<SimuladorSectionProps> = ({
  usuarioId,
  usuarios,
  onClose,
  onContactar
}) => {
  if (!usuarioId) return null;
  
  const usuario = usuarios.find(u => u.id === usuarioId);
  
  return (
    <div className="mt-10">
      <SimuladorCredito
        usuarioId={usuarioId}
        nombreUsuario={usuario?.nombre}
        onClose={onClose}
        onContactar={onContactar}
      />
    </div>
  );
};

export default SimuladorSection;

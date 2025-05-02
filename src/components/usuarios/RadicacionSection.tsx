
import React from 'react';
import RadicacionForm from '@/components/credito/RadicacionForm';
import { Usuario } from '@/models';

interface RadicacionSectionProps {
  usuarioId: number | null;
  usuarios: Usuario[];
  onClose: () => void;
}

const RadicacionSection: React.FC<RadicacionSectionProps> = ({
  usuarioId,
  usuarios,
  onClose
}) => {
  if (!usuarioId) return null;
  
  const usuario = usuarios.find(u => u.id === usuarioId);
  
  return (
    <div className="mt-10">
      <RadicacionForm
        usuarioId={usuarioId}
        nombreUsuario={usuario?.nombre}
        onClose={onClose}
      />
    </div>
  );
};

export default RadicacionSection;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BuscadorUsuarios from '@/components/usuarios/BuscadorUsuarios';
import UsuariosTable from '@/components/usuarios/UsuariosTable';

interface UsuariosCardProps {
  busqueda: string;
  cargando: boolean;
  usuarios: any[];
  hoveredRowId: number | null;
  usuarioEnGestion: number | null;
  onBusquedaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHoverChange: (id: number | null) => void;
  onIniciarGestion: (id: number) => void;
}

const UsuariosCard: React.FC<UsuariosCardProps> = ({
  busqueda,
  cargando,
  usuarios,
  hoveredRowId,
  usuarioEnGestion,
  onBusquedaChange,
  onHoverChange,
  onIniciarGestion
}) => {
  return (
    <Card className="shadow-lg border-none rounded-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-2xl font-bold text-gray-800">Gestión de Clientes</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Search component */}
        <BuscadorUsuarios 
          busqueda={busqueda}
          onBusquedaChange={onBusquedaChange}
        />

        {/* Users table component */}
        <UsuariosTable 
          usuarios={usuarios}
          cargando={cargando}
          hoveredRowId={hoveredRowId}
          usuarioEnGestion={usuarioEnGestion}
          onHoverChange={onHoverChange}
          onIniciarGestion={onIniciarGestion}
        />
      </CardContent>
    </Card>
  );
};

export default UsuariosCard;

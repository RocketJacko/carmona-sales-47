
import React from 'react';
import { Usuario } from '@/models';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';

interface UsuariosTableProps {
  usuarios: Usuario[];
  cargando: boolean;
  hoveredRowId: number | null;
  usuarioEnGestion: number | null;
  onHoverChange: (id: number | null) => void;
  onIniciarGestion: (id: number) => void;
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({
  usuarios,
  cargando,
  hoveredRowId,
  usuarioEnGestion,
  onHoverChange,
  onIniciarGestion
}) => {
  const getStatusBadgeColor = (estado: string) => {
    return estado === 'Activo'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-3 text-lg text-gray-600">Cargando clientes...</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold">Nombre</TableHead>
              <TableHead className="font-bold">Fecha Nac.</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="font-bold">Asignación</TableHead>
              <TableHead className="text-right font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  No se encontraron clientes con los criterios de búsqueda
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow 
                  key={usuario.id}
                  className={`transition-all duration-300 hover:bg-gray-50 ${usuarioEnGestion === usuario.id ? 'bg-blue-50' : ''}`}
                  onMouseEnter={() => onHoverChange(usuario.id)}
                  onMouseLeave={() => onHoverChange(null)}
                  style={{
                    transform: hoveredRowId === usuario.id ? 'scale(1.01)' : 'scale(1)',
                    boxShadow: hoveredRowId === usuario.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  <TableCell className="font-medium">{usuario.nombre}</TableCell>
                  <TableCell>{new Date(usuario.fechaNacimiento).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        getStatusBadgeColor(usuario.estado)
                      }`}
                    >
                      {usuario.estado}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(usuario.fechaAsignacion).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      onClick={() => onIniciarGestion(usuario.id)}
                      className={`bg-[#9b87f5] hover:bg-[#8a76e4] text-white transition-all duration-300 transform hover:scale-105`}
                    >
                      {usuarioEnGestion === usuario.id ? 'Cerrar Gestión' : 'Iniciar Gestión'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsuariosTable;

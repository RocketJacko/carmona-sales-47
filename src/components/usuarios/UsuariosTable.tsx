import React from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Phone } from 'lucide-react';
import { Usuario } from '@/models/usuario';

interface UsuariosTableProps {
  usuarios: Usuario[];
  cargando: boolean;
  usuarioEnGestion: string | null;
  onIniciarGestion: (usuarioId: string) => void;
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({
  usuarios,
  cargando,
  usuarioEnGestion,
  onIniciarGestion
}) => {
  console.log('=== DATOS EN UsuariosTable ===');
  console.log('Estado de carga:', cargando);
  console.log('Array de usuarios recibido:', usuarios);
  console.log('Cantidad de usuarios:', usuarios.length);

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-3 text-lg text-gray-600">Cargando clientes...</span>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No hay clientes asignados
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold">ID Cliente</TableHead>
              <TableHead className="font-bold">Nombres</TableHead>
              <TableHead className="font-bold">Apellidos</TableHead>
              <TableHead className="text-right font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => {
              return (
                <TableRow key={usuario.idcliente}>
                  <TableCell className="font-medium">{usuario.idcliente}</TableCell>
                  <TableCell>{usuario.nombres}</TableCell>
                  <TableCell>{usuario.apellidos}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => onIniciarGestion(usuario.idcliente.toString())}
                      className="bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800"
                      size="sm"
                    >
                      Iniciar gestión
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsuariosTable;

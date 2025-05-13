import React from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Usuario } from '@/models/usuario';

interface UsuariosTableProps {
  usuarios: Usuario[];
  cargando: boolean;
  onIniciarGestion: (id: string) => void;
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({
  usuarios,
  cargando,
  onIniciarGestion
}) => {
  console.log('=== DATOS EN UsuariosTable ===');
  console.log('Estado de carga:', cargando);
  console.log('Array de usuarios recibido:', usuarios);
  console.log('Cantidad de usuarios:', usuarios.length);

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-20">
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
              <TableHead className="font-bold">IdCliente</TableHead>
              <TableHead className="font-bold">Comprobante</TableHead>
              <TableHead className="font-bold">Nombres</TableHead>
              <TableHead className="font-bold">Apellidos</TableHead>
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
              usuarios.map((usuario) => {
                console.log('=== RENDERIZANDO USUARIO ===');
                console.log('Datos del usuario a renderizar:', usuario);
                console.log('IdCliente:', usuario.idcliente);
                console.log('Comprobante:', usuario["COMPROBANTE DE NOMINA No."]);
                console.log('Nombres:', usuario["Nombres docente"]);
                console.log('Apellidos:', usuario["Apellidos docente"]);
                
                return (
                  <TableRow key={usuario.idcliente}>
                    <TableCell className="font-medium">{usuario.idcliente}</TableCell>
                    <TableCell>{usuario["COMPROBANTE DE NOMINA No."]}</TableCell>
                    <TableCell>{usuario["Nombres docente"]}</TableCell>
                    <TableCell>{usuario["Apellidos docente"]}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onIniciarGestion(usuario.idcliente)}
                        className="hover:bg-gray-100"
                      >
                        Iniciar gestión
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsuariosTable;

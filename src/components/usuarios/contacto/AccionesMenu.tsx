
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface AccionesMenuProps {
  onAccionChange: (accion: string) => void;
  mostrar: boolean;
}

const AccionesMenu: React.FC<AccionesMenuProps> = ({
  onAccionChange,
  mostrar
}) => {
  if (!mostrar) return null;
  
  return (
    <div className="md:col-span-2 flex items-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800 w-full transition-all duration-300"
          >
            Acciones <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-[#F5EFE6] text-gray-800"
            onClick={() => onAccionChange('acepta')}
          >
            Acepta
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-[#F5EFE6] text-gray-800"
            onClick={() => onAccionChange('segundo-contacto')}
          >
            Cierra Segundo Contacto
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-[#F5EFE6] text-gray-800"
            onClick={() => onAccionChange('no-acepta')}
          >
            No Acepta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AccionesMenu;

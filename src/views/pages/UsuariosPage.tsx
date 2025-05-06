
import React from 'react';
import { useUsuariosPage } from '@/hooks/useUsuariosPage';
import UsuariosCard from '@/components/usuarios/UsuariosCard';
import SimuladorWorkflow from '@/components/usuarios/SimuladorWorkflow';

const UsuariosPage: React.FC = () => {
  const {
    usuarios,
    busqueda,
    cargando,
    hoveredRowId,
    mostrarSimulador,
    mostrarContacto,
    mostrarRadicacion,
    contactoGestion,
    handleBusqueda,
    setHoveredRowId,
    handleIniciarGestionUsuario,
    handleClickSimularCredito,
    handleCerrarSimulador,
    handleIniciarContacto,
    handleMostrarRadicacion,
    handleCerrarRadicacion,
    handleMigrarACreditos,
    handleMigrarAAgendamientos
  } = useUsuariosPage();

  return (
    <div className="animate-fade-in">
      {/* Main users table card */}
      <UsuariosCard
        busqueda={busqueda}
        cargando={cargando}
        usuarios={usuarios}
        hoveredRowId={hoveredRowId}
        usuarioEnGestion={contactoGestion.usuarioEnGestion}
        onBusquedaChange={handleBusqueda}
        onHoverChange={setHoveredRowId}
        onIniciarGestion={handleIniciarGestionUsuario}
      />

      {/* Simulator workflow section */}
      <SimuladorWorkflow
        mostrarSimulador={mostrarSimulador}
        mostrarContacto={mostrarContacto}
        mostrarRadicacion={mostrarRadicacion}
        usuarioEnGestion={contactoGestion.usuarioEnGestion}
        usuarios={usuarios}
        contactosInfo={contactoGestion.contactosInfo}
        indiceContactoActual={contactoGestion.indiceContactoActual}
        historialContactos={contactoGestion.historialContactos}
        onCerrarSimulador={handleCerrarSimulador}
        onInitiarContacto={handleIniciarContacto}
        onClickSimularCredito={handleClickSimularCredito}
        onTipificacionChange={contactoGestion.handleTipificacionChange}
        onMigrarACreditos={handleMigrarACreditos}
        onMigrarAAgendamientos={handleMigrarAAgendamientos}
        onCerrarRadicacion={handleCerrarRadicacion}
      />
    </div>
  );
};

export default UsuariosPage;

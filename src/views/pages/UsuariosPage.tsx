
import React from 'react';
import { useUsuariosPage } from '@/hooks/useUsuariosPage';
import UsuariosLista from '@/components/usuarios/UsuariosLista';
import SimuladorSection from '@/components/usuarios/SimuladorSection';
import ContactoSection from '@/components/usuarios/ContactoSection';
import RadicacionSection from '@/components/usuarios/RadicacionSection';

const UsuariosPage: React.FC = () => {
  const {
    usuarios,
    busqueda,
    cargando,
    hoveredRowId,
    mostrarSimulador,
    mostrarContacto,
    mostrarRadicacion,
    usuarioEnGestion,
    contactosInfo,
    indiceContactoActual,
    historialContactos,
    setHoveredRowId,
    handleBusqueda,
    handleIniciarGestionUsuario,
    handleClickSimularCredito,
    handleCerrarSimulador,
    handleIniciarContacto,
    handleCerrarRadicacion,
    handleTipificacionChange,
    handleMigrarACreditos,
    handleMigrarAAgendamientos
  } = useUsuariosPage();

  return (
    <div className="animate-fade-in">
      {/* Lista de Usuarios */}
      <UsuariosLista
        usuarios={usuarios}
        busqueda={busqueda}
        cargando={cargando}
        hoveredRowId={hoveredRowId}
        usuarioEnGestion={usuarioEnGestion}
        onBusquedaChange={handleBusqueda}
        onHoverChange={setHoveredRowId}
        onIniciarGestion={handleIniciarGestionUsuario}
      />

      {/* Credit Simulator Section */}
      {mostrarSimulador && (
        <SimuladorSection
          usuarioId={usuarioEnGestion}
          usuarios={usuarios}
          onClose={handleCerrarSimulador}
          onContactar={handleIniciarContacto}
        />
      )}

      {/* Contact Management Section */}
      {mostrarContacto && (
        <ContactoSection
          usuarioId={usuarioEnGestion}
          usuarios={usuarios}
          contactosInfo={contactosInfo}
          indiceContactoActual={indiceContactoActual}
          historialContactos={historialContactos}
          onTipificacionChange={handleTipificacionChange}
          onSimularCredito={handleClickSimularCredito}
          onMigrarACreditos={handleMigrarACreditos}
          onMigrarAAgendamientos={handleMigrarAAgendamientos}
        />
      )}
      
      {/* Radicación Section */}
      {mostrarRadicacion && (
        <RadicacionSection
          usuarioId={usuarioEnGestion}
          usuarios={usuarios}
          onClose={handleCerrarRadicacion}
        />
      )}
    </div>
  );
};

export default UsuariosPage;

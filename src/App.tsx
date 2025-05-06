
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importamos nuestros componentes
import Layout from "./views/components/Layout";
import Home from "./views/pages/Home";
import ProductosPage from "./views/pages/ProductosPage";
import UsuariosPage from "./views/pages/UsuariosPage";
import NotFound from "./views/pages/NotFound";
import LoginPage from "./views/pages/LoginPage";
import PaginaPrincipaCrm from "./views/pages/PaginaPrincipaCrm";

// Pages for new sidebar navigation
import CreditosPage from "./views/pages/CreditosPage";
import AgendamientosPage from "./views/pages/AgendamientosPage";
import SearchPage from "./views/pages/SearchPage";
import SettingsPage from "./views/pages/SettingsPage";
import ProfilePage from "./views/pages/ProfilePage";
import MensajesPage from "./views/pages/MensajesPage";

const queryClient = new QueryClient();

// Función de autenticación real, verificando localStorage
const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Ruta de login independiente */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Ruta para PaginaPrincipaCrm con el menú lateral - Protegida */}
          <Route 
            path="/crm" 
            element={
              <ProtectedRoute>
                <PaginaPrincipaCrm />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="mensajes" element={<MensajesPage />} />
            <Route path="agendamientos" element={<AgendamientosPage />} />
            <Route path="creditos" element={<CreditosPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Ruta principal redirige al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Otras rutas protegidas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

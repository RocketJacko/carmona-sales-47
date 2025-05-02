
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
import AnalyticsPage from "./views/pages/AnalyticsPage";
import SearchPage from "./views/pages/SearchPage";
import SettingsPage from "./views/pages/SettingsPage";
import ProfilePage from "./views/pages/ProfilePage";
import MensajesPage from "./views/pages/MensajesPage";

const queryClient = new QueryClient();

// Modificamos la función de autenticación para facilitar pruebas
// En un entorno de producción, esto debería verificar tokens JWT u otro método seguro
const isAuthenticated = () => {
  // Para pruebas, siempre retornamos true para permitir acceso a las páginas CRM
  // En producción, esto verificaría localStorage.getItem("isAuthenticated") === "true"
  return true; // Permite acceso directo a las páginas CRM sin login
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
          
          {/* Ruta para PaginaPrincipaCrm con el menú lateral */}
          <Route path="/crm" element={<PaginaPrincipaCrm />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="mensajes" element={<MensajesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Otras rutas protegidas sin el menú lateral */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/crm" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

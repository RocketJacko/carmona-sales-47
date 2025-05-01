
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos nuestros componentes
import Layout from "./views/components/Layout";
import Home from "./views/pages/Home";
import ProductosPage from "./views/pages/ProductosPage";
import UsuariosPage from "./views/pages/UsuariosPage";
import NotFound from "./views/pages/NotFound";

// Pages for new sidebar navigation
import AnalyticsPage from "./views/pages/AnalyticsPage";
import SearchPage from "./views/pages/SearchPage";
import SettingsPage from "./views/pages/SettingsPage";
import ProfilePage from "./views/pages/ProfilePage";
import MensajesPage from "./views/pages/MensajesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="mensajes" element={<MensajesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

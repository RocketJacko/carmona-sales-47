
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bienvenido a la Aplicación MVC con React</h1>
      
      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Arquitectura MVC</h2>
        <p className="mb-4">
          Esta aplicación está construida siguiendo el patrón Modelo-Vista-Controlador (MVC) adaptado para React:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Modelo:</strong> Define la estructura de los datos y la lógica de negocio.</li>
          <li><strong>Vista:</strong> Componentes de React que renderizan la interfaz de usuario.</li>
          <li><strong>Controlador:</strong> Maneja las interacciones del usuario y actualiza el modelo y la vista.</li>
        </ul>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Sección de Productos</h2>
          <p className="mb-4">Explora nuestra lista de productos disponibles.</p>
          <a href="/productos" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 inline-block">
            Ver Productos
          </a>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Sección de Usuarios</h2>
          <p className="mb-4">Gestiona los usuarios del sistema.</p>
          <a href="/usuarios" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 inline-block">
            Ver Usuarios
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;

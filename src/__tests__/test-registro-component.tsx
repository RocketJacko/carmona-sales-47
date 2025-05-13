import React from 'react';
import { Test } from './utils/Test';

// Componente de Registro
const RegisterComponent: React.FC<{ verificarCorreoAutorizado: (email: string) => Promise<boolean> }> = ({ 
  verificarCorreoAutorizado 
}) => {
  const [formData, setFormData] = React.useState({
    usuario: '',
    email: '',
    clave: ''
  });
  const [mensaje, setMensaje] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const test = Test.getInstance();
    
    try {
      const resultado = await test.registrarUsuario(
        formData.usuario,
        formData.email,
        formData.clave
      );
      
      setMensaje(resultado.message);
    } catch (error) {
      setMensaje('Error al procesar el registro: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={formData.usuario}
            onChange={(e) => setFormData({...formData, usuario: e.target.value})}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={formData.clave}
            onChange={(e) => setFormData({...formData, clave: e.target.value})}
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

// Componente principal de la aplicación
const App = () => {
  const verificarCorreoAutorizado = async (email: string) => {
    try {
      console.log(`Verificando si el correo ${email} está autorizado...`);
      const test = Test.getInstance();
      const resultado = await test.validarEmail(email);
      console.log(`Resultado de verificación de correo: ${resultado}`);
      return resultado;
    } catch (error) {
      console.error('Error al verificar correo autorizado:', error);
      return false;
    }
  };

  return (
    <div>
      <h1>Aplicación de Registro de Usuario</h1>
      <RegisterComponent verificarCorreoAutorizado={verificarCorreoAutorizado} />
    </div>
  );
};

export default App; 
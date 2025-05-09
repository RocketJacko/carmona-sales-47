import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';
import { User, Lock, Mail, Facebook, Github, Linkedin } from 'lucide-react';
import '@/styles/login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para los formularios
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Verificar si ya hay sesión activa
  useEffect(() => {
    const verificarSesion = async () => {
      const isAuthenticated = await supabaseService.verificarAutenticacion();
      if (isAuthenticated) {
        navigate('/crm');
      }
    };
    verificarSesion();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      const result = await supabaseService.iniciarSesion({
        email: loginEmail,
        password: loginPassword
      });
      
      if (result.success) {
        navigate('/crm');
      } else {
        toast.error(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      toast.error('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerUsername || !registerEmail || !registerPassword) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await supabaseService.registrarUsuario({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword
      });
      
      if (response.success) {
        toast.success('Usuario registrado exitosamente');
        setIsActive(false);
        setLoginEmail(registerEmail);
        setLoginPassword('');
      } else {
        toast.error(response.error || 'Error al registrar usuario');
      }
    } catch (error) {
      toast.error('Error inesperado al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className={`container ${isActive ? 'active' : ''}`}>
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input 
                type="email"
                placeholder="Email" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <i><Mail size={20} /></i>
            </div>
            <div className="input-box">
              <input 
                type="password"
                placeholder="Password" 
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <i><Lock size={20} /></i>
            </div>
            <div className="forgot-link">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
            <button 
              type="submit"
              className="btn" 
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Registro</h1>
            <div className="input-box">
              <input 
                type="text"
                placeholder="Username" 
                required
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <i><User size={20} /></i>
            </div>
            <div className="input-box">
              <input 
                type="email"
                placeholder="Email" 
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <i><Mail size={20} /></i>
            </div>
            <div className="input-box">
              <input 
                type="password"
                placeholder="Password" 
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <i><Lock size={20} /></i>
            </div>
            <button 
              type="submit"
              className="btn" 
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>¡Bienvenido!</h1>
            <p>¿No tienes una cuenta?</p>
            <button 
              className="btn register-btn" 
              type="button"
              onClick={() => setIsActive(true)}
            >
              Registrarse
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>¡Hola de nuevo!</h1>
            <p>¿Ya tienes una cuenta?</p>
            <button 
              className="btn login-btn" 
              type="button"
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

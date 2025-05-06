
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Facebook, Github, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabaseService } from '@/services/supabaseService';

// Colores personalizados según lo solicitado
const primaryColor = "#375c5d";
const secondaryColor = "#f1d6b8";

const LoginPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para los formularios
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Verificar si ya hay sesión activa
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/crm');
    }
  }, [navigate]);

  // Función para manejar el inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!loginUsername || !loginPassword) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Realizamos la autenticación con el servicio de Supabase
      const result = await supabaseService.iniciarSesion({
        username: loginUsername,
        password: loginPassword
      });
      
      if (result.success) {
        // Guardamos la información de la sesión
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify({
          id: result.id,
          usuario: result.usuario,
          email: result.email,
          agente: result.agente
        }));
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido ${result.usuario}`,
        });
        
        // Redirigimos al usuario al dashboard
        navigate('/crm');
      } else {
        toast({
          title: "Error al iniciar sesión",
          description: result.message || "Credenciales incorrectas",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error detallado:', error);
      toast({
        title: "Error al iniciar sesión",
        description: "Ocurrió un problema al intentar iniciar sesión. Por favor, inténtelo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!registerUsername || !registerEmail || !registerPassword) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`Verificando email: ${registerEmail}`);
      
      // Verificamos si el correo está autorizado usando el procedimiento almacenado
      const isAutorizado = await supabaseService.verificarCorreoAutorizado(registerEmail);
      console.log(`Resultado de verificación: ${isAutorizado}`);
      
      if (isAutorizado) {
        // El correo está autorizado, procedemos al registro eficiente
        const registroExitoso = await supabaseService.registrarUsuario({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword
        });

        if (registroExitoso) {
          toast({
            title: "Registro exitoso",
            description: "Su cuenta ha sido creada correctamente. Ahora puede iniciar sesión.",
          });
          // Cambiamos a la vista de login
          setIsActive(false);
          // Limpiamos los campos
          setRegisterUsername('');
          setRegisterEmail('');
          setRegisterPassword('');
        } else {
          toast({
            title: "Error de registro",
            description: "Ha ocurrido un error al registrar su cuenta. Por favor, inténtelo de nuevo.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Error de registro",
          description: "El correo electrónico no está autorizado para registrarse.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error detallado durante el registro:', error);
      toast({
        title: "Error al registrar",
        description: "Ha ocurrido un error durante el registro. Por favor, inténtelo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 to-blue-200">
      <div className={`container ${isActive ? 'active' : ''}`}>
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input 
                type="text" 
                placeholder="Username" 
                required 
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
              <i><User size={20} /></i>
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
              <a href="#">Forgot Password?</a>
            </div>
            <button 
              type="submit" 
              className="btn" 
              style={{ backgroundColor: primaryColor }}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Login'}
            </button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M9 15h6l3 3v-3h2V9h-2m-9 0h6a3 3 0 1 1 0 6H9V9Z"/></svg></a>
              <a href="#"><Facebook size={24} /></a>
              <a href="#"><Github size={24} /></a>
              <a href="#"><Linkedin size={24} /></a>
            </div>
          </form>
        </div>

        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Registration</h1>
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
              style={{ backgroundColor: primaryColor }}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Register'}
            </button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M9 15h6l3 3v-3h2V9h-2m-9 0h6a3 3 0 1 1 0 6H9V9Z"/></svg></a>
              <a href="#"><Facebook size={24} /></a>
              <a href="#"><Github size={24} /></a>
              <a href="#"><Linkedin size={24} /></a>
            </div>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button 
              className="btn register-btn" 
              type="button"
              onClick={() => setIsActive(true)}
              style={{ borderColor: secondaryColor, color: secondaryColor }}
            >
              Register
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button 
              className="btn login-btn" 
              type="button"
              onClick={() => setIsActive(false)}
              style={{ borderColor: secondaryColor, color: secondaryColor }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Facebook, Github, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { supabaseService } from '@/services/supabaseService';

// Colores personalizados según lo solicitado
const primaryColor = "#375c5d";
const secondaryColor = "#f1d6b8";

const LoginPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  // Estado para los formularios
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Verificar si ya hay sesión activa
  useEffect(() => {
    console.log('Verificando autenticación en LoginPage...');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    console.log(`¿Usuario autenticado?: ${isAuthenticated}`);
    
    if (isAuthenticated) {
      console.log('Usuario ya autenticado, redirigiendo a /crm');
      navigate('/crm');
    }
  }, [navigate]);

  // Función para manejar el inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!loginUsername || !loginPassword) {
      toast('Error', {
        description: "Por favor, complete todos los campos",
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`Iniciando sesión con: ${loginUsername}`);
      
      // Realizamos la autenticación con el servicio de Supabase
      const result = await supabaseService.iniciarSesion({
        username: loginUsername,
        password: loginPassword
      });
      
      if (result.success) {
        console.log("Login exitoso, redirigiendo a /crm");
        
        // Redirigimos al usuario al dashboard
        navigate('/crm');
      } else {
        console.error(`Error de inicio de sesión: ${result.message}`);
        uiToast({
          title: "Error al iniciar sesión",
          description: result.message || "Credenciales incorrectas",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error detallado:', error);
      uiToast({
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
      toast('Error', {
        description: "Por favor, complete todos los campos",
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`Verificando email para registro: ${registerEmail}`);
      
      // Verificamos si el correo está autorizado usando el procedimiento almacenado
      const isAutorizado = await supabaseService.verificarCorreoAutorizado(registerEmail);
      console.log(`¿Correo autorizado?: ${isAutorizado}`);
      
      if (isAutorizado) {
        // El correo está autorizado, procedemos al registro eficiente
        console.log('Email autorizado, procediendo con el registro');
        
        const registroExitoso = await supabaseService.registrarUsuario({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword
        });

        if (registroExitoso) {
          console.log('Registro exitoso, iniciando sesión automáticamente');
          
          uiToast({
            title: "Registro exitoso",
            description: "Su cuenta ha sido creada correctamente. Ahora iniciaremos sesión automáticamente.",
          });
          
          // Iniciamos sesión automáticamente después del registro
          const loginResult = await supabaseService.iniciarSesion({
            username: registerUsername,
            password: registerPassword
          });
          
          if (loginResult.success) {
            console.log('Inicio de sesión automático exitoso, redirigiendo a /crm');
            
            // Redirigimos al usuario al dashboard
            navigate('/crm');
          } else {
            console.error('Error en inicio de sesión automático, cambiando a vista de login');
            setIsActive(false); // Cambiamos a la vista de login
            // Limpiamos los campos de registro
            setRegisterUsername('');
            setRegisterEmail('');
            setRegisterPassword('');
          }
        } else {
          console.error('Error durante el registro');
          uiToast({
            title: "Error de registro",
            description: "Ha ocurrido un error al registrar su cuenta. Por favor, inténtelo de nuevo.",
            variant: "destructive"
          });
        }
      } else {
        console.error('Correo no autorizado para registro');
        uiToast({
          title: "Error de registro",
          description: "El correo electrónico no está autorizado para registrarse.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error detallado durante el registro:', error);
      uiToast({
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

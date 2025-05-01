
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Facebook, Github, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      // Aquí realizaríamos la autenticación con Supabase
      // Por ahora, simulamos un inicio de sesión exitoso
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: "Credenciales incorrectas",
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
      // Aquí verificaríamos si el correo está autorizado y registraríamos al usuario
      // Esta es una simulación de la verificación de correo autorizado
      const response = await fetch(`https://eaaijmcjevhrpfwpxtwg.supabase.co/rest/v1/correos_autorizados?email=eq.${encodeURIComponent(registerEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'SUPABASE_KEY', // Debería reemplazarse con la clave real
        }
      });
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // El correo está autorizado, registramos al usuario
        const registroResponse = await fetch(`https://eaaijmcjevhrpfwpxtwg.supabase.co/rest/v1/Registro_inicial`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'SUPABASE_KEY', // Debería reemplazarse con la clave real
          },
          body: JSON.stringify({
            username: registerUsername,
            email: registerEmail,
            password: registerPassword, // En un caso real, esta contraseña debería estar hasheada
          })
        });

        if (registroResponse.ok) {
          toast({
            title: "Registro exitoso",
            description: "Su cuenta ha sido creada correctamente. Ahora puede iniciar sesión.",
          });
          // Cambiamos a la vista de login
          setIsActive(false);
        } else {
          throw new Error('Error al registrar usuario');
        }
      } else {
        toast({
          title: "Error de registro",
          description: "El correo electrónico no está autorizado para registrarse.",
          variant: "destructive"
        });
      }
    } catch (error) {
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

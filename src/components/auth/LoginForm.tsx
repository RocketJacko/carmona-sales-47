
import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { supabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import SocialIcons from './SocialIcons';

interface LoginFormProps {
  onSuccess: () => void;
  primaryColor: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, primaryColor }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await supabaseService.iniciarSesion({
        username,
        password
      });
      
      if (result && result.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userInfo', JSON.stringify(result));
        onSuccess();
      } else {
        toast({
          title: "Error al iniciar sesión",
          description: "Credenciales incorrectas",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: "Ha ocurrido un error. Por favor, inténtelo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <div className="input-box">
        <input 
          type="text" 
          placeholder="Username" 
          required 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <i><User size={20} /></i>
      </div>
      <div className="input-box">
        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <SocialIcons />
    </form>
  );
};

export default LoginForm;

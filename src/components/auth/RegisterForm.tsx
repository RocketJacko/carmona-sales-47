
import React, { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { supabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onSuccess: () => void;
  primaryColor: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, primaryColor }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!username || !email || !password) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Primero verificamos si el correo está autorizado
      const isEmailAuthorized = await supabaseService.verificarCorreoAutorizado(email);
      
      if (isEmailAuthorized) {
        // El correo está autorizado, procedemos con el registro
        const registerResult = await supabaseService.registrarUsuario({
          username,
          email,
          password
        });
        
        if (registerResult) {
          toast({
            title: "Registro exitoso",
            description: "Su cuenta ha sido creada correctamente. Ahora puede iniciar sesión.",
          });
          onSuccess();
        } else {
          toast({
            title: "Error de registro",
            description: "No se pudo completar el registro. Por favor, inténtelo de nuevo.",
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
    <form onSubmit={handleRegister}>
      <h1>Registration</h1>
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
          type="email" 
          placeholder="Email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <i><Mail size={20} /></i>
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
      <button 
        type="submit" 
        className="btn" 
        style={{ backgroundColor: primaryColor }}
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;

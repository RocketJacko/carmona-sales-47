
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Esta página redirige a la página principal de nuestra aplicación MVC
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return null;
};

export default Index;

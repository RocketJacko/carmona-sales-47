import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Actualizar el estado inicial
    setMatches(media.matches);

    // Función para manejar cambios
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Agregar listener
    media.addEventListener('change', listener);

    // Limpiar listener
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
} 
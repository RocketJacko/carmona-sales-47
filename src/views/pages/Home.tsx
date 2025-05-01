
import React, { useEffect } from 'react';

const Home: React.FC = () => {
  // Set authentication flag when home page is loaded (for demo purposes)
  useEffect(() => {
    localStorage.setItem("isAuthenticated", "true");
  }, []);
  
  return (
    <section id="home">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to the Home Page</h1>
      <p className="text-center text-lg">You have successfully logged in!</p>
    </section>
  );
};

export default Home;

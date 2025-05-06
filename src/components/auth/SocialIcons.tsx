
import React from 'react';
import { Facebook, Github, Linkedin } from 'lucide-react';

const SocialIcons: React.FC = () => {
  return (
    <div className="social-icons">
      <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M9 15h6l3 3v-3h2V9h-2m-9 0h6a3 3 0 1 1 0 6H9V9Z"/></svg></a>
      <a href="#"><Facebook size={24} /></a>
      <a href="#"><Github size={24} /></a>
      <a href="#"><Linkedin size={24} /></a>
    </div>
  );
};

export default SocialIcons;

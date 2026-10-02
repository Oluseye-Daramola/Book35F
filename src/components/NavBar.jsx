import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import {Logo} from './Logo';
import {Button} from './Button';







export const NavBar=() =>{
  
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    
    <div className="relative bg-white">
      
      <div className="flex justify-between items-center px-6 py-4">
        
        <Logo />

        
        {/* Links: hidden on mobile, visible from 768px up wards */}
        <nav className="hidden md:flex gap-8 text-sm text-[var(--color-ink-navy)]">
          
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
          
        </nav>

        
        <div className="hidden md:block shrink-0">
          
          <Link to="/signup">
            <Button variant="primary">
              Sign Up
            </Button>
          </Link>
          
        </div>

        

        {/* Hamburger: visible on mobile only */}
        
        <button
          className="md:hidden text-2xl text-[var(--color-ink-navy)] shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          
          {menuOpen ? <FaTimes /> : <FaBars />}
          
        </button>
      </div>



      
      
      {/* Dropdown: only when menuOpen */}
      
      {menuOpen && (
      
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-6 text-sm text-[var(--color-ink-navy)]">
          
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
          
          <Link to="/signup" onClick={() => setMenuOpen(false)}>
            
            <Button variant="primary">
              Sign Up
            </Button>
            
          </Link>
          
        </nav>
      )}
    </div>
  );
}




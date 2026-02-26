import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Update with correct path based on folder structure
import logo from '../../assets/patientreg.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="const-container flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
           <img src={logo} alt="Medicare" className="h-10 w-auto" />
           <span className={`text-xl font-display font-bold ${scrolled ? 'text-primary' : 'text-primary'}`}>Medicare</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-primary hover:text-accent transition-colors font-sans text-sm font-medium">Services</a>
            <a href="#how-it-works" className="text-primary hover:text-accent transition-colors font-sans text-sm font-medium">How It Works</a>
            <Link to="/choose-path" className="btn-accent text-sm rounded-none">Book Consultation</Link>
        </div>

        {/* Mobile Join Now Button */}
        <Link to="/choose-path" className="md:hidden btn-accent text-sm px-4 py-2 rounded-none">
            Join Now
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

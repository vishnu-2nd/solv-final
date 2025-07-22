import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/research', label: 'Blog' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="/solv.svg" 
              alt="SOLV Legal" 
              className="h-12 w-auto lg:h-16 rounded-lg shadow-sm bg-white/10 p-1"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm lg:text-base font-medium transition-colors duration-200 hover:text-slate-600 whitespace-nowrap ${
                  location.pathname === item.path ? 'text-slate-800 border-b-2 border-slate-800' : 'text-slate-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-md text-sm lg:text-base font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
            >
              Speak With Our Experts
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-slate-900 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-t border-slate-200 shadow-lg"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-base font-medium transition-colors duration-200 rounded-md ${
                    location.pathname === item.path ? 'text-slate-800 bg-slate-100' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block mx-4 mt-6 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md text-base font-medium text-center hover:shadow-lg transition-all duration-200"
              >
                Speak With Our Experts
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
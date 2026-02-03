import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'
import { auth } from '../../../firebase';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
   const user = auth.currentUser;
   const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    try{   
      if(!confirm("Are you sure you want to logout?")) return;   
      auth.signOut();
      navigate('/');
    }catch(error){
      console.log(error);
    }
  };

  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Problem', href: '/#problem' },
    { name: 'Solution', href: '/#solution' },
    { name: 'Workflow', href: '/#workflow' },
    { name: 'AI Features', href: '/#aifeatures' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <Link to="/">
            Career<span className="brand-highlight">Companion</span>
          </Link>
        </div>

        {/* Center Nav Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Side Buttons */}
        {user ? (
          <div className="navbar-buttons">
            <Link
              to="/profile"
              className="btn-nav-login"
            >
              Profile
            </Link>
            <button
              className="btn-nav-signup"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </div>
        ) : (
        <div className="navbar-buttons">
          <Link
            to="/login"
            className="btn-nav-login"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn-nav-signup"
          >
            Sign up
          </Link>
        </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
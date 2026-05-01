import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/store';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🍳</span>
          <span className="logo-text">Chef<span>Kart</span></span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/chefs">Find Chefs</Link>
          <Link to="/plans">Plans & Pricing</Link>
          {user ? (
            <>
              <Link to="/dashboard">My Dashboard</Link>
              <button className="btn-nav-logout" onClick={() => { dispatch(logout()); navigate('/'); }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">Login</Link>
              <Link to="/register" className="btn-primary btn-nav">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

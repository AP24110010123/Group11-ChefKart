import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">🍳 Chef<span>Kart</span></div>
            <p>Professional chefs at your doorstep. Enjoy restaurant-quality meals cooked fresh in your own kitchen.</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/chefs">Find Chefs</Link>
            <Link to="/plans">Subscription Plans</Link>
            <Link to="/register">Get Started</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#careers">Careers</a>
            <a href="#blog">Blog</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact Us</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 ChefKart. All rights reserved.</p>
          <p>Payments secured by <strong>Razorpay</strong></p>
        </div>
      </div>
    </footer>
  );
}

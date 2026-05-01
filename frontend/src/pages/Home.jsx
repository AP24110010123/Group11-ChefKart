import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChefs } from '../services/api';
import ChefCard from '../components/ChefCard';
import './Home.css';

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Bengaluru', text: 'ChefKart transformed my weekdays! Chef Rajesh cooks the most amazing South Indian food every morning.', rating: 5 },
  { name: 'Arjun Mehta', city: 'Mumbai', text: 'Booked for a dinner party — absolutely stunning food. Guests couldn\'t believe a home-cooked meal could taste this good.', rating: 5 },
  { name: 'Sneha Reddy', city: 'Hyderabad', text: 'The subscription plan is totally worth it. Healthy meals every day without any hassle. Best decision ever!', rating: 5 },
];

export default function Home() {
  const [topChefs, setTopChefs] = useState([]);

  useEffect(() => {
    getChefs({ sort: '-rating', size: 3 })
      .then((res) => setTopChefs(res.data.chefs || []))
      .catch(() => {});
  }, []);

  return (
    <div className="home">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">

          <div className="hero-text">
            <div className="hero-badge">🌟 India's #1 Chef Booking Platform</div>
            <h1>
              Restaurant-Quality Meals
              <em>In Your Kitchen</em>
            </h1>
            <p>
              Hire certified, background-verified professional chefs for daily
              cooking, special occasions, or subscribe for weekly meal plans.
            </p>
            <div className="hero-ctas">
              <Link to="/chefs" className="btn-primary">Find a Chef</Link>
              <Link to="/plans" className="btn-outline">View Plans</Link>
            </div>
            <div className="hero-stats">
              <div><strong>500+</strong><span>Verified Chefs</span></div>
              <div><strong>10,000+</strong><span>Happy Customers</span></div>
              <div><strong>50+</strong><span>Cities</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-wrap">
              <div className="hero-img-placeholder">
                <span>🍽️</span>
              </div>
            </div>
            <div className="hero-card floating">
              <span className="hero-card-emoji">👨‍🍳</span>
              <div>
                <strong>Chef Ramesh K.</strong>
                <span>★ 4.9 · Bengaluru</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2>How ChefKart Works</h2>
            <p>Getting a professional chef to your home is as easy as 3 steps</p>
          </div>
          <div className="steps-grid">
            {[
              { num: '01', icon: '🔍', title: 'Browse Chefs', desc: 'Filter by cuisine, location, rating and budget. Every chef is verified and trained.' },
              { num: '02', icon: '📅', title: 'Book a Session', desc: 'Pick your date, meal type and number of guests. Instant confirmation.' },
              { num: '03', icon: '🍴', title: 'Enjoy Your Meal', desc: 'Chef arrives, cooks fresh in your kitchen, and cleans up afterwards.' },
            ].map((s) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Chefs ────────────────────────────────────────── */}
      <section className="chefs-section">
        <div className="container">
          <div className="section-header">
            <h2>Top-Rated Chefs</h2>
            <p>Handpicked culinary experts with stellar reviews</p>
          </div>
          {topChefs.length > 0 ? (
            <div className="chefs-grid">
              {topChefs.map((chef) => <ChefCard key={chef._id} chef={chef} />)}
            </div>
          ) : (
            <div className="empty-chefs">
              <p>Chef profiles loading… <Link to="/chefs">Browse all chefs →</Link></p>
            </div>
          )}
          <div className="section-cta">
            <Link to="/chefs" className="btn-outline">View All Chefs →</Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: '🛡️', title: 'Background Verified', desc: 'Every chef undergoes thorough background checks and identity verification.' },
              { icon: '🍳', title: 'Trained Professionals', desc: 'Our chefs are trained at culinary institutes and have real restaurant experience.' },
              { icon: '🌿', title: 'Fresh Ingredients', desc: 'Chefs use your ingredients or source fresh, high-quality produce for every meal.' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees. Clear pricing for every session. Cancel anytime on subscriptions.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real stories from real kitchens</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p>{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready for Your First ChefKart Experience?</h2>
          <p>Join thousands of happy customers who eat better every day.</p>
          <Link to="/register" className="btn-primary">Get Started Free</Link>
        </div>
      </section>

    </div>
  );
}

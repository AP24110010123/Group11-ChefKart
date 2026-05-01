import React from 'react';
import { Link } from 'react-router-dom';
import './ChefCard.css';

export default function ChefCard({ chef }) {
  const stars = '★'.repeat(Math.round(chef.rating)) + '☆'.repeat(5 - Math.round(chef.rating));

  return (
    <div className="chef-card">
      <div className="chef-card-img">
        <img
          src={chef.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chef.name}`}
          alt={chef.name}
        />
        {chef.verifiedChef && <span className="verified-badge">✓ Verified</span>}
      </div>
      <div className="chef-card-body">
        <div className="chef-card-top">
          <h3>{chef.name}</h3>
          <div className="chef-rating">
            <span className="stars">{stars}</span>
            <span className="rating-count">({chef.totalReviews || 0})</span>
          </div>
        </div>
        <div className="chef-cuisines">
          {(chef.cuisines || []).slice(0, 3).map((c) => (
            <span key={c} className="cuisine-tag">{c}</span>
          ))}
        </div>
        <div className="chef-meta">
          <span>📍 {chef.city}</span>
          <span>👨‍🍳 {chef.experience} yrs exp</span>
        </div>
        <div className="chef-card-footer">
          <div className="chef-price">
            <span className="price">₹{chef.pricePerDay?.toLocaleString()}</span>
            <span className="price-unit">/day</span>
          </div>
          <Link to={`/chefs/${chef._id}`} className="btn-primary btn-sm">Book Now</Link>
        </div>
      </div>
    </div>
  );
}

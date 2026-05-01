import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getChef, addReview } from '../services/api';
import './ChefDetail.css';

export default function ChefDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getChef(id).then((r) => { setChef(r.data.chef); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const submitReview = async () => {
    if (!user) return navigate('/login');
    if (!review.comment.trim()) return showToast('Please write a comment');
    setSubmitting(true);
    try {
      await addReview(id, review);
      showToast('Review submitted!');
      const r = await getChef(id);
      setChef(r.data.chef);
      setReview({ rating: 5, comment: '' });
    } catch { showToast('Failed to submit review'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!chef) return <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}><h2>Chef not found</h2><Link to="/chefs">← Back to Chefs</Link></div>;

  return (
    <div className="chef-detail">
      {toast && <div className="toast">{toast}</div>}

      <div className="chef-detail-hero">
        <div className="container chef-detail-top">
          <div className="chef-detail-img">
            <img src={chef.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chef.name}`} alt={chef.name} />
          </div>
          <div className="chef-detail-info">
            <div className="chef-detail-badges">
              {chef.verifiedChef && <span className="badge badge-verified">✓ Verified Chef</span>}
            </div>
            <h1>{chef.name}</h1>
            <div className="chef-detail-meta">
              <span>📍 {chef.city}</span>
              <span>👨‍🍳 {chef.experience} years experience</span>
              <span>⭐ {chef.rating} ({chef.totalReviews} reviews)</span>
            </div>
            {chef.bio && <p className="chef-bio">{chef.bio}</p>}
            <div className="chef-tags-row">
              {(chef.cuisines || []).map((c) => <span key={c} className="cuisine-tag">{c}</span>)}
            </div>
            <div className="chef-detail-price">
              <div>
                <span className="price-big">₹{chef.pricePerDay?.toLocaleString()}</span>
                <span className="price-unit">/day</span>
              </div>
              <Link to={`/book/${chef._id}`} className="btn-primary book-btn">Book This Chef →</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container chef-detail-body">
        {/* Special dishes */}
        {chef.specialDishes?.length > 0 && (
          <div className="detail-section">
            <h2>Signature Dishes</h2>
            <div className="dishes-grid">
              {chef.specialDishes.map((d) => (
                <div key={d} className="dish-chip">🍽️ {d}</div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {chef.categories?.length > 0 && (
          <div className="detail-section">
            <h2>Specializes In</h2>
            <div className="categories-list">
              {chef.categories.map((c) => <span key={c} className="category-pill">{c}</span>)}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="detail-section">
          <h2>Customer Reviews ({chef.totalReviews || 0})</h2>
          {(chef.reviews || []).length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="reviews-list">
              {(chef.reviews || []).slice(0, 6).map((r, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{r.name?.[0] || 'U'}</div>
                    <div>
                      <strong>{r.name}</strong>
                      <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add review */}
          <div className="add-review">
            <h3>Write a Review</h3>
            <div className="rating-select">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`star-btn ${n <= review.rating ? 'active' : ''}`}
                  onClick={() => setReview((r) => ({ ...r, rating: n }))}
                >★</button>
              ))}
            </div>
            <textarea
              placeholder="Share your experience..."
              value={review.comment}
              onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
              rows={3}
            />
            <button className="btn-primary" onClick={submitReview} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

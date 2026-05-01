import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyBookings, getMySubscriptions, cancelBooking } from '../services/api';
import './Dashboard.css';

const STATUS_COLORS = {
  pending: '#f59e0b', confirmed: '#10b981', 'in-progress': '#3b82f6',
  completed: '#6b7280', cancelled: '#ef4444',
};

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const [bookings, setBookings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [tab, setTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([getMyBookings(), getMySubscriptions()])
      .then(([b, s]) => {
        setBookings(b.data.bookings || []);
        setSubscriptions(s.data.subscriptions || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings((b) => b.map((x) => x._id === id ? { ...x, status: 'cancelled' } : x));
      showToast('Booking cancelled.');
    } catch { showToast('Failed to cancel.'); }
  };

  const activeSubscription = subscriptions.find((s) => s.active);

  return (
    <div className="dashboard">
      {toast && <div className="toast">{toast}</div>}

      <div className="dashboard-hero">
        <div className="container dashboard-hero-inner">
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p>Manage your bookings and subscriptions</p>
          </div>
          <Link to="/chefs" className="btn-primary">Book a Chef</Link>
        </div>
      </div>

      <div className="container dashboard-body">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <div><strong>{bookings.length}</strong><span>Total Bookings</span></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div><strong>{bookings.filter((b) => b.status === 'completed').length}</strong><span>Completed</span></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🌟</span>
            <div><strong>{activeSubscription ? activeSubscription.planDetails?.name : 'None'}</strong><span>Active Plan</span></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div>
              <strong>₹{bookings.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0).toLocaleString()}</strong>
              <span>Total Spent</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>My Bookings</button>
          <button className={tab === 'subscriptions' ? 'active' : ''} onClick={() => setTab('subscriptions')}>Subscriptions</button>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : tab === 'bookings' ? (
          bookings.length === 0 ? (
            <div className="empty-state">
              <span>📅</span>
              <h3>No bookings yet</h3>
              <p>Find a chef and make your first booking!</p>
              <Link to="/chefs" className="btn-primary">Find Chefs</Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((b) => (
                <div key={b._id} className="booking-item">
                  <div className="booking-chef-info">
                    <img src={b.chefId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.chefId?.name}`} alt="" />
                    <div>
                      <strong>{b.chefId?.name || 'Chef'}</strong>
                      <span>{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span style={{ textTransform: 'capitalize' }}>{b.mealType} · {b.guestCount} guests</span>
                    </div>
                  </div>
                  <div className="booking-status-col">
                    <span className="status-badge" style={{ color: STATUS_COLORS[b.status], background: STATUS_COLORS[b.status] + '22' }}>
                      {b.status}
                    </span>
                    <strong>₹{b.totalAmount?.toLocaleString()}</strong>
                    {b.status === 'pending' && (
                      <button className="cancel-btn" onClick={() => handleCancel(b._id)}>Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          subscriptions.length === 0 ? (
            <div className="empty-state">
              <span>🌟</span>
              <h3>No active subscriptions</h3>
              <p>Subscribe to a plan for daily home-cooked meals.</p>
              <Link to="/plans" className="btn-primary">View Plans</Link>
            </div>
          ) : (
            <div className="subscriptions-list">
              {subscriptions.map((s) => (
                <div key={s._id} className={`sub-item ${s.active ? 'active' : 'inactive'}`}>
                  <div>
                    <strong>{s.planDetails?.name} Plan</strong>
                    <span>{s.planDetails?.mealsPerDay} meals/day · {s.planDetails?.daysPerWeek} days/week</span>
                    <span>{new Date(s.startDate).toLocaleDateString('en-IN')} → {new Date(s.endDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div>
                    <span className={`plan-status ${s.active ? 'active' : ''}`}>{s.active ? '● Active' : '● Expired'}</span>
                    <strong>₹{s.planDetails?.pricePerMonth?.toLocaleString()}/mo</strong>
                  </div>
                </div>
              ))}
              <Link to="/plans" className="btn-outline" style={{ display: 'inline-flex', marginTop: '16px' }}>Upgrade / Renew Plan</Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

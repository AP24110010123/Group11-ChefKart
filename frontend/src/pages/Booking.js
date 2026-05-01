import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getChef, createBooking, createBookingOrder, verifyPayment } from '../services/api';
import { openRazorpay } from '../utils/razorpay';
import './Booking.css';

export default function Booking() {
  const { chefId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const [form, setForm] = useState({
    date: '', endDate: '', mealType: 'all-day', guestCount: 2,
    specialRequirements: '',
    address: { line1: '', city: '', state: '', pincode: '' }
  });

  useEffect(() => {
    getChef(chefId)
      .then((r) => { setChef(r.data.chef); setLoading(false); })
      .catch(() => setLoading(false));
  }, [chefId]);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 4000); };

  const getDays = () => {
    if (!form.date) return 1;
    if (!form.endDate) return 1;
    const diff = new Date(form.endDate) - new Date(form.date);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const totalAmount = chef ? chef.pricePerDay * getDays() : 0;

  const handleSubmit = async () => {
    if (!form.date) return showToast('Please select a date', 'error');
    if (!form.address.city) return showToast('Please enter your city', 'error');

    setSubmitting(true);
    try {
      const bookingRes = await createBooking({ chefId, ...form, totalAmount });
      const bookingId = bookingRes.data.booking._id;

      const orderRes = await createBookingOrder({ bookingId });
      const { orderId, amount, keyId } = orderRes.data;

      openRazorpay({
        orderId, amount, keyId,
        name: user?.name,
        description: `Book Chef ${chef.name} – ${getDays()} day(s)`,
        onSuccess: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              type: 'booking', entityId: bookingId,
            });
            showToast('🎉 Booking confirmed! Check your dashboard.', 'success');
            setTimeout(() => navigate('/dashboard'), 2000);
          } catch { showToast('Payment verification failed.', 'error'); }
        },
        onFailure: (msg) => showToast(msg || 'Payment failed', 'error'),
      });
    } catch (e) {
      showToast(e.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!chef) return <div className="container" style={{ padding: '120px 24px' }}><h2>Chef not found</h2></div>;

  return (
    <div className="booking-page">
      {toast.msg && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <div className="booking-hero">
        <div className="container">
          <h1>Book {chef.name}</h1>
          <p>Fill in the details below to confirm your booking</p>
        </div>
      </div>

      <div className="container booking-layout">
        <div className="booking-form-wrap">
          <h2>Booking Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input type="date" min={new Date().toISOString().split('T')[0]}
                value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>End Date (optional)</label>
              <input type="date" min={form.date || new Date().toISOString().split('T')[0]}
                value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Meal Type *</label>
              <select value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="all-day">All Day (3 meals)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Guests</label>
              <select value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: parseInt(e.target.value) })}>
                {[1,2,3,4,5,6,8,10].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
              </select>
            </div>
          </div>

          <h3>Cooking Address</h3>
          <div className="form-group">
            <label>Address Line 1 *</label>
            <input type="text" placeholder="House/Flat No, Street Name"
              value={form.address.line1}
              onChange={(e) => setForm({ ...form, address: { ...form.address, line1: e.target.value } })} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input type="text" placeholder="City"
                value={form.address.city}
                onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" placeholder="State"
                value={form.address.state}
                onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" placeholder="Pincode" maxLength={6}
                value={form.address.pincode}
                onChange={(e) => setForm({ ...form, address: { ...form.address, pincode: e.target.value } })} />
            </div>
          </div>

          <div className="form-group">
            <label>Special Requirements (optional)</label>
            <textarea rows={3} placeholder="Dietary restrictions, specific dishes, preferences..."
              value={form.specialRequirements}
              onChange={(e) => setForm({ ...form, specialRequirements: e.target.value })} />
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="booking-summary">
          <div className="summary-card">
            <div className="summary-chef">
              <img src={chef.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chef.name}`} alt={chef.name} />
              <div>
                <strong>{chef.name}</strong>
                <span>⭐ {chef.rating} · {chef.city}</span>
              </div>
            </div>

            <div className="summary-row"><span>Rate</span><span>₹{chef.pricePerDay?.toLocaleString()}/day</span></div>
            <div className="summary-row"><span>Duration</span><span>{getDays()} day{getDays() > 1 ? 's' : ''}</span></div>
            <div className="summary-row"><span>Meal Type</span><span style={{ textTransform: 'capitalize' }}>{form.mealType}</span></div>
            <div className="summary-row"><span>Guests</span><span>{form.guestCount}</span></div>
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>

            <button className="btn-primary pay-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Please wait...' : `Pay ₹${totalAmount.toLocaleString()} →`}
            </button>
            <p className="pay-note">🔒 Secure payment via Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
}

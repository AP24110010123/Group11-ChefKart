import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register as registerApi } from '../services/api';
import { setCredentials } from '../redux/store';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await registerApi(form);
      dispatch(setCredentials(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">🍳 ChefKart</div>
        <h1>Create an Account</h1>
        <p>Join thousands of happy customers</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row-2">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your full name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input type="tel" placeholder="10-digit mobile" value={form.mobile} onChange={set('mobile')} required maxLength={10} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Choose a username" value={form.username} onChange={set('username')} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}

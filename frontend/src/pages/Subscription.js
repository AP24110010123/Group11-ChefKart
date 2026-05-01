import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSubscriptionOrder, verifyPayment } from '../services/api';
import { openRazorpay } from '../utils/razorpay';
import './Subscription.css';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 2999,
    icon: '🌱',
    image: '/images/starter.jpg',
    tag: null,
    features: ['1 meal per day', '5 days a week', 'Choose your chef', 'Standard cuisines', 'Email support'],
    desc: 'Perfect for individuals who want healthy home-cooked lunches or dinners.'
  },
  {
    id: 'popular',
    name: 'Popular',
    price: 4999,
    icon: '🔥',
    image: '/images/popular.jpg',
    tag: 'Most Popular',
    features: ['2 meals per day', '6 days a week', 'Priority chef selection', 'All cuisines', 'Chat support', 'Weekly menu planning'],
    desc: 'Best for families who want freshly cooked meals twice a day.'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 7999,
    icon: '👑',
    image: '/images/premium.jpg',
    tag: 'Best Value',
    features: ['3 meals per day', '7 days a week', 'Dedicated personal chef', 'Custom menu & diet plans', '24/7 priority support', 'Special occasion cooking', 'Grocery management'],
    desc: 'The full ChefKart experience — your very own personal chef, every day.'
  }
];

export default function Subscription() {
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState('');
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 4000);
  };

  const handleSubscribe = async (plan) => {
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(plan.id);

    try {
      const res = await createSubscriptionOrder({ plan: plan.id });
      const { orderId, amount, keyId } = res.data;

      openRazorpay({
        orderId,
        amount,
        keyId,
        name: 'ChefKart',
        description: `ChefKart ${plan.name} Plan – Monthly`,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        onSuccess: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.id,
            });

            showToast(`🎉 ${plan.name} plan activated! Welcome to ChefKart.`, 'success');
            setTimeout(() => navigate('/dashboard'), 2000);
          } catch (e) {
            console.error('Verify payment error:', e.response?.data || e.message);
            showToast(
              e.response?.data?.message || 'Payment verification failed. Contact support.',
              'error'
            );
          }
        },
        onFailure: (msg) => {
          showToast(msg || 'Payment failed', 'error');
        },
      });
    } catch (e) {
      console.error('Create order error:', e.response?.data || e.message);
      showToast(e.response?.data?.message || 'Failed to create order', 'error');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="subscription-page">
      {toast.msg && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <div className="sub-hero">
        <img
          src="/images/subscription-hero.jpg"
          alt="Chef preparing healthy meals"
          className="sub-hero-image"
        />
        <div className="sub-hero-overlay">
          <div className="container">
            <h1>Simple, Transparent Pricing</h1>
            <p>Choose a chef plan that fits your lifestyle. Fresh meals, flexible plans, zero stress.</p>
          </div>
        </div>
      </div>

      <div className="container sub-content">
        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.tag === 'Most Popular' ? 'popular' : ''}`}>
              {plan.tag && <div className="plan-badge">{plan.tag}</div>}

              <img src={plan.image} alt={plan.name} className="plan-image" />

              <div className="plan-body">
                <div className="plan-icon">{plan.icon}</div>
                <h2>{plan.name}</h2>

                <div className="plan-price">
                  <span className="plan-amount">₹{plan.price.toLocaleString()}</span>
                  <span className="plan-period">/month</span>
                </div>

                <p className="plan-desc">{plan.desc}</p>

                <ul className="plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="check">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`plan-cta ${plan.tag === 'Most Popular' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id
                    ? 'Processing...'
                    : `Subscribe for ₹${plan.price.toLocaleString()}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sub-guarantee">
          <div className="guarantee-item">🔒 <strong>Secure Payments</strong> via Razorpay</div>
          <div className="guarantee-item">↩️ <strong>Cancel Anytime</strong> before next cycle</div>
          <div className="guarantee-item">🛡️ <strong>Money-back</strong> if unsatisfied in 7 days</div>
        </div>

        <div className="sub-story">
          <div className="sub-story-text">
            <h2>Why families choose ChefKart</h2>
            <p>
              Enjoy home-style meals prepared by trained chefs tailored to your schedule, food preferences,
              and nutrition goals.
            </p>
          </div>
          <img
            src="/images/popular.jpg"
            alt="Fresh family meal"
            className="sub-story-image"
          />
        </div>

        <div className="sub-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {[
              {
                q: 'Can I change my plan?',
                a: 'Yes, you can upgrade or downgrade your plan anytime. Changes take effect from the next billing cycle.',
              },
              {
                q: 'Who are the chefs?',
                a: 'All chefs are background-verified professionals with culinary training and restaurant experience.',
              },
              {
                q: 'Do I provide ingredients?',
                a: 'You can choose — either provide your own ingredients or let the chef source fresh, quality produce for an additional cost.',
              },
              {
                q: "What if I'm not satisfied?",
                a: "We offer a 7-day money-back guarantee. Contact support and we'll process a full refund, no questions asked.",
              },
            ].map((faq) => (
              <div key={faq.q} className="faq-card">
                <strong>{faq.q}</strong>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
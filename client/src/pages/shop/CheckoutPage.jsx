import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, Lock, ShieldCheck } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';
import { createPaymentIntent } from '../../services/paymentService';
import { formatPrice } from '../../utils/helpers';
import './CheckoutPage.css';

// Stripe test publishable key — safe to expose (this is a demo/test key)
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CARD_ELEMENT_STYLE = {
  style: {
    base: {
      color: '#e2e8f0',
      fontFamily: '"Inter", sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      '::placeholder': {
        color: '#64748b',
      },
      iconColor: '#4f7df9',
    },
    invalid: {
      color: '#f87171',
      iconColor: '#f87171',
    },
  },
};

// Inner checkout form (inside Stripe Elements provider)
const CheckoutForm = ({ shippingAddress, setStep }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, total, subtotal, shipping, tax, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMode, setPaymentMode] = useState(null); // 'stripe' or 'demo'

  useEffect(() => {
    // Check if Stripe is properly loaded with a real key
    const checkStripe = async () => {
      try {
        const { data } = await createPaymentIntent(1);
        setPaymentMode(data.demo ? 'demo' : 'stripe');
      } catch {
        setPaymentMode('demo');
      }
    };
    checkStripe();
  }, []);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setCardError('');

    try {
      // Step 1: Create payment intent on our server
      const { data: paymentData } = await createPaymentIntent(total);

      let paymentResult = {};

      if (paymentData.demo) {
        // Demo mode — simulate successful payment
        paymentResult = {
          id: paymentData.clientSecret,
          status: 'succeeded',
          demo: true,
        };
      } else {
        // Real Stripe — confirm with card details
        if (!stripe || !elements) {
          setCardError('Stripe has not loaded yet. Please wait a moment.');
          setLoading(false);
          return;
        }

        const cardNumber = elements.getElement(CardNumberElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          paymentData.clientSecret,
          {
            payment_method: {
              card: cardNumber,
              billing_details: {
                name: shippingAddress.fullName,
              },
            },
          }
        );

        if (error) {
          setCardError(error.message);
          setLoading(false);
          return;
        }

        paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          demo: false,
        };
      }

      // Step 2: Create order
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: 'stripe',
        paymentResult,
      };

      const { data } = await createOrder(orderData);
      setOrderId(data._id);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      setCardError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="order-success glass-card animate-fadeIn">
        <div className="success-icon"><Check size={40} /></div>
        <h2>Order Placed Successfully! 🎉</h2>
        <p>Your order #{orderId?.slice(-8)} has been received and is being processed.</p>
        <div className="success-actions">
          <button className="btn btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
          <button className="btn btn-secondary" onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-form glass-card">
        <h3><CreditCard size={22} /> Payment Details</h3>

        {paymentMode === 'demo' && (
          <div className="demo-payment-notice">
            <ShieldCheck size={20} />
            <div>
              <p><strong>🔒 Stripe Demo Mode</strong></p>
              <p>Use test card: <code>4242 4242 4242 4242</code> — Any future date — Any CVC — Any ZIP</p>
            </div>
          </div>
        )}

        <div className="stripe-card-form">
          <div className="stripe-field">
            <label>Card Number</label>
            <div className="stripe-input-wrapper">
              <CardNumberElement options={CARD_ELEMENT_STYLE} onChange={(e) => setCardError(e.error?.message || '')} />
            </div>
          </div>
          <div className="stripe-row">
            <div className="stripe-field">
              <label>Expiry Date</label>
              <div className="stripe-input-wrapper">
                <CardExpiryElement options={CARD_ELEMENT_STYLE} />
              </div>
            </div>
            <div className="stripe-field">
              <label>CVC</label>
              <div className="stripe-input-wrapper">
                <CardCvcElement options={CARD_ELEMENT_STYLE} />
              </div>
            </div>
          </div>
        </div>

        {cardError && <div className="card-error">{cardError}</div>}

        <div className="payment-security">
          <Lock size={14} />
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>

        <div className="action-btns">
          <button className="btn btn-secondary" onClick={() => setStep(1)}>Back to Shipping</button>
          <button
            className="btn btn-primary btn-lg payment-btn"
            onClick={handlePlaceOrder}
            disabled={loading || (!stripe && paymentMode !== 'demo')}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={16} />
                Pay {formatPrice(total)}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="checkout-summary glass-card">
        <h3>Order Summary</h3>
        <div className="summary-items">
          {cartItems.map(item => (
            <div key={item._id} className="summary-item">
              <span>{item.name} x{item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="summary-divider" />
        <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
        <div className="summary-row"><span>Tax</span><span>{formatPrice(tax)}</span></div>
        <div className="summary-divider" />
        <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
      </div>
    </>
  );
};

// Main checkout page component
const CheckoutPage = () => {
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '', street: '', city: '', state: '', zipCode: '', country: '', phone: ''
  });

  if (!isAuthenticated) {
    navigate('/login?redirect=checkout');
    return null;
  }

  if (cartItems.length === 0 && step < 2) {
    navigate('/cart');
    return null;
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}><span>1</span> Shipping</div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? 'active' : ''}`}><span>2</span> Payment</div>
        </div>

        <div className="checkout-layout">
          {step === 1 && (
            <>
              <div className="checkout-form-area">
                <form className="checkout-form glass-card" onSubmit={handleShippingSubmit}>
                  <h3>Shipping Address</h3>
                  <div className="form-grid">
                    <div className="input-group full-width">
                      <label>Full Name</label>
                      <input className="input-field" required value={shippingAddress.fullName}
                        onChange={e => setShippingAddress({...shippingAddress, fullName: e.target.value})} />
                    </div>
                    <div className="input-group full-width">
                      <label>Street Address</label>
                      <input className="input-field" required value={shippingAddress.street}
                        onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>City</label>
                      <input className="input-field" required value={shippingAddress.city}
                        onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>State</label>
                      <input className="input-field" required value={shippingAddress.state}
                        onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>ZIP Code</label>
                      <input className="input-field" required value={shippingAddress.zipCode}
                        onChange={e => setShippingAddress({...shippingAddress, zipCode: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>Country</label>
                      <input className="input-field" required value={shippingAddress.country}
                        onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})} />
                    </div>
                    <div className="input-group full-width">
                      <label>Phone (Optional)</label>
                      <input className="input-field" value={shippingAddress.phone}
                        onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg">Continue to Payment</button>
                </form>
              </div>

              <div className="checkout-summary glass-card">
                <h3>Order Summary</h3>
                <div className="summary-items">
                  {cartItems.map(item => (
                    <div key={item._id} className="summary-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-divider" />
                <div className="summary-row total"><span>Total</span><span>{formatPrice(cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0))}</span></div>
              </div>
            </>
          )}

          {step === 2 && (
            <Elements stripe={stripePromise}>
              <CheckoutForm shippingAddress={shippingAddress} setStep={setStep} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, shipping, tax, total, itemCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '40px' }}>
            <ShoppingBag size={64} />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any items yet.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart <span className="cart-count">({itemCount} items)</span></h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item glass-card">
                <Link to={`/products/${item._id}`} className="cart-item-image">
                  <img src={getImageUrl(item.image)} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/products/${item._id}`}>
                    <h3 className="cart-item-name">{item.name}</h3>
                  </Link>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus size={16} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus size={16} /></button>
                  </div>
                  <p className="cart-item-total">{formatPrice(item.price * item.quantity)}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary glass-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span><span>{formatPrice(tax)}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="continue-shopping">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

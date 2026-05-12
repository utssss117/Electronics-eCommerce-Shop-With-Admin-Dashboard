import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="card-top">
        {discount > 0 && (
          <span className="discount-badge">{discount}% Off</span>
        )}
        <button className="wishlist-btn" title="Add to wishlist">
          <Heart size={16} />
        </button>
        <Link to={`/products/${product._id}`} className="card-image-area">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            loading="lazy"
          />
        </Link>
      </div>

      <div className="card-body">
        <Link to={`/products/${product._id}`} className="card-name">
          {product.name}
        </Link>

        <div className="card-rating">
          <Star size={12} fill="var(--accent-yellow)" stroke="var(--accent-yellow)" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="rating-count">({product.numReviews || 0})</span>
        </div>

        <div className="card-pricing">
          <span className="card-price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="card-original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {product.stock === 0 ? (
          <span className="stock-label out">Out of Stock</span>
        ) : product.stock <= 5 ? (
          <span className="stock-label low">Only {product.stock} left</span>
        ) : null}

        <button
          className="add-cart-btn"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

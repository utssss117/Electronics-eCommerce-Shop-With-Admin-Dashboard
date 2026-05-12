import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, Minus, Plus, ChevronLeft, Check } from 'lucide-react';
import { getProductById } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { addReview } from '../../services/productService';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await addReview(id, { rating: reviewRating, comment: reviewComment });
      const { data } = await getProductById(id);
      setProduct(data);
      setReviewComment('');
      setReviewRating(5);
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="page-loader" style={{ paddingTop: '120px' }}><div className="loader" /></div>;
  if (!product) return <div className="empty-state" style={{ paddingTop: '120px' }}><h3>Product not found</h3></div>;

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/products" className="back-link">
          <ChevronLeft size={20} /> Back to Products
        </Link>

        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="main-image-wrap glass-card">
              {discount > 0 && <span className="detail-badge">-{discount}%</span>}
              <img src={getImageUrl(product.images?.[0])} alt={product.name} className="main-image" />
            </div>
          </div>

          <div className="product-detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>
            <p className="detail-brand">by <strong>{product.brand}</strong></p>

            <div className="detail-rating">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={18} fill={i <= product.rating ? 'var(--accent-yellow)' : 'transparent'}
                  stroke={i <= product.rating ? 'var(--accent-yellow)' : 'var(--text-muted)'} />
              ))}
              <span className="detail-rating-text">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            <div className="detail-price-section">
              <span className="detail-price">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="detail-original-price">{formatPrice(product.originalPrice)}</span>
              )}
              {discount > 0 && <span className="detail-discount">Save {discount}%</span>}
            </div>

            <div className="pincode-check">
              <h4>Check Delivery Options</h4>
              <div className="pincode-input-group">
                <input 
                  type="text" 
                  maxLength="6" 
                  placeholder="Enter Pincode" 
                  id="pincode-input"
                />
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    const pin = document.getElementById('pincode-input').value;
                    if(pin.length === 6) alert('Delivery available! Expected by Tomorrow.');
                    else alert('Please enter a valid 6-digit pincode.');
                  }}
                >
                  Check
                </button>
              </div>
            </div>

            <p className="detail-description">{product.description}</p>

            <div className="detail-stock">
              {product.stock > 0 ? (
                <span className="in-stock"><Check size={16} /> In Stock ({product.stock} available)</span>
              ) : (
                <span className="no-stock">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="detail-actions">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={18} /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}><Plus size={18} /></button>
                </div>
                <button
                  className={`btn btn-primary btn-lg add-to-cart-main ${addedToCart ? 'added' : ''}`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? <><Check size={20} /> Added!</> : <><ShoppingCart size={20} /> Add to Cart</>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tabs-header">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
            ))}
          </div>

          <div className="tab-content glass-card">
            {activeTab === 'description' && <p className="tab-text">{product.description}</p>}

            {activeTab === 'specifications' && (
              <div className="specs-table">
                {product.specs && Object.entries(
                  typeof product.specs === 'object' && product.specs.constructor === Map
                    ? Object.fromEntries(product.specs)
                    : (product.specs instanceof Object ? product.specs : {})
                ).map(([key, value]) => (
                  <div key={key} className="spec-row">
                    <span className="spec-key">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-section">
                {product.reviews?.length === 0 && <p className="no-reviews">No reviews yet.</p>}
                {product.reviews?.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div className="review-avatar">{review.user?.name?.charAt(0) || 'U'}</div>
                      <div>
                        <p className="review-name">{review.user?.name || 'User'}</p>
                        <div className="review-stars">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={14} fill={i <= review.rating ? 'var(--accent-yellow)' : 'transparent'}
                              stroke={i <= review.rating ? 'var(--accent-yellow)' : 'var(--text-muted)'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
                {isAuthenticated && (
                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <h4>Write a Review</h4>
                    <div className="review-rating-select">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={22} className="review-star-btn"
                          fill={i <= reviewRating ? 'var(--accent-yellow)' : 'transparent'}
                          stroke={i <= reviewRating ? 'var(--accent-yellow)' : 'var(--text-muted)'}
                          onClick={() => setReviewRating(i)}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                    <textarea
                      className="input-field"
                      rows="3"
                      placeholder="Share your thoughts..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    />
                    <button className="btn btn-primary" type="submit" disabled={reviewLoading}>
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

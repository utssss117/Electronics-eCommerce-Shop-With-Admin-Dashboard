import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, CreditCard, Smartphone, Laptop, Headphones as HeadphonesIcon, Camera, Gamepad2, Watch, Tv } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { getProducts } from '../../services/productService';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          getProducts({ featured: true, limit: 8 }),
          getProducts({ sort: 'newest', limit: 8 })
        ]);
        setFeaturedProducts(featuredRes.data.products);
        setNewProducts(newRes.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  return (
    <div className="home-page">
      {/* Hero Banner Image */}
      <section className="hero-banner-image-section">
        <div className="container">
          <div className="banner-carousel-wrapper">
            <button className="carousel-btn prev" onClick={prevSlide}>&lt;</button>
            <div className="banner-slider-container">
              <div className="banner-slider-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {/* Slide 1: CSS Poster */}
                <div className="banner-slide">
                  <div className="banner-css-poster">
                    <div className="poster-left">
                      <span className="poster-logo-text">
                        <span className="digital">digital</span><br/>
                        <span className="mobile-days">Mobile Days</span>
                      </span>
                      <span className="poster-date">1ST - 3RD MAY 2026</span>
                    </div>
                    <div className="poster-middle">
                      <h2>GRAB THE LATEST<br/><span>SMARTPHONES</span></h2>
                      <div className="discount-box">
                        <div className="upto">UP TO</div>
                        <div className="amount">₹7 500</div>
                        <div className="instant">INSTANT<br/>DISCOUNT*</div>
                      </div>
                      <div className="bank-cards">ON LEADING BANK CARDS</div>
                    </div>
                    <div className="poster-right">
                      <div className="product-showcase">
                        <Smartphone size={80} color="#333" strokeWidth={1} />
                        <Laptop size={100} color="#333" strokeWidth={1} />
                        <Watch size={60} color="#333" strokeWidth={1} />
                      </div>
                      <div className="accessories-promo">
                        Accessories<br/>Starting from ₹99*
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Slide 2: Image Banner */}
                <div className="banner-slide">
                  <Link to="/products?category=Smartphones" className="banner-image-link">
                    <img src="/images/banner-vivo.svg" alt="vivo V70 Series Promo" className="banner-image-full" />
                  </Link>
                </div>
              </div>
            </div>
            <button className="carousel-btn next" onClick={nextSlide}>&gt;</button>
          </div>
          <div className="carousel-dots">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <span 
                key={idx} 
                className={`dot ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Bank Offer Strip */}
      <section className="bank-offer-strip">
        <div className="container">
          <div className="bank-strip-inner">
            <button className="carousel-btn prev-sm">&lt;</button>
            <div className="bank-strip-content">
              <span className="bank-name"><i>✔</i> <strong>YES BANK</strong></span>
              <span className="divider">|</span>
              <span className="offer-main">Up To <span className="highlight">₹6 000</span> Instant Discount*</span>
              <span className="offer-sub">on Credit Card EMI Transactions</span>
            </div>
            <button className="carousel-btn next-sm">&gt;</button>
          </div>
          <div className="carousel-dots-sm">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </section>

      {/* Special Deals Grid */}
      <section className="special-deals-section">
        <div className="container">
          <div className="section-head">
            <h2>Special Deals</h2>
          </div>
          <div className="special-deals-grid">
            <Link to="/products?category=Laptops" className="deal-card">
              <div className="deal-content">
                <span className="deal-badge badge-yellow">Starting from ₹16 999*</span>
                <div className="deal-text">
                  <strong>LAPTOPS & TABLETS</strong>
                  <span className="deal-sub">BUY BEFORE PRICE HIKE</span>
                </div>
              </div>
              <div className="deal-visual">
                <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop" alt="Laptops" />
              </div>
            </Link>
            
            <Link to="/products?category=Smartphones" className="deal-card deal-border-blue">
              <div className="deal-content">
                <strong>5G Smartphones</strong>
                <span className="deal-price-box">Starting from <strong>₹14 399*</strong></span>
              </div>
              <div className="deal-visual">
                <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop" alt="Smartphones" />
              </div>
            </Link>

            <Link to="/products?category=Wearables" className="deal-card deal-border-cyan">
              <div className="deal-content">
                <strong>Smart Wearables</strong>
                <span className="deal-price-box">Flat <strong>5% off</strong> at Checkout*</span>
              </div>
              <div className="deal-visual">
                <img src="https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop" alt="Smart Wearables" />
              </div>
            </Link>

            <Link to="/products?category=Tablets" className="deal-card deal-border-red">
              <div className="deal-content">
                <strong>108 CM (43) QLED TV</strong>
                <span className="deal-price-box">At <strong>₹20 990*</strong></span>
              </div>
              <div className="deal-visual">
                <img src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop" alt="TVs" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Top Brands */}
      <section className="shop-by-brands-section">
        <div className="container">
          <div className="section-head">
            <h2>Shop By Top Brands</h2>
          </div>
          <div className="brands-container">
            {[
              { name: 'Apple', slug: 'apple' },
              { name: 'Samsung', slug: 'samsung' },
              { name: 'Sony', slug: 'sony' },
              { name: 'LG', slug: 'lg' },
              { name: 'Dell', slug: 'dell' },
              { name: 'HP', slug: 'hp' },
              { name: 'OnePlus', slug: 'oneplus' },
              { name: 'JBL', slug: 'jbl' }
            ].map(brand => (
              <Link key={brand.name} to={`/products?search=${brand.name}`} className="brand-badge-link">
                <div className="brand-badge-card">
                  <img src={`https://cdn.simpleicons.org/${brand.slug}/white`} alt={brand.name} className="brand-logo-img" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Popular - Horizontal Scroll */}
      <section className="product-section">
        <div className="container">
          <div className="section-head">
            <h2>Bestselling Products</h2>
            <Link to="/products?featured=true" className="view-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="page-loader"><div className="loader" /></div>
          ) : (
            <div className="products-horizontal-scroll">
              {featuredProducts.map(product => (
                <div key={product._id} className="scroll-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Offer Banner */}
      <section className="offer-banner">
        <div className="container">
          <div className="offer-card">
            <div className="offer-text">
              <span className="offer-tag">Limited Time</span>
              <h2>New User? Get 20% Off</h2>
              <p>Create an account and get a discount on your first purchase.</p>
            </div>
            <Link to="/register" className="btn btn-primary">
              Sign Up Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals - Horizontal Scroll */}
      <section className="product-section">
        <div className="container">
          <div className="section-head">
            <h2>New Arrivals</h2>
            <Link to="/products?sort=newest" className="view-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="page-loader"><div className="loader" /></div>
          ) : (
            <div className="products-horizontal-scroll">
              {newProducts.map(product => (
                <div key={product._id} className="scroll-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Strip (Moved to bottom like footer pre-amble) */}
      <section className="features-strip">
        <div className="container">
          <div className="features-row">
            <div className="feature-item">
              <Truck size={18} />
              <span>Free Shipping on $100+</span>
            </div>
            <div className="feature-item">
              <Shield size={18} />
              <span>1 Year Warranty</span>
            </div>
            <div className="feature-item">
              <CreditCard size={18} />
              <span>EMI Available</span>
            </div>
            <div className="feature-item">
              <Headphones size={18} />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { getProducts } from '../../services/productService';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './ProductsPage.css';

const allCategories = ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Cameras', 'Gaming', 'Wearables', 'Accessories'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name: A-Z' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [latestProduct, setLatestProduct] = useState(null);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const featured = searchParams.get('featured') || '';

  // Fetch the latest product once on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data } = await getProducts({ sort: 'newest', limit: 1 });
        if (data.products.length > 0) {
          setLatestProduct(data.products[0]);
        }
      } catch (error) {
        console.error('Error fetching latest product:', error);
      }
    };
    fetchLatest();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (category) params.category = category;
        if (search) params.search = search;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (featured) params.featured = featured;

        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotalPages(data.pages);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort, page, minPrice, maxPrice, featured]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = category || search || minPrice || maxPrice || featured;

  return (
    <div className="products-page">
      <div className="container">
        {/* Latest Arrival Spotlight */}
        {latestProduct && (
          <div className="latest-arrival-banner">
            <div className="latest-arrival-bg">
              <div className="latest-arrival-orb latest-arrival-orb-1" />
              <div className="latest-arrival-orb latest-arrival-orb-2" />
            </div>
            <div className="latest-arrival-content">
              <div className="latest-arrival-image-wrap">
                <img
                  src={getImageUrl(latestProduct.images?.[0])}
                  alt={latestProduct.name}
                  className="latest-arrival-image"
                />
              </div>
              <div className="latest-arrival-info">
                <span className="latest-arrival-badge">
                  <Sparkles size={14} />
                  Latest Arrival
                </span>
                <h2 className="latest-arrival-name">{latestProduct.name}</h2>
                <span className="latest-arrival-category">{latestProduct.category} • {latestProduct.brand}</span>
                <div className="latest-arrival-price-row">
                  <span className="latest-arrival-price">{formatPrice(latestProduct.price)}</span>
                  {latestProduct.originalPrice > latestProduct.price && (
                    <span className="latest-arrival-original-price">{formatPrice(latestProduct.originalPrice)}</span>
                  )}
                </div>
                <Link to={`/products/${latestProduct._id}`} className="btn btn-primary latest-arrival-btn">
                  View Product <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="products-header">
          <div>
            <h1 className="page-title">
              {search ? `Search: "${search}"` : category || 'All Products'}
            </h1>
            <p className="result-count">{total} products found</p>
          </div>
          <div className="products-controls">
            <select
              className="input-field sort-select"
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              className="btn btn-secondary filter-toggle-btn"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className="clear-filters" onClick={clearFilters}>Clear All</button>
              )}
              <button className="filter-close" onClick={() => setFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <button
                  className={`filter-chip ${!category ? 'active' : ''}`}
                  onClick={() => updateFilter('category', '')}
                >All</button>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-chip ${category === cat ? 'active' : ''}`}
                    onClick={() => updateFilter('category', cat)}
                  >{cat}</button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  className="input-field"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="input-field"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-content">
            {loading ? (
              <div className="page-loader"><div className="loader" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`page-btn ${p === page ? 'active' : ''}`}
                        onClick={() => updateFilter('page', p)}
                      >{p}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

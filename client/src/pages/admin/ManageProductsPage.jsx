import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { formatPrice } from '../../utils/helpers';
import './AdminPages.css';

const categories = ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Cameras', 'Gaming', 'Wearables', 'Accessories'];

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'Smartphones',
    brand: '', stock: '', featured: false
  });

  const fetchProducts = async () => {
    try {
      const params = { limit: 50 };
      if (search) params.search = search;
      const { data } = await getProducts(params);
      setProducts(data.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'images') formData.append(key, value);
      });
      if (form.imageFiles) {
        for (const file of form.imageFiles) formData.append('images', file);
      }

      if (editing) {
        await updateProduct(editing._id, formData);
      } else {
        await createProduct(formData);
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name, description: product.description, price: product.price,
      originalPrice: product.originalPrice || '', category: product.category,
      brand: product.brand, stock: product.stock, featured: product.featured
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', originalPrice: '', category: 'Smartphones', brand: '', stock: '', featured: false });
  };

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} products total</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditing(null); setShowModal(true); }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={18} />
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="admin-table-wrap glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <div className="table-product">
                    <span className="table-product-name">{product.name}</span>
                    <span className="table-product-brand">{product.brand}</span>
                  </div>
                </td>
                <td><span className="badge badge-info">{product.category}</span></td>
                <td className="table-price">{formatPrice(product.price)}</td>
                <td>
                  <span className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>{product.rating?.toFixed(1)} ⭐</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(product)}><Edit2 size={14} /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal glass-card" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="input-group full-width"><label>Product Name</label>
                  <input className="input-field" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="input-group full-width"><label>Description</label>
                  <textarea className="input-field" rows="3" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="input-group"><label>Price ($)</label>
                  <input className="input-field" type="number" step="0.01" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
                <div className="input-group"><label>Original Price ($)</label>
                  <input className="input-field" type="number" step="0.01" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} />
                </div>
                <div className="input-group"><label>Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group"><label>Brand</label>
                  <input className="input-field" required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                </div>
                <div className="input-group"><label>Stock</label>
                  <input className="input-field" type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                </div>
                <div className="input-group"><label>Featured</label>
                  <select className="input-field" value={form.featured} onChange={e => setForm({...form, featured: e.target.value === 'true'})}>
                    <option value="false">No</option><option value="true">Yes</option>
                  </select>
                </div>
                <div className="input-group full-width"><label>Images</label>
                  <input className="input-field" type="file" multiple accept="image/*"
                    onChange={e => setForm({...form, imageFiles: e.target.files})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;

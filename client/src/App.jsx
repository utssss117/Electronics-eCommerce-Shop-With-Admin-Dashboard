import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import WhatsAppWidget from './components/layout/WhatsAppWidget';

// Shop Pages
import HomePage from './pages/shop/HomePage';
import ProductsPage from './pages/shop/ProductsPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User Pages
import ProfilePage from './pages/user/ProfilePage';
import OrdersPage from './pages/user/OrdersPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';

import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="loader" /></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="loader" /></div>;
  return isAdmin ? children : <Navigate to="/" />;
};


// Shop layout with navbar and footer
const ShopLayout = () => (
  <>
    <Navbar />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppWidget />
  </>
);

// Admin layout with sidebar
const AdminLayout = () => (
  <div className="admin-layout">
    <AdminSidebar />
    <main className="admin-main">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Shop Routes */}
            <Route element={<ShopLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected User Routes */}
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ManageProductsPage />} />
              <Route path="orders" element={<ManageOrdersPage />} />
              <Route path="users" element={<ManageUsersPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

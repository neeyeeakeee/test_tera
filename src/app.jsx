import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context.jsx';
import { CartProvider } from './lib/cart-context.jsx';
import SiteHeader from './components/site-header.jsx';
import SiteFooter from './components/site-footer.jsx';
import Home from './pages/home.jsx';
import About from './pages/about.jsx';
import Catalog from './pages/catalog.jsx';
import ProductDetail from './pages/product-detail.jsx';
import Cart from './pages/cart.jsx';
import Orders from './pages/orders.jsx';
import OrderConfirmation from './pages/order-confirmation.jsx';
import Login from './pages/login.jsx';
import AdminSetup from './pages/admin-setup.jsx';
import AdminDashboard from './pages/admin-dashboard.jsx';
import NotFound from './pages/not-found.jsx';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
          <SiteHeader />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-setup" element={<AdminSetup />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <SiteFooter />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

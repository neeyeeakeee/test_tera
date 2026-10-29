import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Wrench, Menu, X, User, LogOut, PackageCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../lib/auth-context.jsx';
import { useCart } from '../lib/cart-context.jsx';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-purple-400 bg-purple-950/60 font-semibold border border-purple-800/40'
        : 'text-slate-300 hover:text-white hover:bg-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-purple-950 shadow-md">
      <div className="bg-purple-950/80 text-purple-200 text-xs py-1.5 px-4 text-center font-medium border-b border-purple-900/40">
        <span>⚙ On-Demand Auto Parts &amp; Mobile Mechanics in Atlanta, GA • Upfront Pricing</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-900/40 group-hover:bg-purple-700 transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">
                Quick Mechs
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                Parts &amp; Mobile Service
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/catalog" className={navLinkClass}>
              Parts Catalog
            </NavLink>
            {user && (
              <NavLink to="/orders" className={navLinkClass}>
                My Orders
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                <span className="flex items-center gap-1 text-purple-300 font-medium">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </span>
              </NavLink>
            )}
          </nav>

          {/* Right actions: Cart & User */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-purple-400 hover:bg-slate-900 rounded-lg transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm font-semibold hidden lg:inline">Cart</span>
              {itemCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-purple-600 rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-slate-800 mx-1" />

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-purple-400">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Cart and Menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-purple-400 rounded-lg"
              aria-label="Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-purple-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-950 bg-slate-950 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-900"
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-900"
          >
            About Us
          </NavLink>
          <NavLink
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-900"
          >
            Parts Catalog
          </NavLink>
          {user && (
            <NavLink
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-900"
            >
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-purple-300 bg-purple-950/60"
            >
              Admin Dashboard
            </NavLink>
          )}

          <div className="pt-3 border-t border-purple-950">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-sm text-slate-400">
                  Signed in as <span className="font-semibold text-white">{user.name}</span> ({user.email})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-purple-900/60 text-slate-300 text-sm font-medium hover:bg-slate-900"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 shadow-sm"
              >
                <User className="w-4 h-4" />
                Sign In or Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

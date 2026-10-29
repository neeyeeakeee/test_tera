import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Wrench, Phone, ShieldCheck, Menu, X, Clock, MapPin } from 'lucide-react';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      {/* Top Banner: Atlanta Mobile Dispatch Notice */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-purple-900 text-purple-100 text-xs py-1.5 px-4 border-b border-purple-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-300" />
              Serving Greater Atlanta & Surrounding Suburbs
            </span>
            <span className="text-purple-400/50">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-300" />
              Mon - Sat: 7:00 AM - 8:00 PM
            </span>
          </div>
          <div className="flex items-center space-x-3 text-purple-200">
            <span className="flex items-center gap-1 text-[11px] bg-purple-900/60 px-2 py-0.5 rounded border border-purple-700">
              <ShieldCheck className="w-3 h-3 text-purple-300" />
              ASE-Certified & Insured Local Techs
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 p-0.5 shadow-md group-hover:shadow-lg transition-all">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center border border-purple-200">
                <Wrench className="w-5 h-5 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-gray-900 font-heading flex items-center gap-1">
                QUICK <span className="text-purple-600">MECHS</span>
              </span>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold">
                Mobile & Classic Auto Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-purple-600 ${
                  isActive ? 'text-purple-600 font-bold border-b-2 border-purple-600 pb-1' : 'text-gray-700'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `transition-colors hover:text-purple-600 ${
                  isActive ? 'text-purple-600 font-bold border-b-2 border-purple-600 pb-1' : 'text-gray-700'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors hover:text-purple-600 ${
                  isActive ? 'text-purple-600 font-bold border-b-2 border-purple-600 pb-1' : 'text-gray-700'
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors hover:text-purple-600 ${
                  isActive ? 'text-purple-600 font-bold border-b-2 border-purple-600 pb-1' : 'text-gray-700'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Action: Direct Phone & Request Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-700 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Atlanta Dispatch</p>
                <p className="font-bold text-gray-900 tracking-wide">(404) 555-MECH</p>
              </div>
            </div>

            <a
              href={location.pathname === '/' ? '#request-form' : '/#request-form'}
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-xl shadow-md shadow-purple-200 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Request a Mechanic
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 border border-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-purple-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          <div className="pt-3 border-t border-gray-200 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 px-3 py-1.5">
              <Phone className="w-4 h-4 text-purple-600" />
              <span>Atlanta Dispatch: (404) 555-MECH</span>
            </div>
            <a
              href={location.pathname === '/' ? '#request-form' : '/#request-form'}
              onClick={closeMenu}
              className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-md"
            >
              Request a Mechanic
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
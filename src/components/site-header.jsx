import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Wrench, Phone, ShieldCheck, Menu, X, Clock, MapPin } from 'lucide-react';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="bg-gray-900 text-gray-200 text-xs py-1.5 px-4 border-b border-gray-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              Serving Greater Atlanta & Surrounding Suburbs
            </span>
            <span className="text-gray-700">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Mon - Sat: 7:00 AM - 8:00 PM
            </span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <span className="flex items-center gap-1 text-[11px] bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
              <ShieldCheck className="w-3 h-3 text-gray-300" />
              ASE-Certified & Insured Local Techs
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <div className="w-11 h-11 rounded-xl bg-gray-900 p-0.5 shadow-md group-hover:shadow-lg transition-all">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center border border-gray-200">
                <Wrench className="w-5 h-5 text-gray-900 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-gray-900 font-heading flex items-center gap-1">
                QUICK <span className="text-gray-600">MECHS</span>
              </span>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold">
                Mobile & Classic Auto Care
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-gray-900 ${
                  isActive ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-1' : 'text-gray-700'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `transition-colors hover:text-gray-900 ${
                  isActive ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-1' : 'text-gray-700'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors hover:text-gray-900 ${
                  isActive ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-1' : 'text-gray-700'
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors hover:text-gray-900 ${
                  isActive ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-1' : 'text-gray-700'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-700 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-900">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Atlanta Dispatch</p>
                <p className="font-bold text-gray-900 tracking-wide">(404) 555-MECH</p>
              </div>
            </div>

            <a
              href={location.pathname === '/' ? '#request-form' : '/#request-form'}
              className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 hover:bg-black rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Request a Mechanic
            </a>
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          <div className="pt-3 border-t border-gray-200 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 px-3 py-1.5">
              <Phone className="w-4 h-4 text-gray-900" />
              <span>Atlanta Dispatch: (404) 555-MECH</span>
            </div>
            <a
              href={location.pathname === '/' ? '#request-form' : '/#request-form'}
              onClick={closeMenu}
              className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-gray-900 rounded-xl shadow-md"
            >
              Request a Mechanic
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
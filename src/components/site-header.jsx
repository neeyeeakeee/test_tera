import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Wrench, Phone, ShieldCheck, Menu, X, Clock, MapPin } from 'lucide-react';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0c0a10]/95 backdrop-blur-md border-b border-purple-950/60 shadow-xl">
      {/* Top Banner: Atlanta Mobile Dispatch Notice */}
      <div className="bg-gradient-to-r from-purple-950 via-[#1f1035] to-purple-950 text-purple-200 text-xs py-1.5 px-4 border-b border-purple-900/40 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              Serving Greater Atlanta & Surrounding Suburbs
            </span>
            <span className="text-purple-400/50">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Mon - Sat: 7:00 AM - 8:00 PM
            </span>
          </div>
          <div className="flex items-center space-x-3 text-purple-300">
            <span className="flex items-center gap-1 text-[11px] bg-purple-900/40 px-2 py-0.5 rounded border border-purple-800/40">
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
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-600 to-purple-950 p-0.5 shadow-lg shadow-purple-900/30 group-hover:shadow-purple-700/50 transition-all">
              <div className="w-full h-full bg-[#120d1e] rounded-[7px] flex items-center justify-center border border-purple-500/30">
                <Wrench className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white font-heading flex items-center gap-1">
                QUICK <span className="text-purple-400">MECHS</span>
              </span>
              <span className="text-[10px] tracking-widest text-gray-400 uppercase font-medium">
                Mobile & Classic Auto Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-purple-300 ${
                  isActive ? 'text-purple-400 font-semibold' : 'text-gray-300'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `transition-colors hover:text-purple-300 ${
                  isActive ? 'text-purple-400 font-semibold' : 'text-gray-300'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors hover:text-purple-300 ${
                  isActive ? 'text-purple-400 font-semibold' : 'text-gray-300'
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors hover:text-purple-300 ${
                  isActive ? 'text-purple-400 font-semibold' : 'text-gray-300'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Action: Direct Phone & Request Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-purple-900/60 bg-purple-950/20 text-xs text-gray-300">
              <div className="w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Atlanta Dispatch</p>
                <p className="font-bold text-white tracking-wide">(404) 555-MECH</p>
              </div>
            </div>

            <a
              href={location.pathname === '/' ? '#request-quote' : '/#request-quote'}
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 rounded-lg shadow-md shadow-purple-950 border border-purple-500/40 hover:border-purple-400 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Request a Mechanic
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-purple-950/40 border border-purple-900/40 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-purple-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#110c1c] border-b border-purple-900/60 px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-950/80 text-purple-300 border-l-2 border-purple-500'
                    : 'text-gray-300 hover:bg-purple-950/40 hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-950/80 text-purple-300 border-l-2 border-purple-500'
                    : 'text-gray-300 hover:bg-purple-950/40 hover:text-white'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-950/80 text-purple-300 border-l-2 border-purple-500'
                    : 'text-gray-300 hover:bg-purple-950/40 hover:text-white'
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-950/80 text-purple-300 border-l-2 border-purple-500'
                    : 'text-gray-300 hover:bg-purple-950/40 hover:text-white'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          <div className="pt-3 border-t border-purple-900/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-300 px-3 py-1.5">
              <Phone className="w-4 h-4 text-purple-400" />
              <span>Atlanta Dispatch: (404) 555-MECH</span>
            </div>
            <a
              href={location.pathname === '/' ? '#request-quote' : '/#request-quote'}
              onClick={closeMenu}
              className="w-full text-center px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg border border-purple-500/40 shadow-lg shadow-purple-950"
            >
              Request a Mechanic
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
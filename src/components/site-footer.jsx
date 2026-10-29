import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Truck, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-purple-950 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-purple-950 text-sm">
          <div className="flex items-center gap-3.5 bg-slate-900/80 p-4 rounded-xl border border-purple-900/40">
            <Truck className="w-7 h-7 text-purple-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Local Atlanta Fulfillment</p>
              <p className="text-xs text-slate-400 mt-0.5">Fast dispatch &amp; convenient pre-order pickup or delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-slate-900/80 p-4 rounded-xl border border-purple-900/40">
            <ShieldCheck className="w-7 h-7 text-purple-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Vetted Fitment Guarantee</p>
              <p className="text-xs text-slate-400 mt-0.5">Parts match exact OEM and aftermarket vehicle specs</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-slate-900/80 p-4 rounded-xl border border-purple-900/40">
            <Clock className="w-7 h-7 text-purple-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Real-Time Order Tracking</p>
              <p className="text-xs text-slate-400 mt-0.5">Track your order status step-by-step just like ride-sharing</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">Quick Mechs</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              On-demand vehicle parts and mobile repairs for everyday drivers and small fleets across Atlanta, Georgia. Transparent upfront pricing and verified stock.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Atlanta, Georgia</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Popular Parts
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/catalog?category=Brakes" className="hover:text-purple-400 transition-colors">
                  Brake Pads &amp; Rotors
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Batteries" className="hover:text-purple-400 transition-colors">
                  Heavy-Duty Batteries
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Diagnostics" className="hover:text-purple-400 transition-colors">
                  OBD2 Diagnostic Tools
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Filters" className="hover:text-purple-400 transition-colors">
                  Oil &amp; Cabin Air Filters
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Cooling" className="hover:text-purple-400 transition-colors">
                  Thermostats &amp; Radiators
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Orders &amp; Account
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/cart" className="hover:text-purple-400 transition-colors">
                  Shopping Cart &amp; Pre-Orders
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-purple-400 transition-colors">
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-purple-400 transition-colors">
                  Customer Login / Register
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-purple-400 transition-colors">
                  About Quick Mechs
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-purple-400 transition-colors">
                  Full Auto Parts Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Standards */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Quick Mechs Standards
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Clear upfront quotes without hidden fees</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Verified customer ratings and reviews</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Fleet discount options and stock alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-purple-950 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p> 2026 Quick Mechs. All rights reserved. Connecting Atlanta drivers with vetted auto parts.</p>
          <div className="flex items-center gap-4">
            <Link to="/catalog" className="hover:text-slate-400">
              Catalog
            </Link>
            <Link to="/cart" className="hover:text-slate-400">
              Pre-Orders
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

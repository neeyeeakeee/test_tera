import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-200 shadow-lg">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-white block uppercase">
                  Quick <span className="text-gray-400">Mechs</span>
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-widest block font-medium">
                  Atlanta, Georgia
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Atlanta's premier on-demand vehicle repair platform. We bring vetted, certified mechanics straight to your driveway, office parking lot, or roadside with upfront pricing and zero runaround.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
              <span>12-Month / 12,000-Mile Warranty</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-gray-600 pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  All Repair Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  About Quick Mechs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <a href="#request-form" className="text-gray-300 hover:text-white transition-colors font-medium flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  Request a Mechanic
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-gray-600 pl-3">
              Atlanta Service Areas
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Mobile technicians dispatched across the Greater Atlanta Metro:
            </p>
            <ul className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                Midtown
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                Buckhead
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                Downtown
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                Decatur
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                Sandy Springs
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                Marietta
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                Alpharetta
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                East Point
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-gray-600 pl-3">
              Direct Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-xs">
                  Atlanta, GA Metro Area & Fleet Mobile Dispatch
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href="tel:4045550199" className="text-gray-200 hover:text-white text-xs font-semibold tracking-wide">
                  (404) 555-0199
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-xs">
                  service@quickmechs.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-xs">
                  Mon – Sat: 7:00 AM – 8:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; 2026 Quick Mechs. All rights reserved. On-Demand Vehicle Repair in Atlanta, Georgia.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-gray-300 transition-colors">About</Link>
            <Link to="/services" className="hover:text-gray-300 transition-colors">Services</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Support</Link>
            <Link to="/admin-login" className="hover:text-gray-300 text-gray-500 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { MapPin, Truck, ShieldCheck, Wrench, Clock, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-700">
            Atlanta's Premier Auto Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
            About Quick Mechs
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            Connecting everyday drivers and small fleet owners in Atlanta, Georgia with vetted replacement parts, transparent upfront pricing, and Uber-like real-time pre-order fulfillment.
          </p>
        </div>

        {/* Core Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-900 p-8 rounded-3xl border border-purple-900/40 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">On-Demand Hub Dispatch</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our Atlanta distribution center stocks certified brakes, AGM batteries, and diagnostic tools ready for immediate courier dispatch or pre-order reservation.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl border border-purple-900/40 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Vetted Fitment Guarantee</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every component in our catalog is rigorously verified for strict OEM and aftermarket compatibility across popular sedan, SUV, and fleet vehicle models.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl border border-purple-900/40 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-Time Order Tracking</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Experience total transparency with live status updates from warehouse picking to transit and final delivery right to your driveway.
            </p>
          </div>
        </div>

        {/* Location & Map Section */}
        <div className="bg-slate-900 rounded-3xl border border-purple-900/40 p-8 sm:p-12 mb-16 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" /> Atlanta Distribution Center
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Visit Our Atlanta Hub
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Conveniently located in the heart of Atlanta, Georgia. Our facility serves local drivers, mobile mechanics, and fleet managers with fast pickup options and expert support.
              </p>
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <p className="flex items-center gap-2">
                  <span className="font-bold text-white">Address:</span> 123 Peachtree St NE, Atlanta, GA 30303
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-bold text-white">Hours:</span> Monday – Saturday (8:00 AM – 7:00 PM)
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-bold text-white">Support:</span> support@quickmechs.com
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-purple-900/60 bg-slate-950 shadow-inner flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 shadow-lg animate-pulse">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Quick Mechs Atlanta Hub</h3>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Peachtree Street NE corridor, serving the greater Atlanta metropolitan area and surrounding Georgia counties.
                </p>
                <a
                  href="https://maps.google.com/?q=Peachtree+St+NE+Atlanta+GA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
                >
                  Open in Google Maps <MapPin className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-slate-900 to-purple-950/80 p-8 sm:p-12 rounded-3xl border border-purple-900/40">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ready to get started with Quick Mechs?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Explore our verified auto parts catalog, check live inventory, and place your pre-order today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition shadow-sm"
            >
              Browse Parts Catalog
            </Link>
            <Link
              to="/orders"
              className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition border border-purple-900/60"
            >
              Track My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, Wrench, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-700">
            About Quick Mechs
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-4 mb-4">
            Automotive Parts &amp; Delivery, <span className="text-purple-400">Reinvented for Atlanta</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Experience automotive repair supply like ride-sharing: get vetted auto parts, transparent upfront pricing, and real-time pre-order tracking delivered right to your garage or doorstep across Atlanta, Georgia.
          </p>
        </div>

        {/* Image & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-purple-900/60 shadow-2xl bg-slate-900 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                alt="Quick Mechs Atlanta Distribution Hub"
                className="w-full h-full object-cover"
                width="1200"
                height="900"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="bg-slate-900/90 backdrop-blur border border-purple-800/40 rounded-xl p-4 w-full shadow-lg">
                  <div className="flex items-center gap-3 text-white">
                    <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-xs text-purple-400 font-bold uppercase">Atlanta Distribution Center</p>
                      <p className="text-sm font-bold">Same-Day Dispatch &amp; Pre-Order Hub</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Why Everyday Drivers &amp; Small Fleets Choose Us
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Traditional auto parts shopping and repair shops are bogged down by hidden markups, lack of inventory transparency, and endless waiting. Quick Mechs connects you directly with high-grade ceramic brake pads, heavy-duty AGM batteries, ignition components, and OBD-II diagnostics with absolute clarity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-purple-900/40">
                <ShieldCheck className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold text-white text-sm">Vetted Fitment Guarantee</h3>
                <p className="text-xs text-slate-400 mt-1">Every part matches exact OEM and aftermarket specifications.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-purple-900/40">
                <Clock className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold text-white text-sm">Real-Time Tracking</h3>
                <p className="text-xs text-slate-400 mt-1">Track your order status step-by-step from warehouse to driveway.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm shadow-sm transition"
              >
                Explore Parts Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Core Values / Pillars */}
        <div className="bg-slate-900 rounded-3xl border border-purple-900/40 p-8 sm:p-12 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white">The Quick Mechs Standard</h2>
            <p className="text-slate-400 text-sm mt-2">
              Our platform is built around transparency, reliability, and speed for Atlanta drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-950 border border-purple-950">
              <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Upfront Pricing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No guesswork or surprise fees. Every part price and estimated delivery tax is fully transparent before you check out.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-950 border border-purple-950">
              <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Fast Atlanta Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In-stock items are packaged immediately at our local hub for prompt courier or curbside delivery across Atlanta, GA.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-950 border border-purple-950">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Verified Reviews</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Read genuine feedback from local drivers and mechanics who have successfully installed our components.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="text-center bg-gradient-to-r from-slate-900 to-purple-950/80 rounded-3xl p-8 sm:p-12 border border-purple-900/50 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ready to get the right parts for your vehicle?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Browse our catalog of brakes, batteries, spark plugs, and diagnostic tools today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="w-full sm:w-auto px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm shadow-md transition"
            >
              Browse Auto Parts Catalog
            </Link>
            <Link
              to="/orders"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-sm border border-purple-900/60 transition"
            >
              Track My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

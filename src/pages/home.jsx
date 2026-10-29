import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Truck, Wrench, ArrowRight, Star, Clock, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/product-card.jsx';
import HeroSlider from '../components/hero-slider.jsx';
import { api } from '../lib/api.js';

const CATEGORIES = [
  {
    name: 'Brakes & Rotors',
    slug: 'brakes',
    description: 'Ceramic pads, heavy-duty rotors & calipers',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Batteries & Starters',
    slug: 'batteries',
    description: 'High-crank AGM batteries and starter motors',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Engine & Ignition',
    slug: 'engine',
    description: 'Spark plugs, coils, alternators & filters',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Diagnostics & Sensors',
    slug: 'diagnostics',
    description: 'O2 sensors, MAF sensors & OBD scan tools',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
  }
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.get('/api/products?limit=6');
        if (res.ok && Array.isArray(res.data?.products)) {
          setFeaturedProducts(res.data.products);
        }
      } catch (err) {
        console.error('Error loading featured parts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 md:py-24 border-b border-purple-950">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950 border border-purple-800/60 text-purple-300 text-xs sm:text-sm font-medium">
                <Clock className="w-4 h-4" />
                Fast Shipping & Verified Vehicle Fitment in Atlanta, GA
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Reliable Auto Parts, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400">
                  Delivered Fast & Fairly Priced
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Browse certified replacement components, pre-order high-demand parts, and check real-time stock levels. No shop runarounds—just upfront pricing and guaranteed compatibility.
              </p>

              {/* Hero Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-2xl bg-slate-900 p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 border border-purple-900/50">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by part name, part number, or vehicle model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-2 py-2 text-white bg-transparent placeholder-slate-400 text-sm focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-sm text-sm shrink-0"
                >
                  Search Parts
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Upfront Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Live Stock & Pre-orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Verified OEM & Aftermarket</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Value Props */}
      <section className="py-12 bg-slate-900 border-b border-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-950 border border-purple-900/40">
              <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center shrink-0">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">1. Check Fitment & Stock</h3>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  Search your vehicle's make, model, or part number to verify exact compatibility and instant live availability.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-950 border border-purple-900/40">
              <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">2. Order or Pre-Order</h3>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  Secure in-stock components immediately or pre-order rare components with accurate tracking and status updates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-950 border border-purple-900/40">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">3. Transparent Quality</h3>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  All parts pass strict mechanical safety standards with authentic buyer reviews and fair, transparent pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Browse By System</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Popular Parts Categories</h2>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-400 hover:text-purple-300 transition"
            >
              View Full Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalog?category=${cat.slug}`}
                className="group bg-slate-900 rounded-2xl border border-purple-900/40 overflow-hidden shadow-sm hover:shadow-md hover:border-purple-500 transition duration-200 flex flex-col"
              >
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                    width="400"
                    height="260"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                    <span>Explore items</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Parts Inventory */}
      <section className="py-16 bg-slate-900 border-t border-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Immediate Dispatch & Pre-order</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Featured Vehicle Parts</h2>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-400 hover:text-purple-300 transition"
            >
              Browse All Stock <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-950 rounded-2xl h-80 animate-pulse border border-purple-900/40" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-950 rounded-2xl border border-dashed border-purple-900/50">
              <Wrench className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">Catalog is currently being indexed.</p>
              <Link
                to="/catalog"
                className="inline-block mt-4 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition"
              >
                Go to Catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Guarantee & Local Service Banner */}
      <section className="py-16 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-slate-900 to-purple-950/60 border border-purple-900/50 p-8 sm:p-12 rounded-3xl shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-700">
                  The Quick Mechs Commitment
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Tired of repair shop markup and waiting weeks?
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                  Every part in our catalog comes with detailed specifications, direct customer reviews, and clear stock status. If a part is marked for pre-order, you get real-time fulfillment updates until it lands at your doorstep or garage.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
                <Link
                  to="/catalog"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-black px-6 py-4 rounded-xl text-center shadow-lg transition duration-150"
                >
                  Start Shopping Now
                </Link>
                <Link
                  to="/catalog?category=brakes"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-xl text-center border border-purple-900/60 transition duration-150"
                >
                  Explore Brake Systems
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

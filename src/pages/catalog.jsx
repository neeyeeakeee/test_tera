import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, AlertCircle, PackageCheck, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/product-card.jsx';
import { api } from '../lib/api.js';

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: '' },
  { label: 'Brakes & Rotors', value: 'brakes' },
  { label: 'Batteries & Starters', value: 'batteries' },
  { label: 'Engine & Ignition', value: 'engine' },
  { label: 'Diagnostics & Sensors', value: 'diagnostics' },
  { label: 'Suspension & Steering', value: 'suspension' },
  { label: 'Lighting & Electrical', value: 'electrical' }
];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (stockFilter !== 'all') params.append('stock', stockFilter);
        if (sortBy) params.append('sort', sortBy);

        const res = await api.get(`/api/products?${params.toString()}`);
        if (res.ok && Array.isArray(res.data?.products)) {
          setProducts(res.data.products);
        } else {
          setError(res.data?.error || 'Unable to retrieve parts catalog.');
        }
      } catch (err) {
        setError('Network error while loading catalog.');
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [search, category, stockFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search, category });
  };

  const updateParams = (newParams) => {
    const next = new URLSearchParams();
    if (newParams.category) next.set('category', newParams.category);
    if (newParams.search) next.set('search', newParams.search);
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setStockFilter('all');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Auto Parts & Replacement Catalog
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Search our catalog of vetted vehicle components. Check real-time warehouse stock, fitment specs, and verified reviews before you order or pre-order.
          </p>
        </div>

        {/* Filters and Controls Bar */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-purple-900/40 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Search name, part # or vehicle..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-purple-900/50 text-sm text-white bg-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </form>
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCategory(val);
                    updateParams({ category: val, search });
                  }}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-purple-900/50 text-sm text-white bg-slate-950 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Stock Availability Toggle */}
            <div className="md:col-span-2">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-purple-900/50 text-sm text-white bg-slate-950 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
              >
                <option value="all" className="bg-slate-900 text-white">All Inventory</option>
                <option value="instock" className="bg-slate-900 text-white">In Stock Only</option>
                <option value="preorder" className="bg-slate-900 text-white">Pre-order Only</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2 flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-purple-900/50 text-sm text-white bg-slate-950 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
              >
                <option value="newest" className="bg-slate-900 text-white">Newest Arrivals</option>
                <option value="price-asc" className="bg-slate-900 text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-slate-900 text-white">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(search || category || stockFilter !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-purple-950 text-xs text-slate-300">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Active:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950 border border-purple-800 text-purple-200 font-medium">
                  Search: "{search}"
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950 border border-purple-800 text-purple-200 font-medium">
                  Category: {CATEGORY_OPTIONS.find((c) => c.value === category)?.label || category}
                </span>
              )}
              {stockFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950 border border-purple-800 text-purple-200 font-medium">
                  Filter: {stockFilter === 'instock' ? 'In Stock' : 'Pre-order'}
                </span>
              )}
              <button
                onClick={resetFilters}
                className="ml-auto text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Product Grid / States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-slate-900 rounded-2xl h-80 border border-purple-900/40 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-rose-900/60 shadow-sm">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <p className="text-white font-bold">{error}</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-500"
            >
              Reset & Try Again
            </button>
          </div>
        ) : products.length > 0 ? (
          <div>
            <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Showing {products.length} {products.length === 1 ? 'part' : 'parts'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-dashed border-purple-900/60 p-8 shadow-sm">
            <PackageCheck className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No matching parts found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
              We couldn't find items matching your search or filters. Try adjusting your query or resetting category filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

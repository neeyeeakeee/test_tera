import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, Search, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth-context.jsx';
import { api } from '../lib/api.js';

const STATUS_CONFIG = {
  awaiting_payment: {
    label: 'Awaiting Payment',
    color: 'bg-purple-950 text-purple-300 border-purple-800',
    icon: Clock,
    step: 1
  },
  processing: {
    label: 'Processing & Picked',
    color: 'bg-blue-950 text-blue-300 border-blue-800',
    icon: Package,
    step: 2
  },
  shipped: {
    label: 'Dispatched / In Transit',
    color: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    icon: Truck,
    step: 3
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    icon: CheckCircle2,
    step: 4
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-rose-950 text-rose-300 border-rose-800',
    icon: AlertCircle,
    step: 0
  }
};

export default function Orders() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [lookupOrderNumber, setLookupOrderNumber] = useState(searchParams.get('number') || '');
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserOrders();
      const interval = setInterval(() => {
        fetchUserOrders();
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/orders');
      if (res.ok && res.data?.orders) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError('Unable to load your order history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupOrderNumber.trim() || !lookupEmail.trim()) {
      setLookupError('Please enter both your order number and customer email.');
      return;
    }

    setLookupLoading(true);
    setLookupError('');

    try {
      const res = await api.get(`/api/orders/lookup?order_number=${encodeURIComponent(lookupOrderNumber.trim())}&email=${encodeURIComponent(lookupEmail.trim())}`);
      if (res.ok && res.data?.order) {
        setLookupResult(res.data.order);
      } else {
        setLookupError(res.data?.error || 'No matching order found. Please check your credentials.');
      }
    } catch (err) {
      setLookupError('Network error while looking up order. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  useEffect(() => {
    if (!lookupResult || !lookupOrderNumber || !lookupEmail) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/api/orders/lookup?order_number=${encodeURIComponent(lookupOrderNumber.trim())}&email=${encodeURIComponent(lookupEmail.trim())}`);
        if (res.ok && res.data?.order) {
          setLookupResult(res.data.order);
        }
      } catch (e) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [lookupResult, lookupOrderNumber, lookupEmail]);

  const renderOrderCard = (order) => {
    const statusMeta = STATUS_CONFIG[order.status] || STATUS_CONFIG.awaiting_payment;
    const StatusIcon = statusMeta.icon;

    return (
      <div key={order.id || order.order_number} className="bg-slate-900 rounded-xl shadow-sm border border-purple-900/40 overflow-hidden mb-6 transition-all hover:border-purple-600">
        {/* Header */}
        <div className="bg-slate-950 border-b border-purple-950 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Order Number</p>
              <p className="text-base font-bold text-white font-mono">{order.order_number}</p>
            </div>
            <div className="border-l border-purple-950 pl-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Order Placed</p>
              <p className="text-sm text-slate-300">
                {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
              </p>
            </div>
            <div className="border-l border-purple-950 pl-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total</p>
              <p className="text-sm font-bold text-white">${Number(order.total_amount).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusMeta.label}
            </span>
          </div>
        </div>

        {/* Progress Tracker (unless cancelled) */}
        {order.status !== 'cancelled' && (
          <div className="px-6 py-4 bg-slate-950/50 border-b border-purple-950/60">
            <div className="relative flex justify-between max-w-xl mx-auto my-2">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-purple-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '66%' : order.status === 'processing' ? '33%' : '5%'
                }}
              />
              {[1, 2, 3, 4].map((stepNum) => {
                const currentStep = statusMeta.step;
                const isDone = currentStep >= stepNum;
                const stepLabels = ['Received', 'Processing', 'In Transit', 'Delivered'];
                return (
                  <div key={stepNum} className="relative z-10 flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isDone ? 'bg-purple-600 text-white font-black' : 'bg-slate-950 border-2 border-slate-700 text-slate-400'}`}>
                      {stepNum}
                    </div>
                    <span className={`text-[11px] mt-1 font-medium ${isDone ? 'text-white font-semibold' : 'text-slate-400'}`}>
                      {stepLabels[stepNum - 1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Ordered Auto Parts</h4>
              {order.items && order.items.length > 0 ? (
                <div className="divide-y divide-purple-950/60 border border-purple-900/40 rounded-lg overflow-hidden bg-slate-950">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-900 border border-purple-900/40 flex items-center justify-center text-purple-300 shrink-0 font-bold text-xs">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.product_name}</p>
                          <p className="text-xs text-slate-400">${Number(item.price_each).toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        ${(Number(item.price_each) * Number(item.quantity)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Part details available upon dispatch.</p>
              )}
            </div>

            {/* Shipping Column */}
            <div className="bg-slate-950 rounded-lg p-4 border border-purple-900/40 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-purple-400" /> Shipping Destination
              </div>
              <p className="font-semibold text-white">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
              {order.customer_phone && <p className="text-slate-400">Phone: {order.customer_phone}</p>}
              <p className="text-slate-400">Updates sent to: {order.customer_email}</p>
              {order.notes && (
                <div className="mt-3 pt-3 border-t border-purple-950">
                  <span className="font-semibold text-slate-200">Delivery Notes:</span>
                  <p className="italic text-slate-400">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Track & Review Orders</h1>
            <p className="text-slate-300 mt-1">Monitor your vehicle parts delivery and order statuses in real-time.</p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-white bg-purple-950 hover:bg-purple-900 px-4 py-2 rounded-lg transition-colors border border-purple-800"
          >
            Browse Catalog <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* If Logged in */}
        {user ? (
          <div>
            {loading ? (
              <div className="bg-slate-900 rounded-xl p-12 text-center border border-purple-900/40">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-300 font-medium">Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="bg-rose-950/60 border border-rose-800 rounded-xl p-6 text-center text-rose-300">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                <p className="font-medium">{error}</p>
                <button
                  onClick={fetchUserOrders}
                  className="mt-3 px-4 py-1.5 bg-rose-600 text-white rounded text-sm font-semibold hover:bg-rose-700"
                >
                  Try Again
                </button>
              </div>
            ) : orders.length > 0 ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Your Orders ({orders.length})</h2>
                  <span className="text-xs text-slate-400">Auto-updated with our warehouse</span>
                </div>
                {orders.map((ord) => renderOrderCard(ord))}
              </div>
            ) : (
              <div className="bg-slate-900 rounded-xl p-12 text-center border border-purple-900/40 shadow-sm">
                <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No orders placed yet</h3>
                <p className="text-slate-300 max-w-md mx-auto mb-6">
                  You haven't ordered any vehicle parts under this account. Explore our full inventory to pre-order what you need.
                </p>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  Browse Auto Parts <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* Guest or Logged-out view */
          <div className="space-y-8">
            {/* Guest Lookup Form */}
            <div className="bg-slate-900 rounded-xl shadow-sm border border-purple-900/40 p-6 md:p-8">
              <div className="max-w-xl mx-auto text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Instant Order Lookup</h2>
                <p className="text-slate-300 text-sm mt-1">
                  Placed an order as a guest? Enter your Quick Mechs order number and your contact email below.
                </p>
              </div>

              <form onSubmit={handleLookup} className="max-w-xl mx-auto space-y-4">
                {lookupError && (
                  <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    {lookupError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Order Number
                    </label>
                    <input
                      type="text"
                      value={lookupOrderNumber}
                      onChange={(e) => setLookupOrderNumber(e.target.value)}
                      placeholder="QM-12345678"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm font-mono focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Billing / Shipping Email
                    </label>
                    <input
                      type="email"
                      value={lookupEmail}
                      onChange={(e) => setLookupEmail(e.target.value)}
                      placeholder="driver@example.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {lookupLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" /> Track This Order
                    </>
                  )}
                </button>
              </form>

              {lookupResult && (
                <div className="mt-8 pt-6 border-t border-purple-950">
                  <h3 className="text-base font-bold text-white mb-4">Search Result</h3>
                  {renderOrderCard(lookupResult)}
                </div>
              )}
            </div>

            {/* Sign in Prompt */}
            <div className="bg-gradient-to-r from-slate-900 to-purple-950/80 rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-purple-900/40">
              <div>
                <h3 className="text-lg font-bold">Have an Account with Quick Mechs?</h3>
                <p className="text-slate-300 text-sm mt-1 max-w-lg">
                  Log in to automatically view your complete order history, track live dispatch progress, and access faster checkout.
                </p>
              </div>
              <Link
                to="/login?redirect=/orders"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-sm shrink-0 transition-colors"
              >
                Sign In to Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

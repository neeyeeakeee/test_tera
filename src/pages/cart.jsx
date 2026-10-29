import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { useCart } from '../lib/cart-context.jsx';
import { useAuth } from '../lib/auth-context.jsx';
import { api } from '../lib/api.js';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('GA');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const shippingFee = subtotal > 150 || subtotal === 0 ? 0.0 : 12.0;
  const estimatedTax = subtotal * 0.07;
  const orderTotal = subtotal + shippingFee + estimatedTax;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) {
      setErrorMsg('Your cart is empty. Please add parts before checking out.');
      return;
    }

    if (!name.trim() || !email.trim() || !address.trim() || !city.trim() || !zip.trim()) {
      setErrorMsg('Please complete all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        shipping_address: address.trim(),
        shipping_city: city.trim(),
        shipping_state: state.trim() || 'GA',
        shipping_zip: zip.trim(),
        notes: notes.trim(),
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const res = await api.post('/api/checkout', payload);

      if (res.ok && res.data?.url) {
        clearCart();
        window.location.href = res.data.url;
        return;
      }

      if (res.ok && res.data?.order_number) {
        const createdOrder = res.data;
        clearCart();
        navigate(`/order-confirmation?order=${encodeURIComponent(createdOrder.order_number)}`, {
          state: { order: createdOrder }
        });
      } else {
        setErrorMsg(res.data?.error || 'Unable to submit your order. Please check inputs.');
      }
    } catch (err) {
      setErrorMsg('Network error. Unable to reach the order processing server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center bg-slate-900 rounded-3xl p-12 border border-purple-900/40 shadow-sm">
          <div className="w-16 h-16 bg-purple-950 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-800">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Your Cart is Empty</h1>
          <p className="text-slate-300 text-sm mt-2 max-w-md mx-auto">
            Explore our inventory of brake components, diagnostic sensors, batteries, and engine parts for instant dispatch or pre-order.
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition shadow-sm"
          >
            Browse Parts Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Shopping Cart & Pre-Order Checkout
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Review your selected vehicle parts and provide your shipping address to finalize your order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 rounded-2xl border border-purple-900/40 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-purple-950 mb-4">
                <h2 className="font-bold text-white text-base">
                  Selected Parts ({itemCount})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-purple-950/60">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center">
                    <img
                      src={item.image_url || '/assets/mechanic-checking-car-engine-in-a-clean-garage-kwey.svg'}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-950 border border-purple-900/40 shrink-0"
                      width="80"
                      height="80"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-bold text-white hover:text-purple-400 text-sm truncate block transition"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Category: {item.category} {item.part_number ? `• Part #${item.part_number}` : ''}
                      </div>
                      <div className="text-sm font-black text-white mt-1.5">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-purple-900/50 rounded-lg p-1 bg-slate-950">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center transition"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center transition"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 transition rounded-lg hover:bg-rose-950/40"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-200 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Pre-Order & Stock Assurance:</span> In-stock items are prepared immediately at our Atlanta hub. High-demand pre-order parts reserve your priority dispatch sequence.
              </div>
            </div>
          </div>

          {/* Shipping Address and Order Summary Form */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-2xl border border-purple-900/40 p-6 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 pb-4 border-b border-purple-950 mb-4">
                <MapPin className="w-5 h-5 text-purple-400" />
                <h2 className="font-bold text-white text-base">
                  Shipping Address & Delivery
                </h2>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-900/50 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="marcus@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-purple-900/50 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="404-555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-purple-900/50 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123 Peachtree St NE"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-900/50 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Atlanta"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-900/50 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="GA"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-900/50 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="30303"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-900/50 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Delivery or Mechanic Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Gate code, specific vehicle model, or driveway instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-900/50 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                {/* Cost Breakdown */}
                <div className="pt-4 border-t border-purple-950 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Parts Subtotal</span>
                    <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dispatch & Shipping</span>
                    <span className="font-bold text-white">
                      {shippingFee === 0 ? 'FREE (Orders over $150)' : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (GA 7%)</span>
                    <span className="font-bold text-white">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-purple-950 text-sm font-black text-white">
                    <span>Estimated Total</span>
                    <span className="text-purple-400 text-base">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3.5 rounded-xl shadow-md transition duration-150 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Pre-Order...' : 'Place Pre-Order / Reserve Parts'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Your order will be securely logged as 'Awaiting Payment' and our team will contact you with tracking details.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

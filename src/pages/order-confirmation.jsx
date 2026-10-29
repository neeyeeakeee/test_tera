import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
  FileText
} from 'lucide-react';
import { api } from '../lib/api.js';

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const orderNumber = searchParams.get('order');

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order && Boolean(orderNumber));

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (orderNumber) {
      async function verifyAndFetchOrder() {
        try {
          if (sessionId) {
            await api.post('/api/verify-checkout', { order_number: orderNumber, session_id: sessionId });
          }
          const res = await api.get(`/api/orders/${orderNumber}`);
          if (res.ok && res.data?.order) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.error('Failed to verify/load order confirmation:', err);
        } finally {
          setLoading(false);
        }
      }
      verifyAndFetchOrder();
    }
  }, [orderNumber, searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-3xl border border-purple-900/40 shadow-sm p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-800">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-700">
            Pre-Order Confirmed
          </span>

          <h1 className="text-3xl font-black text-white mt-4 tracking-tight">
            Thank You For Your Order!
          </h1>

          <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto">
            We have received your order request and reserved your parts at our Quick Mechs distribution network.
          </p>

          {/* Order Details Box */}
          <div className="mt-8 p-6 bg-slate-950 rounded-2xl border border-purple-900/40 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-purple-950">
              <div>
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">
                  Order Reference Number
                </span>
                <span className="text-lg font-mono font-black text-white">
                  {order?.order_number || orderNumber || 'QM-PROCESSING'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">
                  Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-950 text-purple-300 border border-purple-700">
                  <Clock className="w-3.5 h-3.5" />
                  {order?.status ? order.status.replace('_', ' ').toUpperCase() : 'AWAITING PAYMENT'}
                </span>
              </div>
            </div>

            {order?.customer_name && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div>
                  <span className="font-bold text-white block mb-1">Delivery Destination</span>
                  <p>{order.customer_name}</p>
                  <p>{order.shipping_address}</p>
                  <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                </div>
                <div>
                  <span className="font-bold text-white block mb-1">Notification Contact</span>
                  <p>{order.customer_email}</p>
                  {order.customer_phone && <p>{order.customer_phone}</p>}
                  {order.total_amount && (
                    <p className="mt-2 font-black text-sm text-white">
                      Total: ${Number(order.total_amount).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Next Steps Guidelines */}
          <div className="mt-8 text-left grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                <PackageCheck className="w-4 h-4 text-purple-400" /> 1. Stock Allocation
              </div>
              <p className="text-slate-400 leading-relaxed">
                Inventory is locked to your order number to prevent stockouts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                <Truck className="w-4 h-4 text-blue-400" /> 2. Dispatch Prep
              </div>
              <p className="text-slate-400 leading-relaxed">
                Orders are packed at our Atlanta facility for courier or driveway delivery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3. Verification
              </div>
              <p className="text-slate-400 leading-relaxed">
                Receive status updates directly through your account dashboard.
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 border border-purple-900/60"
            >
              <FileText className="w-4 h-4" /> View My Orders
            </Link>
            <Link
              to="/catalog"
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

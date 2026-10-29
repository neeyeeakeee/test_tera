import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  Clock,
  Truck,
  Filter,
  Layers,
  DollarSign,
  Users
} from 'lucide-react';
import { useAuth } from '../lib/auth-context.jsx';
import { api } from '../lib/api.js';

const CATEGORIES = [
  'Brakes & Rotors',
  'Batteries & Electrical',
  'Diagnostics & Sensors',
  'Engine & Performance',
  'Suspension & Steering',
  'Filters & Maintenance'
];

const STATUS_OPTIONS = [
  { value: 'awaiting_payment', label: 'Awaiting Payment' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Dispatched / In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Brakes & Rotors',
    description: '',
    price: '',
    stock: '10',
    part_number: '',
    vehicle_fitment: '',
    image_url: ''
  });
  const [productSaveError, setProductSaveError] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  const [stockEdits, setStockEdits] = useState({});
  const [stockUpdating, setStockUpdating] = useState({});

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState({});

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await api.get('/api/products?limit=100');
      if (res.ok && res.data?.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/api/orders');
      if (res.ok && res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      category: 'Brakes & Rotors',
      description: '',
      price: '',
      stock: '10',
      part_number: '',
      vehicle_fitment: '',
      image_url: '/assets/mechanic-changing-brake-pads-on-a-vehicle-wny3.svg'
    });
    setProductSaveError('');
    setProductFormOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: String(prod.price),
      stock: String(prod.stock),
      part_number: prod.part_number || '',
      vehicle_fitment: prod.vehicle_fitment || '',
      image_url: prod.image_url || ''
    });
    setProductSaveError('');
    setProductFormOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setProductSaveError('');
    setSavingProduct(true);

    const payload = {
      name: productFormData.name.trim(),
      category: productFormData.category,
      description: productFormData.description.trim(),
      price: parseFloat(productFormData.price),
      stock: parseInt(productFormData.stock, 10) || 0,
      part_number: productFormData.part_number.trim(),
      vehicle_fitment: productFormData.vehicle_fitment.trim(),
      image_url: productFormData.image_url.trim()
    };

    try {
      let res;
      if (editingProduct) {
        res = await api.put(`/api/products/${editingProduct.id}`, payload);
      } else {
        res = await api.post('/api/products', payload);
      }

      if (res.ok) {
        setProductFormOpen(false);
        fetchProducts();
      } else {
        setProductSaveError(res.data?.error || 'Failed to save product changes.');
      }
    } catch (err) {
      setProductSaveError('Network error occurred while saving.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) return;
    try {
      const res = await api.delete(`/api/products/${id}`);
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(res.data?.error || 'Failed to delete product.');
      }
    } catch (err) {
      alert('Network error while deleting product.');
    }
  };

  const handleStockQuickUpdate = async (productId) => {
    const newStock = stockEdits[productId];
    if (newStock === undefined || newStock === '') return;

    setStockUpdating((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await api.put(`/api/products/${productId}`, {
        stock: parseInt(newStock, 10)
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: parseInt(newStock, 10) } : p))
        );
        setStockEdits((prev) => {
          const copy = { ...prev };
          delete copy[productId];
          return copy;
        });
      } else {
        alert('Failed to update stock');
      }
    } catch (e) {
      alert('Error updating stock');
    } finally {
      setStockUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderStatus((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await api.put(`/api/orders/${orderId}/status`, {
        status: newStatus
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
        );
      } else {
        alert(res.data?.error || 'Failed to update order status');
      }
    } catch (e) {
      alert('Error saving status update');
    } finally {
      setUpdatingOrderStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-950">
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-purple-900/60 p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-rose-950 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-800">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Restricted Access</h2>
          <p className="text-slate-300 text-sm mb-6">
            The admin control panel is reserved for verified Quick Mechs shop managers and administrators.
          </p>
          <Link
            to="/login?redirect=/admin"
            className="w-full inline-block py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Sign In as Admin
          </Link>
        </div>
      </div>
    );
  }

  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total_amount) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-700">
                Manager Panel
              </span>
              <span className="text-xs text-slate-400">Signed in as {user.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Quick Mechs Inventory & Orders
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-sm shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New Auto Part
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl p-5 border border-purple-900/40 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Catalog Parts</p>
              <h3 className="text-2xl font-black text-white">{products.length}</h3>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-purple-900/40 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/60 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Low Stock (≤ 5)</p>
              <h3 className="text-2xl font-black text-rose-400">{lowStockCount}</h3>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-purple-900/40 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Orders Placed</p>
              <h3 className="text-2xl font-black text-white">{orders.length}</h3>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-purple-900/40 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pre-Order Volume</p>
              <h3 className="text-2xl font-black text-white">${totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-purple-900/40 overflow-hidden mb-8">
          <div className="flex border-b border-purple-950 bg-slate-950 px-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-purple-500 text-white bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" /> Auto Parts Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-purple-500 text-white bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Pre-Orders & Fulfillment ({orders.length})
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              {productsLoading ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Loading parts catalog...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-base font-medium mb-4">No parts currently in the catalog.</p>
                  <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm"
                  >
                    Add Your First Item
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-purple-950">
                      <tr>
                        <th className="py-3.5 px-6">Part Details</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Stock Available</th>
                        <th className="py-3.5 px-4">Fitment / PN</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-950/40">
                      {products.map((prod) => {
                        const isEditingThisStock = stockEdits[prod.id] !== undefined;
                        const currentStockVal = isEditingThisStock ? stockEdits[prod.id] : prod.stock;

                        return (
                          <tr key={prod.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.image_url || '/assets/mechanic-checking-car-engine-in-a-clean-garage-kwey.svg'}
                                  alt={prod.name}
                                  className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-purple-900/40 shrink-0"
                                />
                                <div>
                                  <Link
                                    to={`/product/${prod.id}`}
                                    className="font-bold text-white hover:text-purple-400 line-clamp-1"
                                  >
                                    {prod.name}
                                  </Link>
                                  <p className="text-xs text-slate-400 line-clamp-1">{prod.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded text-xs font-medium bg-slate-950 text-purple-300 border border-purple-900/50">
                                {prod.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                              ${Number(prod.price).toFixed(2)}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min="0"
                                  value={currentStockVal}
                                  onChange={(e) =>
                                    setStockEdits((prev) => ({
                                      ...prev,
                                      [prod.id]: e.target.value
                                    }))
                                  }
                                  className={`w-20 px-2 py-1 text-xs border rounded font-mono font-bold focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                                    prod.stock <= 5
                                      ? 'border-rose-500 bg-rose-950/60 text-rose-200'
                                      : 'border-purple-900/60 bg-slate-950 text-white'
                                  }`}
                                />
                                {isEditingThisStock && (
                                  <button
                                    onClick={() => handleStockQuickUpdate(prod.id)}
                                    disabled={stockUpdating[prod.id]}
                                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs transition-colors"
                                    title="Save Stock Count"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">
                              <p className="font-mono text-purple-300">{prod.part_number || 'Universal'}</p>
                              <p className="truncate max-w-[150px]">{prod.vehicle_fitment || 'Multi-Vehicle'}</p>
                            </td>
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenEdit(prod)}
                                  className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded transition-colors"
                                  title="Edit Item Details"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Loading customer orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-base font-medium">No customer orders received yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-purple-950">
                      <tr>
                        <th className="py-3.5 px-6">Order #</th>
                        <th className="py-3.5 px-4">Customer / Destination</th>
                        <th className="py-3.5 px-4">Date Placed</th>
                        <th className="py-3.5 px-4">Total</th>
                        <th className="py-3.5 px-6">Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-950/40">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-4 px-6 whitespace-nowrap font-mono font-bold text-white">
                            {ord.order_number}
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-white">{ord.customer_name}</p>
                            <p className="text-xs text-slate-400">{ord.customer_email}</p>
                            <p className="text-xs text-slate-400">
                              {ord.shipping_city}, {ord.shipping_state}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">
                            {new Date(ord.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                            ${Number(ord.total_amount).toFixed(2)}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <select
                              value={ord.status}
                              disabled={updatingOrderStatus[ord.id]}
                              onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                              className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                  : ord.status === 'shipped'
                                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                                  : ord.status === 'processing'
                                  ? 'bg-blue-950 text-blue-300 border-blue-700'
                                  : ord.status === 'cancelled'
                                  ? 'bg-rose-950 text-rose-300 border-rose-700'
                                  : 'bg-purple-950 text-purple-300 border-purple-700'
                              }`}
                            >
                              {STATUS_OPTIONS.map((st) => (
                                <option key={st.value} value={st.value}>
                                  {st.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {productFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-purple-900/60 max-w-2xl w-full overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-950 bg-slate-950">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? 'Edit Auto Part' : 'Add New Auto Part'}
              </h3>
              <button
                onClick={() => setProductFormOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              {productSaveError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{productSaveError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Part Name / Title
                </label>
                <input
                  type="text"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="e.g. Premium Ceramic Front Brake Pads"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-sm text-white focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-sm text-white focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Manufacturer Part Number (MPN)
                  </label>
                  <input
                    type="text"
                    value={productFormData.part_number}
                    onChange={(e) => setProductFormData({ ...productFormData, part_number: e.target.value })}
                    placeholder="e.g. QM-BP-8921"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-sm font-mono text-white focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Selling Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    placeholder="89.99"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-sm text-white focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    placeholder="15"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-sm text-white focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Vehicle Fitment / Compatibility
                </label>
                <input
                  type="text"
                  value={productFormData.vehicle_fitment}
                  onChange={(e) => setProductFormData({ ...productFormData, vehicle_fitment: e.target.value })}
                  placeholder="e.g. Universal / Fits most 2012-2024 Sedans & SUVs"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-sm text-white focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Product Image (Owner Asset Path)
                </label>
                <select
                  value={productFormData.image_url}
                  onChange={(e) => setProductFormData({ ...productFormData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-sm text-white focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="/assets/mechanic-changing-brake-pads-on-a-vehicle-wny3.svg">
                    Brake Pads Illustration (/assets/mechanic-changing-brake-pads-on-a-vehicle-wny3.svg)
                  </option>
                  <option value="/assets/mechanic-replacing-car-battery-outdoors-1424.svg">
                    Battery Replacement (/assets/mechanic-replacing-car-battery-outdoors-1424.svg)
                  </option>
                  <option value="/assets/mobile-mechanic-doing-diagnostic-test-on-car-5kup.svg">
                    OBD-II Diagnostic Device (/assets/mobile-mechanic-doing-diagnostic-test-on-car-5kup.svg)
                  </option>
                  <option value="/assets/mechanic-checking-car-engine-in-a-clean-garage-kwey.svg">
                    Engine Components (/assets/mechanic-checking-car-engine-in-a-clean-garage-kwey.svg)
                  </option>
                  <option value="/assets/car-engine-repair-on-the-road-hpfr.svg">
                    Alternators & Roadside Parts (/assets/car-engine-repair-on-the-road-hpfr.svg)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Detailed Specifications & Description
                </label>
                <textarea
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  placeholder="Provide dimensions, material specifications, and installation tips for mechanics and drivers..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-sm text-white focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-purple-950">
                <button
                  type="button"
                  onClick={() => setProductFormOpen(false)}
                  className="px-4 py-2 border border-purple-900/60 text-slate-300 font-semibold rounded-lg text-sm hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  {savingProduct ? 'Saving...' : editingProduct ? 'Update Part' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

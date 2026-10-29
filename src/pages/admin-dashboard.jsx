import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Phone, Mail, Calendar, MapPin, CheckCircle2, Clock, XCircle, LogOut, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { getAdminMe, getServiceRequests, updateServiceRequestStatus, getContactMessages, logoutAdmin } from '../lib/api.js';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const meRes = await getAdminMe();
      if (!meRes.ok) {
        navigate('/admin/login');
        return;
      }
      setAdmin(meRes.data.user);

      const [reqRes, msgRes] = await Promise.all([
        getServiceRequests(),
        getContactMessages()
      ]);

      if (reqRes.ok) setRequests(reqRes.data.requests || []);
      if (msgRes.ok) setMessages(msgRes.data.messages || []);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdating(id);
    try {
      const res = await updateServiceRequestStatus(id, newStatus);
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  if (loading && !admin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-500 mr-2" />
        <span>Loading Admin Workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Dashboard Topbar */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-700/50 flex items-center justify-center text-purple-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-wide">Quick Mechs</span>
              <span className="ml-2 text-xs uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">Operations Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400 hidden sm:inline">Logged in as <strong className="text-neutral-200">{admin?.name || admin?.email}</strong></span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Pending Dispatch</span>
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {requests.filter(r => r.status === 'pending').length}
            </p>
            <p className="text-xs text-neutral-500 mt-1">Awaiting initial call or mechanic dispatch</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Total Bookings</span>
              <Wrench className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{requests.length}</p>
            <p className="text-xs text-neutral-500 mt-1">All on-demand service submissions</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">General Inquiries</span>
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{messages.length}</p>
            <p className="text-xs text-neutral-500 mt-1">Messages submitted via contact form</p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex border-b border-neutral-800 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'requests'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Service & Quote Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'messages'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Contact Messages ({messages.length})
          </button>
        </div>

        {/* Tab 1: Service Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-500">
                <p>No customer service requests received yet.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col lg:flex-row gap-6 justify-between"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{req.name}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        req.status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        req.status === 'in-progress' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        req.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(req.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-neutral-300">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-neutral-500" />
                        <a href={`tel:${req.phone}`} className="hover:text-purple-400 font-mono">{req.phone}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-500" />
                        <a href={`mailto:${req.email}`} className="hover:text-purple-400">{req.email}</a>
                      </div>
                      {req.address && (
                        <div className="flex items-center gap-2 text-neutral-400">
                          <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                          <span className="truncate">{req.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800/80">
                      <div className="text-xs font-semibold uppercase text-purple-400 mb-1">
                        Vehicle & Issue Description
                      </div>
                      <div className="text-sm text-neutral-200">
                        <strong>{[req.vehicle_year, req.vehicle_make, req.vehicle_model].filter(Boolean).join(' ') || 'Unspecified Vehicle'}</strong>: {req.issue}
                      </div>
                      {req.notes && (
                        <div className="text-xs text-neutral-400 mt-2 italic">
                          Client note: "{req.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex lg:flex-col items-center justify-end gap-2 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-4 lg:pt-0 lg:pl-6">
                    <span className="text-xs text-neutral-500 block mb-1 font-semibold uppercase">Change Status:</span>
                    <div className="flex flex-wrap lg:flex-col gap-1.5 w-full">
                      {['pending', 'in-progress', 'completed', 'cancelled'].map((st) => (
                        <button
                          key={st}
                          disabled={statusUpdating === req.id || req.status === st}
                          onClick={() => handleStatusChange(req.id, st)}
                          className={`text-xs px-3 py-1.5 rounded-lg border text-left font-medium capitalize transition-colors ${
                            req.status === st
                              ? 'bg-purple-900/40 border-purple-700 text-purple-200 cursor-default'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                          }`}
                        >
                          Mark {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Contact Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-500">
                <p>No contact inquiries received yet.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{msg.name}</h3>
                      <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1">
                        <a href={`mailto:${msg.email}`} className="hover:text-purple-400">{msg.email}</a>
                        {msg.phone && <a href={`tel:${msg.phone}`} className="hover:text-purple-400">{msg.phone}</a>}
                      </div>
                    </div>
                    <span className="text-xs text-neutral-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  {msg.subject && <div className="text-xs font-semibold text-purple-400">Subject: {msg.subject}</div>}
                  <p className="text-sm text-neutral-300 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
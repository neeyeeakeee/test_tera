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
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-900 mr-2" />
        <span>Loading Admin Workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-base tracking-wide">Quick Mechs</span>
              <span className="ml-2 text-xs uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-900 border border-gray-200 font-semibold">Operations Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 hidden sm:inline">Logged in as <strong className="text-gray-900">{admin?.name || admin?.email}</strong></span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors border border-gray-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Pending Dispatch</span>
              <Clock className="w-5 h-5 text-gray-900" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {requests.filter(r => r.status === 'pending').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Awaiting initial call or mechanic dispatch</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Total Bookings</span>
              <Wrench className="w-5 h-5 text-gray-800" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{requests.length}</p>
            <p className="text-xs text-gray-500 mt-1">All on-demand service submissions</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">General Inquiries</span>
              <MessageSquare className="w-5 h-5 text-gray-700" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{messages.length}</p>
            <p className="text-xs text-gray-500 mt-1">Messages submitted via contact form</p>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 font-bold text-sm transition-colors border-b-2 ${
              activeTab === 'requests'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Service & Quote Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 font-bold text-sm transition-colors border-b-2 ${
              activeTab === 'messages'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Contact Messages ({messages.length})
          </button>
        </div>

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-200 rounded-2xl text-gray-500 shadow-sm">
                <p>No customer service requests received yet.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all shadow-sm flex flex-col lg:flex-row gap-6 justify-between"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{req.name}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        req.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        req.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        req.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(req.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${req.phone}`} className="hover:text-gray-900 font-mono">{req.phone}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${req.email}`} className="hover:text-gray-900">{req.email}</a>
                      </div>
                      {req.address && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{req.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                      <div className="text-xs font-bold uppercase text-gray-900 mb-1">
                        Vehicle & Issue Description
                      </div>
                      <div className="text-sm text-gray-900">
                        <strong>{[req.vehicle_year, req.vehicle_make, req.vehicle_model].filter(Boolean).join(' ') || 'Unspecified Vehicle'}</strong>: {req.issue}
                      </div>
                      {req.notes && (
                        <div className="text-xs text-gray-500 mt-2 italic">
                          Client note: "{req.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex lg:flex-col items-center justify-end gap-2 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                    <span className="text-xs text-gray-500 block mb-1 font-bold uppercase">Change Status:</span>
                    <div className="flex flex-wrap lg:flex-col gap-1.5 w-full">
                      {['pending', 'in-progress', 'completed', 'cancelled'].map((st) => (
                        <button
                          key={st}
                          disabled={statusUpdating === req.id || req.status === st}
                          onClick={() => handleStatusChange(req.id, st)}
                          className={`text-xs px-3 py-1.5 rounded-xl border text-left font-semibold capitalize transition-colors ${
                            req.status === st
                              ? 'bg-gray-100 border-gray-300 text-gray-900 cursor-default shadow-sm'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-200 rounded-2xl text-gray-500 shadow-sm">
                <p>No contact inquiries received yet.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-6 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{msg.name}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <a href={`mailto:${msg.email}`} className="hover:text-gray-900">{msg.email}</a>
                        {msg.phone && <a href={`tel:${msg.phone}`} className="hover:text-gray-900">{msg.phone}</a>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  {msg.subject && <div className="text-xs font-bold text-gray-900">Subject: {msg.subject}</div>}
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200">
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
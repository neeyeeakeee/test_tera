import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Shield, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { loginAdmin } from '../lib/api.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginAdmin({ email, password });
      if (res.ok) {
        navigate('/admin/dashboard');
      } else {
        setError(res.data?.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 mb-3 shadow-sm">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quick Mechs Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to review mobile repair requests & messages</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@quickmechs.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all text-sm"
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link to="/" className="text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium">
            ← Back to Quick Mechs Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
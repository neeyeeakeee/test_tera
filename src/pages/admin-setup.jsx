import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Lock, Mail, User, KeyRound } from 'lucide-react';
import { checkAdminSetup, setupAdmin } from '../lib/api.js';

export default function AdminSetupPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [token, setToken] = useState(tokenFromUrl);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isOpen, setIsOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  useEffect(() => {
    async function verifySetupState() {
      const res = await checkAdminSetup();
      if (res.ok && res.data) {
        setIsOpen(Boolean(res.data.open));
      } else {
        setIsOpen(false);
      }
    }
    verifySetupState();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const res = await setupAdmin({
        token: token.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (res.ok) {
        setStatus({
          type: 'success',
          message: 'Admin account created successfully! Redirecting to login...'
        });
        setTimeout(() => {
          navigate('/admin/login');
        }, 1500);
      } else {
        setStatus({
          type: 'error',
          message: res.data?.error || 'Admin setup failed. Please verify your token.'
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'A network error occurred during setup.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (isOpen === null) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
        <p className="text-neutral-400 text-sm">Verifying setup status...</p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Setup Unavailable</h1>
          <p className="text-sm text-neutral-400 mt-2">
            An administrator has already been registered or setup is currently closed.
          </p>
          <div className="mt-6">
            <Link
              to="/admin/login"
              className="inline-block px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors"
            >
              Go to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 py-16">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-purple-950/80 border border-purple-800/50 text-purple-400 mx-auto flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Initial Admin Setup</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Create the primary owner account for Quick Mechs dashboard
          </p>
        </div>

        {status.type && (
          <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 border text-xs ${
            status.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/60 border-rose-800 text-rose-200'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Setup Token *
            </label>
            <input
              type="password"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Provided setup token"
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Owner Name"
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-600 pl-10"
              />
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Admin Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@quickmechs.com"
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-600 pl-10"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Password (Min 8 Characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-600 pl-10"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-purple-950/60 mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Admin Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth-context.jsx';

export default function AdminSetup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const tokenFromUrl = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromUrl);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isOpen, setIsOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const res = await api.get('/api/admin-setup');
      if (res.ok && res.data?.open !== undefined) {
        setIsOpen(res.data.open);
      } else {
        setIsOpen(false);
      }
    } catch (err) {
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Setup invite token is required.');
      return;
    }
    if (password.length < 8) {
      setError('Admin password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/api/admin-setup', {
        token: token.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (res.ok && res.data?.user) {
        setSuccess(true);
        await refreshUser();
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setError(res.data?.error || 'Unable to complete admin setup. Please verify your token.');
      }
    } catch (err) {
      setError('Network or server error during admin initialization.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isOpen === false) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-950">
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-purple-900/60 p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-slate-950 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-800">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Admin Account Configured</h2>
          <p className="text-slate-300 text-sm mb-6">
            The primary administrator for Quick Mechs has already been initialized. Please use the standard login page with your admin credentials.
          </p>
          <Link
            to="/login"
            className="w-full inline-block py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Quick Mechs Admin Initialization</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create the first owner / administrator account using your system secret token.
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-sm border border-purple-900/60 p-6 sm:p-8">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Administrator Initialized!</h3>
              <p className="text-slate-300 text-sm mt-1">Redirecting you to the management dashboard now...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs sm:text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Setup Invite Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste platform admin setup token"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm font-mono focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Administrator Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Store Owner"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@quickmechs.com"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password (Min 8)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Create Master Admin Account'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

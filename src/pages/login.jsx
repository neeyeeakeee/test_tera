import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, KeyRound, Mail, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth-context.jsx';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();

  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState(defaultTab);
  const redirectPath = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-950 text-slate-100">
        <div className="bg-slate-900 rounded-xl shadow-sm border border-purple-900/60 p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-800">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Already Signed In</h2>
          <p className="text-slate-300 text-sm mb-6">You are logged in as <span className="font-semibold text-white">{user.email}</span> ({user.role}).</p>
          <div className="space-y-3">
            <Link
              to={redirectPath}
              className="w-full block py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
            >
              Continue to App
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="w-full block py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors text-sm border border-purple-900/60"
              >
                Go to Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setSubmitting(true);
      const res = await signup(name.trim(), email.trim(), password);
      setSubmitting(false);
      if (res.ok) {
        navigate(redirectPath);
      } else {
        setError(res.error || 'Failed to create your account.');
      }
    } else {
      setSubmitting(true);
      const res = await login(email.trim(), password);
      setSubmitting(false);
      if (res.ok) {
        navigate(redirectPath);
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
              QM
            </div>
            <span className="text-2xl font-black tracking-tight text-white">Quick Mechs</span>
          </Link>
          <p className="text-slate-400 text-sm">
            {mode === 'login' ? 'Sign in to access your pre-orders and parts tracking.' : 'Create an account for fast checkout and auto parts tracking.'}
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-purple-900/60 overflow-hidden">
          {/* Tab switches */}
          <div className="flex border-b border-purple-950 bg-slate-950">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3.5 text-sm font-bold text-center border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-purple-500 text-white bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-3.5 text-sm font-bold text-center border-b-2 transition-colors ${
                mode === 'signup'
                  ? 'border-purple-500 text-white bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs sm:text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Carter"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@example.com"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  {mode === 'signup' && (
                    <span className="text-[11px] text-slate-400 font-medium">Min 8 chars</span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-purple-900/50 rounded-lg text-white text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In to Account' : 'Create My Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-purple-950 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-400" /> Encrypted credentials
              </span>
              <span>Atlanta, GA & Nationwide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

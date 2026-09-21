import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Loader2, Lock, Mail } from 'lucide-react';
import { showToast } from '../../components/common/Toast.jsx';

export default function AdminLoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Specification rule #39: If already authenticated, redirect to /admin
  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await login(email.trim(), password);
      if (res.success) {
        showToast("Welcome back to CHIJ's Admin");
        navigate('/admin');
      } else {
        setError(res.message || 'Invalid login credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 px-4 py-12">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <img
          src="/logo.jpg"
          alt="CHIJ's COLLECTION"
          className="h-14 sm:h-16 w-auto object-contain mx-auto mb-3 rounded-lg bg-white p-2 shadow-md"
        />
        <p className="text-xs text-zinc-400 tracking-wider uppercase mt-1">
          Owner & Store Administration
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl">
        {error && (
          <div className="mb-6 p-3.5 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@chijscollection.com"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-accent transition-colors"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-accent transition-colors"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 bg-brand-accent text-zinc-950 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-300 transition-colors shadow-soft disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Sign In to Portal</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-500">
            Protected admin zone. Unauthorized access prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}

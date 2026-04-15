import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, FileText, Settings, LogOut, Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// ── Admin Login Form (shown when not authenticated) ─────────
function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-gold-400/30 rounded-full mb-6">
            <Shield className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-logo text-3xl tracking-[0.2em] text-gold-400 uppercase mb-2">YORU Admin</h1>
          <p className="text-cream/40 text-sm tracking-widest uppercase font-sans">Platform Console Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-darker border border-gold-400/15 p-8 space-y-6">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent -mt-8 mb-6" />

          {error && (
            <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-300 text-sm font-sans tracking-wider">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-cream/50 font-sans">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full bg-dark border border-cream/15 focus:border-gold-400/60 text-cream pl-12 pr-4 py-3.5 outline-none transition-colors text-sm tracking-wider placeholder:text-cream/20 font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-cream/50 font-sans">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark border border-cream/15 focus:border-gold-400/60 text-cream pl-12 pr-12 py-3.5 outline-none transition-colors text-sm tracking-wider placeholder:text-cream/20 font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-400 text-dark py-4 font-serif text-sm tracking-[0.2em] uppercase hover:bg-gold-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : 'Access Console'}
          </button>

          <div className="text-center">
            <Link to="/" className="text-cream/30 text-xs tracking-widest uppercase font-sans hover:text-cream/60 transition-colors">
              ← Return to Website
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Access Denied ───────────────────────────────────────────
function AccessDenied() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 border border-red-500/30 rounded-full mb-6">
          <Shield className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="font-serif text-2xl text-cream tracking-wider mb-4">Access Denied</h1>
        <p className="text-cream/50 font-sans text-sm tracking-wider mb-8">
          Your account does not have administrator privileges. Contact the site owner if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="border border-cream/20 text-cream/70 px-6 py-3 text-sm tracking-widest uppercase font-sans hover:border-gold-400 hover:text-gold-400 transition-colors">
            Go Home
          </Link>
          <button
            onClick={() => signOut()}
            className="border border-cream/20 text-cream/70 px-6 py-3 text-sm tracking-widest uppercase font-sans hover:border-red-400 hover:text-red-400 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Layout ───────────────────────────────────────
export default function AdminLayout() {
  const { user, profile, loading, signOut } = useAuth();
  const location = useLocation();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-gold-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-cream/50 text-sm tracking-widest uppercase font-sans">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // Not logged in → show admin login
  if (!user) {
    return <AdminLoginForm />;
  }

  // Logged in but not admin → access denied
  if (!profile?.is_admin) {
    return <AccessDenied />;
  }

  // Admin → show dashboard
  const navItems = [
    { name: 'Events / Prices', path: '/admin/events', icon: Calendar },
    { name: 'Articles / Subpages', path: '/admin/articles', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-dark w-full overflow-hidden text-cream font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark/90 border-r border-gold-400/20 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gold-400/20 flex items-center mb-6">
          <Shield className="w-6 h-6 text-gold-400 mr-3" />
          <h1 className="font-logo text-xl tracking-[0.2em] text-gold-400 font-bold uppercase">Admin</h1>
        </div>

        {/* User info */}
        <div className="px-6 mb-6">
          <p className="text-cream text-sm tracking-wider truncate">{profile.display_name || user.email}</p>
          <p className="text-cream/40 text-xs tracking-wider truncate">{user.email}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-gold-400/10 text-gold-400 border border-gold-400/30' 
                    : 'text-cream/70 hover:bg-cream/5 hover:text-cream border border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-gold-400' : 'text-cream/50'}`} />
                <span className="text-sm tracking-widest uppercase">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gold-400/20 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-md text-cream/70 hover:bg-cream/5 hover:text-cream transition-colors border border-transparent"
          >
            <LogOut className="w-5 h-5 text-cream/50" />
            <span className="text-sm tracking-widest uppercase">Exit Admin</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-3 px-4 py-3 rounded-md text-cream/40 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm tracking-widest uppercase">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[url('https://images.unsplash.com/photo-1569231290377-072234d3ee57?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-dark/95 backdrop-blur-sm z-0"></div>
        <div className="relative z-10 flex-1 overflow-y-auto w-full">
            <header className="sticky top-0 bg-dark/80 backdrop-blur-md border-b border-gold-400/10 py-5 px-8 flex justify-between items-center z-50">
              <h2 className="font-serif tracking-widest text-xl text-cream uppercase">Platform Database Console</h2>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gold-400 tracking-[0.2em] font-sans px-3 py-1 bg-gold-400/10 rounded-full border border-gold-400/20 uppercase">Admin Role Active</span>
                <div className="w-8 h-8 rounded-full bg-cream/10 border border-gold-400 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-gold-400" />
                </div>
              </div>
            </header>
            <div className="p-8">
              <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
}

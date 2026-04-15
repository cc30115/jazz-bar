import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError(null);
    setSuccessMessage(null);
    setShowPassword(false);
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(err);
        } else {
          onClose();
          resetForm();
        }
      } else {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        const { error: err } = await signUp(email, password, displayName);
        if (err) {
          setError(err);
        } else {
          setSuccessMessage('Account created! Please check your email for the confirmation link.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-darker border border-gold-400/20 shadow-2xl shadow-gold-400/5 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Decorative top bar */}
            <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-cream/40 hover:text-cream transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pt-10 pb-6 px-8 text-center">
              <h2 className="font-logo text-2xl tracking-[0.2em] text-gold-400 uppercase mb-2">YORU</h2>
              <p className="text-cream/50 text-sm tracking-widest uppercase font-sans">
                {mode === 'login' ? 'Welcome Back' : 'Join the Experience'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex mx-8 border-b border-cream/10 mb-8">
              <button
                onClick={() => switchMode('login')}
                className={`flex-1 pb-3 text-sm tracking-[0.2em] uppercase font-sans transition-all border-b-2 ${
                  mode === 'login'
                    ? 'text-gold-400 border-gold-400'
                    : 'text-cream/40 border-transparent hover:text-cream/70'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => switchMode('signup')}
                className={`flex-1 pb-3 text-sm tracking-[0.2em] uppercase font-sans transition-all border-b-2 ${
                  mode === 'signup'
                    ? 'text-gold-400 border-gold-400'
                    : 'text-cream/40 border-transparent hover:text-cream/70'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-300 text-sm font-sans tracking-wider"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Success */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-emerald-300 text-sm font-sans tracking-wider"
                >
                  {successMessage}
                </motion.div>
              )}

              {/* Display Name (sign up only) */}
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs uppercase tracking-widest text-cream/50 font-sans">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-dark border border-cream/15 focus:border-gold-400/60 text-cream pl-12 pr-4 py-3.5 outline-none transition-colors text-sm tracking-wider placeholder:text-cream/20 font-sans"
                    />
                  </div>
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-cream/50 font-sans">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-dark border border-cream/15 focus:border-gold-400/60 text-cream pl-12 pr-4 py-3.5 outline-none transition-colors text-sm tracking-wider placeholder:text-cream/20 font-sans"
                  />
                </div>
              </div>

              {/* Password */}
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
                {mode === 'signup' && (
                  <p className="text-cream/30 text-xs tracking-wider font-sans">Minimum 6 characters</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-400 text-dark py-4 font-serif text-sm tracking-[0.2em] uppercase hover:bg-gold-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-3"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              {/* Footer text */}
              <p className="text-center text-cream/30 text-xs tracking-wider font-sans pt-2">
                {mode === 'login' ? (
                  <>Don't have an account? <button type="button" onClick={() => switchMode('signup')} className="text-gold-400 hover:text-gold-300 transition-colors">Sign up</button></>
                ) : (
                  <>Already a member? <button type="button" onClick={() => switchMode('login')} className="text-gold-400 hover:text-gold-300 transition-colors">Log in</button></>
                )}
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

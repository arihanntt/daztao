'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Google icon (inline SVG — no external deps, no layout shift)
// ─────────────────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

type Mode = 'login' | 'register';

// ─────────────────────────────────────────────────────────────────────────────
// Inner form — reads searchParams for callbackUrl
// ─────────────────────────────────────────────────────────────────────────────
function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setSuccess('');
  };

  // ── Google OAuth — passes callbackUrl so user lands on /checkout ────────────
  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    await signIn('google', { callbackUrl });
  };

  // ── Credentials submit ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Registration failed. Please try again.');
          return;
        }
        setSuccess('Account created. Signing you in...');
        const result = await signIn('credentials', { email, password, redirect: false });
        if (result?.error) {
          setError('Account created. Please sign in.');
          setMode('login');
          return;
        }
      } else {
        const result = await signIn('credentials', { email, password, redirect: false });
        if (result?.error) {
          setError('Incorrect email or password. Please try again.');
          return;
        }
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full h-full max-w-[400px] mx-auto px-6 md:px-0">

      {/* Heading — animates between login/register */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
        >
          <h1 className="text-[34px] md:text-[40px] font-black tracking-tight text-[#1A1A1A] leading-tight mb-2">
            {mode === 'login' ? 'Welcome to Daztao.' : 'Create your account.'}
          </h1>
          <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
            {mode === 'login'
              ? 'Sign in to complete your order and track your keychains.'
              : 'Join Daztao. Get your NFC smart keychain today.'}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Google CTA — primary action */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 h-[52px] rounded-full border border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm transition-all text-[14px] font-semibold text-[#1A1A1A] mb-5 disabled:opacity-60"
        aria-label="Continue with Google"
      >
        {googleLoading
          ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" aria-hidden="true" />
          : <GoogleIcon />
        }
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-5" aria-hidden="true">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Credentials form */}
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>

        {/* Name (register only) */}
        <AnimatePresence initial={false}>
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full h-[52px] rounded-full border border-gray-200 bg-white px-5 text-[14px] text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                aria-label="Full name"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full h-[52px] rounded-full border border-gray-200 bg-white px-5 text-[14px] text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
          aria-label="Email address"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="w-full h-[52px] rounded-full border border-gray-200 bg-white px-5 pr-12 text-[14px] text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
            aria-label="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A1A1A] transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword
              ? <EyeOff className="w-4 h-4" aria-hidden="true" />
              : <Eye className="w-4 h-4" aria-hidden="true" />
            }
          </button>
        </div>

        {/* Inline error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[13px] text-red-500 font-medium px-2"
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[13px] text-green-600 font-medium px-2"
              role="status"
            >
              {success}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[52px] rounded-full bg-[#1A1A1A] text-white text-[14px] font-black uppercase tracking-wide flex items-center justify-center gap-3 hover:opacity-80 transition-opacity disabled:opacity-60"
          aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            : (
              <>
                {mode === 'login' ? 'Continue' : 'Create Account'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )
          }
        </button>
      </form>

      {/* Mode toggle */}
      <p className="text-center text-[13px] text-gray-500 mt-6">
        {mode === 'login' ? (
          <>
            No account?{' '}
            <button
              onClick={() => switchMode('register')}
              className="text-[#1A1A1A] font-bold hover:underline"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => switchMode('login')}
              className="text-[#1A1A1A] font-bold hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>

      {/* Legal */}
      <p className="text-center text-[11px] text-gray-400 mt-5 leading-relaxed">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="underline hover:text-[#1A1A1A]">Terms</Link>
        {' '}and{' '}
        <Link href="/privacy-policy" className="underline hover:text-[#1A1A1A]">Privacy Policy</Link>.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — 50/50 split layout with Suspense boundary for useSearchParams
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          LEFT PANEL — full-bleed lifestyle image
          Hidden on mobile (shows just the form for speed)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block md:w-1/2 relative shrink-0">
        <Image
          src="/images/hero.jpg"
          alt="Daztao NFC smart keychain — premium lifestyle photography"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-black/10" />

        {/* Text on top of image */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          <Link href="/" className="text-white text-[22px] font-black tracking-tight">
            Daztao
          </Link>

          <div>
            <h2 className="text-[36px] md:text-[42px] font-black text-white leading-tight tracking-tight mb-4 max-w-xs">
              Join Daztao. Upgrade your networking.
            </h2>
            <p className="text-white/65 text-[14px] leading-relaxed max-w-xs mb-6 font-light">
              Share Instagram, Snapchat, YouTube, and your digital business card with one tap.
              No app required.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
              <span className="text-white/50 text-[11px] font-semibold uppercase tracking-widest">
                Trusted by creators across India
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT PANEL — auth form
          Alabaster background, charcoal text
      ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 bg-[#FAFAFA] flex flex-col justify-center overflow-y-auto">

        {/* Mobile logo — only visible when left panel is hidden */}
        <div className="md:hidden px-6 pt-10 pb-4">
          <Link href="/" className="text-[#1A1A1A] text-[20px] font-black tracking-tight">
            Daztao
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 xl:px-24 py-10">
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-40">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" aria-hidden="true" />
              </div>
            }
          >
            <AuthForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#07080d] text-white flex items-center justify-center px-6">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 blur-[120px]" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md border border-white/10 bg-black/40 backdrop-blur-xl p-8"
      >
        {/* BRAND */}
        <div className="text-center mb-8">
          <div className="text-sm tracking-[0.35em] text-gray-400 mb-2">
            DAZTAO
          </div>
          <h1 className="text-2xl font-light">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
        </div>

        {/* FORM */}
        <form className="space-y-5">
          {mode === 'signup' && (
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full name"
                className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 text-sm focus:outline-none focus:border-white/30"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 bg-white text-black py-3 text-sm tracking-wide hover:bg-gray-100 transition"
          >
            {mode === 'login' ? 'Login' : 'Sign up'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* SWITCH MODE */}
        <div className="mt-6 text-center text-xs text-gray-400">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-white hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-white hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* BACK */}
        <button
          onClick={() => router.push('/daztao')}
          className="mt-8 block mx-auto text-xs tracking-widest text-gray-500 hover:text-gray-300 transition"
        >
          ← BACK TO HOME
        </button>
      </motion.div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';
import { setAdminCookie } from './actions'; // We will create this next

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Call the server action to verify password
    const success = await setAdminCookie(password);

    if (success) {
      router.push('/admin'); // Redirect to dashboard
    } else {
      setError('Access Denied');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-zinc-400" />
          </div>
        </div>
        
        <h1 className="text-xl font-bold text-center text-white mb-8 tracking-tight">
          DAZTAO COMMAND
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Key"
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition text-center tracking-widest font-mono"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center font-bold uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "VERIFYING..." : "ENTER"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
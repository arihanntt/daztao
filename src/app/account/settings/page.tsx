'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

// ─────────────────────────────────────────────────────────────────────────────
// Reusable input
// ─────────────────────────────────────────────────────────────────────────────
function FormInput({
  id, label, value, onChange, readOnly = false,
  type = 'text', placeholder = '',
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`h-[50px] border px-4 text-[14px] transition-colors focus:outline-none ${
          readOnly
            ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-default'
            : 'bg-white border-gray-200 text-[#1A1A1A] focus:border-[#1A1A1A]'
        }`}
        aria-readonly={readOnly}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Shipping fields
  const [street,  setStreet]  = useState('');
  const [city,    setCity]    = useState('');
  const [state,   setState]   = useState('');
  const [pincode, setPincode] = useState('');
  const [phone,   setPhone]   = useState('');

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg,  setErrorMsg]  = useState('');

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/account/settings');
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-[68px]">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-[#1A1A1A] rounded-full animate-spin" aria-label="Loading" />
        </main>
      </>
    );
  }

  // ── Save handler (persists to localStorage for now — wire to DB later) ───────
  const handleSave = async () => {
    if (saveState !== 'idle') return;
    setSaveState('saving');
    setErrorMsg('');

    try {
      // Simulate async save — replace with a real PATCH /api/user/shipping call later
      await new Promise((resolve) => setTimeout(resolve, 900));
      localStorage.setItem('daztao_shipping', JSON.stringify({ street, city, state, pincode, phone }));
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2800);
    } catch {
      setErrorMsg('Failed to save. Please try again.');
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
      <Header />

      <main className="max-w-[640px] mx-auto px-6 pt-[68px]">

        {/* Page header */}
        <div className="py-16 md:py-24 border-b border-gray-100">
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-3">
            Account
          </span>
          <h1 className="text-[40px] md:text-[52px] font-black tracking-tight text-[#1A1A1A]">
            Account Settings
          </h1>
        </div>

        {/* ── Personal Info (read-only from NextAuth) ───────────────────── */}
        <section aria-label="Personal information" className="py-12 border-b border-gray-100">
          <h2 className="text-[16px] font-black text-[#1A1A1A] uppercase tracking-wide mb-6">
            Personal Info
          </h2>
          <div className="flex flex-col gap-4">
            <FormInput
              id="account-name"
              label="Full Name"
              value={session?.user?.name ?? ''}
              readOnly
            />
            <FormInput
              id="account-email"
              label="Email Address"
              value={session?.user?.email ?? ''}
              readOnly
              type="email"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-4 font-light">
            Personal info is managed by your sign-in provider and cannot be changed here.
          </p>
        </section>

        {/* ── Shipping Details ─────────────────────────────────────────── */}
        <section aria-label="Shipping details" className="py-12 border-b border-gray-100">
          <h2 className="text-[16px] font-black text-[#1A1A1A] uppercase tracking-wide mb-6">
            Shipping Details
          </h2>
          <div className="flex flex-col gap-4">
            <FormInput
              id="shipping-phone"
              label="Mobile Number"
              value={phone}
              onChange={setPhone}
              type="tel"
              placeholder="10-digit mobile number"
            />
            <FormInput
              id="shipping-street"
              label="Street Address"
              value={street}
              onChange={setStreet}
              placeholder="House no, building, street, area"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="shipping-city"
                label="City"
                value={city}
                onChange={setCity}
                placeholder="Mumbai"
              />
              <FormInput
                id="shipping-pincode"
                label="PIN Code"
                value={pincode}
                onChange={setPincode}
                placeholder="400001"
              />
            </div>
            <FormInput
              id="shipping-state"
              label="State"
              value={state}
              onChange={setState}
              placeholder="Maharashtra"
            />
          </div>
        </section>

        {/* ── Save button ──────────────────────────────────────────────── */}
        <div className="py-10 flex flex-col gap-3">
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[12px] text-red-500 font-medium"
                role="alert"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleSave}
            disabled={saveState !== 'idle'}
            className={`w-full h-[52px] flex items-center justify-center gap-3 font-black text-[13px] uppercase tracking-wide transition-all ${
              saveState === 'saved'
                ? 'bg-green-600 text-white'
                : saveState === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-[#1A1A1A] text-white hover:opacity-80 disabled:opacity-60'
            }`}
            aria-label="Save shipping details"
          >
            {saveState === 'saving' && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {saveState === 'saved'  && <Check className="w-4 h-4" aria-hidden="true" />}
            {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Failed — Retry' : 'Save Changes'}
          </button>
        </div>

        <div className="pb-24" />
      </main>

      <Footer />
    </div>
  );
}

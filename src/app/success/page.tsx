'use client';

import { CheckCircle, Package, Smartphone, Mail } from 'lucide-react';
import Header from '@/components/Header';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#07080d] text-white overflow-x-hidden">
      <Header />

      <section className="pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* ICON */}
          <div className="flex justify-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-400" />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-light mb-4">
            Order Confirmed
          </h1>

          <p className="text-gray-400 mb-10">
            Your DAZTAO keychain order has been successfully placed.
          </p>

          {/* ORDER STEPS */}
          <div className="grid gap-6 text-left border border-gray-800 p-6 md:p-8">

            <Step
              icon={Smartphone}
              title="We program your NFC"
              text="The links you added will be securely written to your NFC keychain."
            />

            <Step
              icon={Package}
              title="Packed & shipped"
              text="Your keychain will be dispatched within 24–48 hours."
            />

            <Step
              icon={Mail}
              title="Tracking details"
              text="You’ll receive tracking updates on email and WhatsApp."
            />
          </div>

          {/* NOTE */}
          <p className="text-xs text-gray-500 mt-8">
            NFC works on most Android phones and iPhone XS or newer.
          </p>

          {/* SUPPORT */}
          <div className="mt-12 text-sm text-gray-400">
            Need help? Contact us at{' '}
            <span className="text-white">support@daztao.com</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-between text-sm text-gray-500">
          <span>© {new Date().getFullYear()} DAZTAO</span>
          <span>Terms • Privacy</span>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- COMPONENT ---------------- */

function Step({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <Icon className="w-6 h-6 text-gray-400 mt-1" />
      <div>
        <div className="text-sm font-medium mb-1">{title}</div>
        <div className="text-sm text-gray-400">{text}</div>
      </div>
    </div>
  );
}

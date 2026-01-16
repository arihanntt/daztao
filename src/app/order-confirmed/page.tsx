'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Truck, Package, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import Header from '@/components/Header'; // Optional

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  // Retrieve Data
  const orderId = searchParams.get('orderId') || 'DAZ-####';
  const total = searchParams.get('total') || '0';
  const rawMethod = searchParams.get('method') || 'upi';
  const method = rawMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (UPI)';
  const userName = searchParams.get('name') || 'Customer';
  const phone = searchParams.get('phone') || '';

  // --- PROFESSIONAL WHATSAPP MESSAGE ---
  // Clean, system-generated look. Easy to read.
  const message = 
` *DAZTAO ORDER CONFIRMATION*

Order ID: #${orderId}
Payment: ${method === 'Cash on Delivery' ? 'COD' : 'Prepaid (UPI)'}
Amount: ₹${total}

Name: ${userName}
Phone: ${phone}

Please confirm this order.`;

  const whatsappUrl = `https://wa.me/917889386542?text=${encodeURIComponent(message)}`;

  // Auto-Redirect Logic (Improved)
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Small delay to ensure state update is processed before redirect
      const redirectTimer = setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 500);
      return () => clearTimeout(redirectTimer);
    }
  }, [countdown, whatsappUrl]);

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 selection:text-white relative flex flex-col items-center justify-center p-6">
      
      {/* --- RETRO GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <main className="relative z-10 max-w-lg w-full space-y-12">
        
        {/* 1. SUCCESS CONFIRMATION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-20"/>
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-3 tracking-tight">
              Connection unlocked.
            </h1>
            <p className="text-zinc-500 text-sm font-light tracking-wide uppercase">
              Your DAZTAO order is confirmed.
            </p>
          </div>
        </motion.div>

        {/* 2. ORDER SNAPSHOT */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="border-y border-white/5 py-6"
        >
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <span className="block text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Order ID</span>
              <span className="font-mono text-zinc-300">#{orderId}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Total Amount</span>
              <span className="font-mono text-white">₹{total}</span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Payment</span>
              <span className="text-zinc-300">{method}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Status</span>
              <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest bg-emerald-500/10 px-2 py-1 rounded-sm inline-block">Confirmed</span>
            </div>
          </div>
        </motion.div>

        {/* 3. TIMELINE (WHAT HAPPENS NEXT) */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-xs font-serif italic text-zinc-500 text-center">What happens next?</h2>
          
          <div className="space-y-6 relative pl-4">
            {/* Connector Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-zinc-800" />

            <div className="flex gap-6 relative">
              <div className="w-10 h-10 bg-zinc-900 border border-emerald-500/50 rounded-full flex items-center justify-center shrink-0 z-10 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="pt-2">
                <h3 className="text-white text-sm font-medium mb-1">WhatsApp Verification</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">We quickly verify your address details.</p>
              </div>
            </div>

            <div className="flex gap-6 relative opacity-50">
              <div className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center shrink-0 z-10">
                <Package className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="pt-2">
                <h3 className="text-zinc-300 text-sm font-medium mb-1">Programming</h3>
                <p className="text-xs text-zinc-600">Your link is written to the NFC chip.</p>
              </div>
            </div>

            <div className="flex gap-6 relative opacity-50">
              <div className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center shrink-0 z-10">
                <Truck className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="pt-2">
                <h3 className="text-zinc-300 text-sm font-medium mb-1">Shipping</h3>
                <p className="text-xs text-zinc-600">Dispatch in 2-3 business days.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. WHATSAPP REDIRECT */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8 }}
          className="bg-zinc-900/30 border border-white/10 p-6 rounded-sm text-center space-y-6"
        >
          <div>
            <p className="text-zinc-400 text-xs mb-2 uppercase tracking-widest font-bold">Confirm on WhatsApp</p>
            {countdown > 0 ? (
              <p className="text-white text-sm">Redirecting to WhatsApp in <span className="font-mono text-emerald-400 text-lg mx-1">{countdown}</span> seconds...</p>
            ) : (
              <p className="text-white text-sm">Opening WhatsApp...</p>
            )}
          </div>

          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: "100%" }} 
              transition={{ duration: 5, ease: "linear" }} 
              className="h-full bg-white" 
            />
          </div>

          {countdown === 0 && (
            <div className="pt-2">
              <a 
                href={whatsappUrl}
                className="inline-flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-4 rounded-sm text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition"
              >
                Continue on WhatsApp <ArrowRight className="w-4 h-4"/>
              </a>
              <p className="text-[10px] text-zinc-600 mt-4">
                If the app didn't open automatically, please click above.
              </p>
            </div>
          )}
        </motion.div>

        {/* 5. TRUST & SUPPORT */}
        <div className="text-center pt-8 border-t border-white/5">
          <p className="text-xs text-zinc-500 mb-4">Need help?</p>
          <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
             <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Secure</span>
             <span className="flex items-center gap-2">WhatsApp Support</span>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
      <OrderConfirmedContent />
    </Suspense>
  );
}
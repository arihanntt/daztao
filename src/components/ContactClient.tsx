'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  Zap,
  MapPin,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function ContactClient() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 selection:text-white overflow-x-hidden">
      
      {/* --- RETRO GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <Header />

      {/* ================= HERO ================= */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block text-[10px] font-bold tracking-[0.3em] text-zinc-500 mb-8 uppercase">
              Contact
            </span>

            <h1 className="text-5xl md:text-8xl font-serif italic font-light leading-[0.9] tracking-tight text-white mb-10">
              Let's talk.
            </h1>

            <p className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed max-w-2xl">
              Whether you need support, have a question, or want to work with us — reach out directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= CONTACT CHANNELS ================= */}
      <section className="relative py-24 px-6 border-t border-white/5 z-10 bg-zinc-900/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">

          {/* LEFT: DIRECT CHANNELS */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-8">
              Human responses. <br/> No noise.
            </h2>

            <p className="text-zinc-400 leading-relaxed max-w-md mb-12 font-light">
              We don’t hide behind ticket numbers. Every message is read by a real person.
            </p>

            <div className="space-y-10">
              <ContactItem
                icon={Mail}
                title="Support"
                value="daztaoo@gmail.com"
                href="mailto:daztaoo@gmail.com"
              />
              <ContactItem
                icon={MessageSquare}
                title="Business"
                value="daztaoo@gmail.com"
                href="mailto:daztaoo@gmail.com"
              />
              <ContactItem
                icon={ShieldCheck}
                title="Privacy"
                value="daztaoo@gmail.com"
                href="mailto:daztaoo@gmail.com"
              />
            </div>

            <p className="text-[10px] text-zinc-600 mt-12 max-w-sm leading-relaxed uppercase tracking-wide">
              Please avoid sending marketing or partnership pitches unless relevant. 
              We currently support customers across India.
            </p>
          </div>

          {/* RIGHT: INFO BOX */}
          <div className="space-y-8 p-10 border border-white/5 bg-[#0a0a0a] rounded-sm h-fit">
            <InfoItem
              icon={Zap}
              title="Response Time"
              desc="Usually within 24–48 hours."
            />
            <InfoItem
              icon={MapPin}
              title="Operations"
              desc="Remote-first, with fulfillment partners across India."
            />
            
            <div className="pt-8 border-t border-white/5">
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                For order-related queries, please include your <strong>Order ID</strong> in the subject line. This helps us resolve things faster.
              </p>
              
              {/* Back to Shop CTA */}
              <button
                onClick={() => router.push('/products')}
                className="text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-rose-400 transition flex items-center gap-2"
              >
                Back to Catalog <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SEO MICRO-COPY (Hidden but valuable) ================= */}
      <section className="py-12 px-6 bg-[#080808]">
        <p className="text-[10px] text-zinc-700 max-w-3xl mx-auto text-center leading-relaxed">
          Contact DAZTAO for support related to NFC keychains, order status, shipping, refunds, 
          or general questions. We respond to all customer inquiries via email to ensure quality service.
        </p>
      </section>

      <Footer />
    </div>
  );
}

/* ---------- HELPERS ---------- */

function ContactItem({ icon: Icon, title, value, href }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="w-10 h-10 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-white transition-all duration-300">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 mb-1 uppercase group-hover:text-rose-400 transition-colors">
          {title}
        </div>
        <a 
          href={href} 
          className="text-lg text-zinc-300 hover:text-white transition border-b border-transparent hover:border-white pb-0.5"
        >
          {value}
        </a>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <Icon className="w-5 h-5 text-zinc-600 mt-1" />
      <div>
        <div className="text-sm font-serif italic text-white mb-1">
          {title}
        </div>
        <div className="text-sm text-zinc-400 font-light leading-relaxed">
          {desc}
        </div>
      </div>
    </div>
  );
}
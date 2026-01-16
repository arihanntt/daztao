'use client';

import { motion } from 'framer-motion';
import {
  Sparkles, Clock, MapPin, ShieldCheck, Heart, Zap,
  Smartphone, Music, Briefcase, Check
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function AboutClient() {
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
              The Philosophy
            </span>

            <h1 className="text-5xl md:text-8xl font-serif italic font-light leading-[0.9] tracking-tight text-white mb-10">
              We don't sell plastic. <br/>
              <span className="text-zinc-600">We sell identity.</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed max-w-3xl">
              In a world of cheap, disposable gadgets, DAZTAO stands for permanence. 
              We build tools for the new generation of creators who understand that <strong className="text-white font-medium">first impressions happen only once.</strong>
            </p>

            {/* --- SEO PARAGRAPH (Subtle) --- */}
            <p className="text-xs text-zinc-600 max-w-3xl mt-12 leading-relaxed font-mono">
              DAZTAO is a premium NFC keychain designed to instantly share digital profiles,
              social media links, and playlists with a single tap. Unlike QR codes or apps,
              DAZTAO works without batteries or downloads and is compatible with modern
              iPhones and Android devices. Ideal for creators, professionals, and musicians.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= THE "WHY ₹400" SECTION (Critical) ================= */}
      <section className="relative py-24 px-6 border-t border-white/5 z-10 bg-zinc-900/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-10">
            Why DAZTAO <br/> isn’t ₹99.
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-zinc-400 text-lg leading-relaxed mb-6 font-light">
                You can buy a cheap NFC tag anywhere. 
                But cheap tags cost time, confusion, and awkward moments.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed font-light">
                DAZTAO is priced for people who value their time, 
                their image, and the art of the introduction.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                "Pre-programmed and ready in 30s",
                "Premium matte finish (No cheap plastic feel)",
                "No apps, no setup guides, no friction",
                "Built to be carried daily, not thrown away"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm tracking-wide">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= THE 3 PILLARS (Why Us) ================= */}
      <section className="relative py-32 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          
          {/* Card 1 */}
          <div className="space-y-6 group">
            <div className="w-12 h-12 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white transition-colors duration-500">
               <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-serif italic text-white">We Sell Time.</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              You could save ₹200 and spend an hour figuring out how to program a blank chip. 
              Or you can use DAZTAO. <strong>It works in 30 seconds.</strong> We did the hard work so you don't have to.
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-6 group">
            <div className="w-12 h-12 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white transition-colors duration-500">
               <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-serif italic text-white">The "Apple" of NFC.</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Presentation matters. Our matte-black finish tells your network that you care about quality. 
              Don't pull out a cheap piece of plastic to share your valuable brand.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-6 group">
            <div className="w-12 h-12 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white transition-colors duration-500">
               <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-serif italic text-white">Proudly Indian.</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              We aren't a faceless dropshipping store. We are based in India. 
              We ship fast, we reply to WhatsApps, and we guarantee our products work perfectly.
            </p>
          </div>

        </div>
      </section>

      {/* ================= SOCIAL PROOF (Use Cases) ================= */}
      <section className="relative py-24 px-6 border-y border-white/5 z-10 bg-zinc-900/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <span className="block text-center text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-12 uppercase">
            Who is this for?
          </span>
          
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-3">
              <div className="mx-auto w-10 h-10 flex items-center justify-center text-rose-400 mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <strong className="text-white block text-lg font-serif">Creators</strong>
              <p className="text-sm text-zinc-500">Share Instagram without asking people to type.</p>
            </div>
            <div className="space-y-3">
              <div className="mx-auto w-10 h-10 flex items-center justify-center text-rose-400 mb-2">
                <Music className="w-6 h-6" />
              </div>
              <strong className="text-white block text-lg font-serif">Musicians</strong>
              <p className="text-sm text-zinc-500">Tap once to open your Spotify instantly.</p>
            </div>
            <div className="space-y-3">
              <div className="mx-auto w-10 h-10 flex items-center justify-center text-rose-400 mb-2">
                <Briefcase className="w-6 h-6" />
              </div>
              <strong className="text-white block text-lg font-serif">Professionals</strong>
              <p className="text-sm text-zinc-500">Replace awkward introductions with one gesture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPANY INFO ================= */}
      <section className="relative py-32 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] tracking-[0.3em] text-zinc-600 uppercase font-bold">
            The Company
          </span>

          <h2 className="text-3xl md:text-4xl font-serif italic mt-6 mb-8 text-white">
            A Drixe Group Company
          </h2>

          <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10 font-light">
            DAZTAO is the flagship consumer brand of Drixe Group. We are obsessed with merging 
            digital utility with physical aesthetics. We believe technology should be silent, 
            beautiful, and instant.
          </p>

          <div className="flex justify-center gap-8 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
             <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> 100% Secure</span>
             <span className="flex items-center gap-2"><Heart className="w-3 h-3"/> Made with Love</span>
             <span className="flex items-center gap-2"><Zap className="w-3 h-3"/> Instant</span>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative py-32 px-6 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050507]" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-none">
            Stop sharing seamlessly.<br/>
            Start sharing remarkably.
          </h2>
          
          <div className="pt-8">
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 transition-transform rounded-full shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Shop the Collection
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight, Smartphone, Music, Link as LinkIcon, Sparkles,
  Heart, Users, ShieldCheck, Zap, Instagram, Globe
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function HomeClient() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 selection:text-white overflow-x-hidden">
      
      {/* --- RETRO GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <Header />

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="DAZTAO NFC Keychain"
            className="w-full h-full object-cover scale-[1.25] sm:scale-110 lg:scale-100 object-[70%_center]"
          />
          <div className="absolute inset-0 bg-black/80 lg:bg-gradient-to-r lg:from-[#07080d] lg:via-[#07080d]/90 lg:to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-screen flex items-center">
          <div className="max-w-xl">
            <span className="block text-xs tracking-[0.35em] text-gray-400 mb-3">
              STOP TYPING.
            </span>
            <h1 className="text-[72px] md:text-[96px] xl:text-[110px] font-light leading-none">
              TAP.
            </h1>
            <p className="mt-6 text-base text-gray-300 max-w-md">
              A premium NFC keychain to share Spotify, Instagram,
              and important links instantly.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="mt-10 inline-flex items-center gap-3 px-8 py-3 border border-gray-600 text-sm hover:bg-white hover:text-black transition"
            >
              Buy DAZTAO <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      


      {/* ================= 1. CLARITY LINE (What is it?) ================= */}
      <section className="relative py-20 border-b border-white/5 z-10 bg-[#080808]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xl md:text-2xl font-serif italic text-zinc-400 leading-relaxed">
            "DAZTAO is a premium NFC keychain that lets you share a link (Spotify, Instagram, Portfolio) with a single tap. No apps required."
          </p>
        </div>
      </section>

      {/* ================= 2. HOW IT WORKS (Moved Up) ================= */}
      <section className="relative py-24 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { num: "01", title: 'Tap', desc: 'Touch DAZTAO to any phone.' },
              { num: "02", title: 'Open', desc: 'NFC opens your link instantly.' },
              { num: "03", title: 'Connect', desc: 'They remember the moment.' },
            ].map((item, i) => (
              <div key={i} className="space-y-4 group">
                <div className="text-4xl font-serif italic text-zinc-700 group-hover:text-rose-500 transition-colors duration-500">{item.num}</div>
                <h3 className="text-xl font-medium text-white">{item.title}</h3>
                <p className="text-sm text-zinc-500 tracking-wide uppercase">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 3. MICRO CTA */}
          <div className="text-center mt-16">
            <button
              onClick={() => router.push('/products')}
              className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition border-b border-zinc-700 pb-1 hover:border-white"
            >
              View Available Designs →
            </button>
          </div>
        </div>
      </section>

      {/* ================= 4. TRUST STRIP ================= */}
      <section className="relative py-8 border-y border-white/5 z-10 bg-zinc-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-8 md:gap-16 justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          <span className="flex items-center gap-2"><Zap className="w-3 h-3"/> No App Required</span>
          <span className="flex items-center gap-2"><Smartphone className="w-3 h-3"/> iPhone & Android</span>
          <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> No Battery</span>
          <span className="flex items-center gap-2"><Users className="w-3 h-3"/> Privacy First</span>
        </div>
      </section>

      {/* ================= 5. USE CASES ================= */}
      <section className="relative py-32 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-serif italic mb-4">Made for moments.</h2>
            <p className="text-zinc-500">Not menus.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <UseCard icon={Heart} title="For Couples" desc="Gift a Spotify playlist or special memory." />
            <UseCard icon={Globe} title="For Founders" desc="Share your portfolio instantly at events." />
            <UseCard icon={Instagram} title="For Creators" desc="Grow your following in the real world." />
          </div>
        </div>
      </section>

      {/* ================= COMPARISON + PHILOSOPHY ================= */}
      <section className="relative py-24 z-10 bg-zinc-900/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-serif italic text-center mb-16 text-white">
            Why DAZTAO feels different
          </h2>

          <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a]">
             <table className="w-full text-left text-sm text-zinc-400">
                <thead className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-white/5 bg-white/[0.02]">
                   <tr>
                      <th className="py-6 pl-8 font-medium">Feature</th>
                      <th className="py-6 font-bold text-white">DAZTAO™</th>
                      <th className="py-6 font-medium opacity-50">QR Codes</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   <tr>
                      <td className="py-5 pl-8">Interaction</td>
                      <td className="py-5 text-rose-400">One Tap</td>
                      <td className="py-5 opacity-50">Open Camera, Scan, Tap</td>
                   </tr>
                   <tr>
                      <td className="py-5 pl-8">Vibe Check</td>
                      <td className="py-5 text-rose-400">Futuristic & Slick</td>
                      <td className="py-5 opacity-50">Feels like a restaurant menu</td>
                   </tr>
                   <tr>
                      <td className="py-5 pl-8">Durability</td>
                      <td className="py-5 text-rose-400">Waterproof Hardware</td>
                      <td className="py-5 opacity-50">Paper tears & fades</td>
                   </tr>
                </tbody>
             </table>
          </div>

          {/* 6. MID-PAGE CTA */}
          <div className="text-center mt-16">
            <button
              onClick={() => router.push('/products')}
              className="px-12 py-4 border border-zinc-700 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Choose your Vibe
            </button>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative py-40 z-10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
            The fastest way <br/>
            to share who you are.
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            DAZTAO removes the pause between meeting someone and connecting with them.
          </p>
          <div className="pt-8">
            <button
              onClick={() => router.push('/products')}
              className="px-16 py-5 bg-white text-black font-bold text-sm uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Get Daztao
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- SUB COMPONENTS (Invisible UI Style) ---

function UseCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="group p-8 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition duration-500">
      <Icon className="w-6 h-6 text-zinc-600 group-hover:text-rose-400 transition-colors mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}
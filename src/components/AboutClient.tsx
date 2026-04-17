'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, MapPin, Zap, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function AboutClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans overflow-x-hidden">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-[68px] border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-6">
              Our Story
            </span>
            <h1 className="text-[48px] md:text-[80px] lg:text-[96px] font-black leading-[0.95] tracking-tight text-[#1A1A1A] mb-8 max-w-4xl">
              We don't sell plastic.<br />
              <span className="text-gray-300">We sell identity.</span>
            </h1>
            <p className="text-[17px] md:text-[20px] text-gray-500 font-light leading-relaxed max-w-2xl">
              In a world of cheap, disposable gadgets, Daztao stands for permanence.
              We build tools for the new generation of creators who understand that
              <strong className="text-[#1A1A1A] font-semibold"> first impressions happen only once.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Why Daztao isn't Rs.99 ───────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
            <div className="md:w-1/2">
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-6">
                The Philosophy
              </span>
              <h2 className="text-[32px] md:text-[48px] font-black tracking-tight text-[#1A1A1A] leading-tight mb-8">
                Why Daztao isn't priced at Rs. 99.
              </h2>
              <p className="text-[16px] text-gray-500 leading-relaxed font-light mb-4">
                You can buy a cheap NFC tag anywhere. But cheap tags cost time, confusion, and
                awkward moments when they don't work.
              </p>
              <p className="text-[16px] text-gray-500 leading-relaxed font-light">
                Daztao is priced for people who value their time, their image, and the art of
                the introduction.
              </p>
            </div>

            <div className="md:w-1/2">
              <ul className="flex flex-col gap-5" role="list">
                {[
                  'Pre-programmed and ready in under 60 seconds',
                  'Premium matte finish — no cheap plastic feel',
                  'No apps, no setup guides, no friction for the receiver',
                  'Built to be carried daily, not thrown away',
                  'NTAG215 chip — the same standard used in transit cards',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <Check className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
                    <span className="text-[15px] text-gray-600 font-light leading-snug">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 Pillars ────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-14">
            What We Stand For
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
              {
                Icon: Zap,
                title: 'We Sell Time.',
                body: 'You could spend an hour figuring out a blank chip. Or you can use Daztao. It works in 30 seconds. We did the hard work so you don\'t have to.',
              },
              {
                Icon: ShieldCheck,
                title: 'Premium by Design.',
                body: 'Presentation matters. Our matte finish tells your network that you care about quality. Don\'t pull out a cheap piece of plastic to share your valuable brand.',
              },
              {
                Icon: MapPin,
                title: 'Proudly Indian.',
                body: 'We are not a faceless dropshipping store. Based in India. We ship fast, we reply to support, and we guarantee our products work perfectly every time.',
              },
            ].map(({ Icon, title, body }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col gap-6 py-10 md:py-0 md:px-12 first:md:pl-0 last:md:pr-0"
              >
                <div className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="text-[20px] font-black text-[#1A1A1A] tracking-tight">{title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed font-light">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ─────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-white/40 mb-14">
            Who Is This For
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              {
                label: 'Creators',
                body: 'Share Instagram, TikTok, YouTube without asking anyone to type. One tap and your profile is open on their phone.',
              },
              {
                label: 'Professionals',
                body: 'Replace awkward introductions and paper cards. Tap once to share your LinkedIn, portfolio, or digital business card.',
              },
              {
                label: 'Musicians',
                body: 'Tap once to open your Spotify or YouTube instantly. Grow your audience every time you meet someone new in real life.',
              },
            ].map(({ label, body }, i) => (
              <div key={i} className="py-10 md:py-0 md:px-12 first:md:pl-0 last:md:pr-0">
                <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-white/40 mb-4">{label}</span>
                <p className="text-[15px] text-white/65 leading-relaxed font-light">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Info ─────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div className="max-w-xl">
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-6">
                The Company
              </span>
              <h2 className="text-[32px] md:text-[44px] font-black tracking-tight text-[#1A1A1A] leading-tight mb-6">
                A Drixe Group Company.
              </h2>
              <p className="text-[16px] text-gray-500 leading-relaxed font-light">
                Daztao is the flagship consumer brand of Drixe Group. We are obsessed with merging
                digital utility with physical aesthetics. We believe technology should be silent,
                beautiful, and instant.
              </p>
            </div>
            <button
              onClick={() => router.push('/products')}
              className="flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white text-[13px] font-black uppercase tracking-wide hover:opacity-80 transition-opacity shrink-0"
              aria-label="Shop Daztao NFC keychains"
            >
              Shop the Collection <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
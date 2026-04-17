'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, ShoppingBag, Plus, Link2, ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM LOGOS (inline SVG, monochrome)
// ─────────────────────────────────────────────────────────────────────────────
const IgSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);
const LiSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);
const YtSVG = () => (
  <svg width="22" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.96-1.96C18.88 4 12 4 12 4s-6.88 0-8.58.46a2.78 2.78 0 0 0-1.96 1.96C1 8.12 1 12 1 12s0 3.88.46 5.58c.26.96 1 1.7 1.96 1.96C5.12 20 12 20 12 20s6.88 0 8.58-.46a2.78 2.78 0 0 0 1.96-1.96C23 15.88 23 12 23 12s0-3.88-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
);
const SnapSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.06 2c3.98.02 6.29 2.54 6.44 6.71.05 1.2.05 2.41.1 3.61.13.29.47.43.77.52.47.14.96.24 1.41.43.44.19.68.5.53.96-.12.37-.5.6-.87.72-.87.27-1.51.78-2.02 1.54-.21.32-.37.69-.26 1.07.15.51.3 1.02.45 1.53a.73.73 0 0 1-.5.92c-.69.19-1.28-.23-1.86-.5-.72-.34-1.46-.55-2.22-.35-.57.15-1.09.49-1.58.82-.49.33-1 .63-1.59.65a2.9 2.9 0 0 1-1.55-.63c-.5-.31-1.03-.66-1.61-.81-.78-.2-1.54.01-2.27.36-.57.27-1.16.68-1.84.49a.73.73 0 0 1-.5-.92l.45-1.53c.11-.38-.05-.75-.26-1.07-.51-.76-1.15-1.27-2.02-1.54-.37-.12-.75-.35-.87-.72-.15-.46.08-.77.52-.96.46-.19.95-.29 1.42-.43.3-.09.63-.23.77-.52.05-1.2.05-2.41.1-3.61.18-4.17 2.48-6.7 6.44-6.71h.16z"/>
  </svg>
);
const TtSVG = () => (
  <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.22 6.22 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.16 8.16 0 0 0 4.78 1.52V7.12a4.85 4.85 0 0 1-1.01-.43z"/>
  </svg>
);

const PLATFORMS = [
  { label: 'Instagram', Icon: IgSVG },
  { label: 'LinkedIn', Icon: LiSVG },
  { label: 'YouTube', Icon: YtSVG },
  { label: 'Snapchat', Icon: SnapSVG },
  { label: 'TikTok', Icon: TtSVG },
  { label: 'Instagram', Icon: IgSVG },
  { label: 'LinkedIn', Icon: LiSVG },
  { label: 'YouTube', Icon: YtSVG },
  { label: 'Snapchat', Icon: SnapSVG },
  { label: 'TikTok', Icon: TtSVG },
];

const HOW_STEPS = [
  {
    n: '01',
    title: 'Link your profile.',
    body: 'Connect your Daztao NFC smart keychain to any URL — your Instagram handle, LinkedIn profile, YouTube channel, or a custom digital business card. The setup takes under 60 seconds and requires no account. The tag supports any HTTPS link and can be reprogrammed at any time using any free NFC writer app.',
  },
  {
    n: '02',
    title: 'Tap to any phone.',
    body: 'Utilizing NTAG215 NFC technology operating at 13.56 MHz, tap the keychain to any NFC-enabled smartphone. Compatible natively with Apple iPhone 7 and newer without any app or camera scan required. Compatible with virtually all Android devices from 2015 onwards including Samsung, OnePlus, Xiaomi, Realme, Oppo, and Vivo.',
  },
  {
    n: '03',
    title: 'Connect instantly.',
    body: 'Your digital profile opens directly in the receiver\'s default browser in under one second. No app download, no Bluetooth pairing, no Wi-Fi, no QR camera scan. Zero friction for the person you are meeting. It is the fastest possible handoff of social and professional identity ever built into a physical accessory.',
  },
];

const USE_CASES = [
  {
    segment: 'For Founders and Professionals',
    keyword: 'digital business card keychain',
    headline: 'Replace Your Business Card Permanently',
    body: 'The Daztao NFC keychain is the most effective digital business card ever built into a physical accessory. Tap once to share your LinkedIn, portfolio, email contact, or a Notion page. Never carry paper again.',
  },
  {
    segment: 'For Content Creators',
    keyword: 'NFC keychain for Instagram and TikTok',
    headline: 'Grow Your Audience Offline, Instantly',
    body: 'Meet someone in real life who would love your content. Instead of asking them to search for your handle, tap your Daztao keychain to their phone. Your Instagram or TikTok profile opens immediately. Converts offline conversations into online followers.',
  },
  {
    segment: 'For Event Organizers',
    keyword: 'tap to share socials at events',
    headline: 'The Standard for In-Person Networking',
    body: 'At conferences, meetups, and brand events, the Daztao NFC smart keychain is the premium way to exchange digital identity. Durable, waterproof, and infinitely reprogrammable — it works every single time without a battery or signal.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Do I need to download an app to use a Daztao NFC keychain?',
    a: 'No app is required — for you or for the person you are sharing with. Your link opens natively in the receiver\'s browser. On iPhone 7 and newer running iOS 14 or above, the NFC read happens automatically in the background. No camera, no QR code, no app whatsoever.',
  },
  {
    q: 'Does the Daztao NFC keychain work on older phones?',
    a: 'The keychain works on every NFC-enabled smartphone. This includes every iPhone from the 7 onwards (released 2016) and the overwhelming majority of Android devices released after 2015 from all major brands. NFC is standard hardware on virtually every modern smartphone in India.',
  },
  {
    q: 'Is there a monthly subscription fee?',
    a: 'No. Zero. Daztao charges a one-time purchase price only. There are no subscription fees, no monthly data charges, and no account required to keep your keychain working. The tag is yours permanently. You can update the link it stores at any time for free using any NFC writer app.',
  },
  {
    q: 'Can I change the link after purchasing?',
    a: 'Yes — at any time. The NTAG215 chip is reprogrammable. Download any free NFC writer app (such as NFC Tools on Android or iPhone), tap your phone to the keychain, write a new URL. Done in under 30 seconds. You can switch between Instagram, LinkedIn, YouTube, or any other URL as often as you like.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function HomeClient() {
  const router = useRouter();
  const { addToCart, openCart } = useCart();
  const howRef = useRef<HTMLElement>(null);

  const [product, setProduct] = useState<any>(null);
  const [profileLink, setProfileLink] = useState('');
  const [linkError, setLinkError] = useState(false);
  const [addState, setAddState] = useState<'idle' | 'adding' | 'done'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: any[]) => { if (data?.length) setProduct(data[0]); })
      .catch(() => {});
  }, []);

  const handleAdd = () => {
    if (addState !== 'idle') return;
    const trimmed = profileLink.trim();
    if (!trimmed) {
      setLinkError(true);
      linkInputRef.current?.focus();
      setTimeout(() => setLinkError(false), 3500);
      return;
    }
    if (!product) { router.push('/products'); return; }
    setLinkError(false);
    setAddState('adding');
    addToCart({ ...product, profileLink: trimmed });
    setTimeout(() => {
      setAddState('done');
      openCart();
      setTimeout(() => setAddState('idle'), 3000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans overflow-x-hidden">
      <Header />

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — FULL-BLEED HERO
          h-screen, bottom-left H1, sharp edges
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Daztao NFC smart keychain hero"
        className="relative h-screen w-full flex flex-col justify-end overflow-hidden"
      >
        {/* Hero background image */}
        <Image
          src="/images/hero.jpg"
          alt="Daztao NFC smart keychain — tap once to share your Instagram, Snapchat, and digital business card instantly"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Gradient — heavy dark overlay for text + navbar legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40 pointer-events-none" />

        {/* Content — bottom-left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-6 md:px-12 lg:px-20 pb-16 md:pb-20 max-w-3xl"
        >
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-white/40 mb-5">
            NFC Smart Keychains — India
          </span>

          {/* AEO: H1 with primary purchase-intent keywords */}
          <h1 className="text-[52px] md:text-[80px] lg:text-[96px] font-black leading-[0.95] tracking-tight text-white mb-8">
            Share Your<br />World.<br />
            <span className="italic font-light">Instantly.</span>
          </h1>

          <p className="text-[16px] md:text-[18px] text-white/70 max-w-md leading-relaxed mb-10 font-light">
            The ultimate NFC smart keychain for creators and professionals.
            Tap once to share your Instagram, Snapchat, YouTube, or digital business card.
            No apps required.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/products')}
              className="flex items-center gap-3 px-8 py-4 bg-white text-[#1A1A1A] text-[13px] font-black uppercase tracking-wide hover:bg-gray-100 transition-colors"
              aria-label="Shop Daztao NFC keychains"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              Shop Now
            </button>
            <button
              onClick={() => howRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 px-8 py-4 border border-white/40 text-white text-[13px] font-semibold hover:bg-white/10 transition-colors"
              aria-label="See how the NFC keychain works"
            >
              See How It Works
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 right-8 z-10 flex items-center gap-2 text-white/30">
          <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-white/20" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — SOCIAL PROOF MARQUEE
          Stark white, black text, infinite scroll
      ══════════════════════════════════════════════════════════ */}
      <section aria-label="Compatible social platforms" className="bg-white border-b border-gray-100">
        <div className="border-t border-gray-100 py-5">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-5 px-4">
            Trusted by creators across 50+ platforms
          </p>
          <div className="relative overflow-hidden">
            {/* Fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" aria-hidden="true" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" aria-hidden="true" />

            <div className="flex gap-12 animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
              {[...PLATFORMS, ...PLATFORMS].map(({ label, Icon }, i) => (
                <div key={`${label}-${i}`} className="flex items-center gap-2.5 text-gray-500" aria-label={label}>
                  <Icon />
                  <span className="text-[13px] font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 20s linear infinite; }
          .animate-marquee:hover { animation-play-state: paused; }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — THE PROBLEM (Large Typography Narrative)
          Text-only, massive font, editorial tone
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Why NFC keychains are replacing business cards"
        className="py-24 md:py-40 px-6 md:px-12 lg:px-20 border-b border-gray-100"
      >
        <div className="max-w-[1200px]">
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-10">
            The Problem
          </span>
          <h2 className="text-[36px] md:text-[56px] lg:text-[68px] font-black leading-[1.05] tracking-tight text-[#1A1A1A] max-w-4xl">
            Paper business cards end up in the trash.
            Spelling out your username is friction.
            The modern standard is tap-and-go.
          </h2>
          <p className="mt-10 text-[16px] md:text-[18px] text-gray-500 font-light leading-relaxed max-w-xl">
            Every time you ask someone to "search for me" or hand them a card they will forget,
            you lose the connection. There is a better way — and it fits on your keychain.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — THE SOLUTION (50/50 Product Showcase)
          Left: image placeholder. Right: AEO product copy.
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Daztao NFC smart keychain solution"
        className="py-24 md:py-32 border-b border-gray-100"
      >
        <div className="flex flex-col md:flex-row items-stretch min-h-[600px]">

          {/* Left — product image: logo.png */}
          <div className="w-full md:w-1/2 bg-gray-100 min-h-[400px] md:min-h-[600px] flex items-center justify-center shrink-0 overflow-hidden relative">
            <Image
              src="/logo.png"
              alt="Daztao NFC smart keychain product — tap to share Instagram, Snapchat, and your digital business card"
              fill
              className="object-contain p-12"
            />
          </div>

          {/* Right — solution copy */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16 md:py-0">
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-6">
              The Solution
            </span>

            {/* AEO: H2 targets "NFC smart keychain" and "digital business card" */}
            <h2 className="text-[32px] md:text-[44px] font-black leading-tight tracking-tight text-[#1A1A1A] mb-6">
              Meet the Daztao NFC Smart Keychain.
            </h2>

            <p className="text-[16px] text-gray-500 leading-relaxed mb-6 font-light">
              A premium physical accessory that instantly beams your digital identity to any
              smartphone. Built on NTAG215 NFC technology operating at 13.56 MHz — the same
              standard used in contactless payment systems — the Daztao keychain turns a
              single tap into a complete digital handshake.
            </p>

            <p className="text-[16px] text-gray-500 leading-relaxed mb-10 font-light">
              Share your Instagram, Snapchat, YouTube, LinkedIn, portfolio, or a fully custom
              digital business card. No app required for the receiver. No battery. No Bluetooth.
              No subscription.
            </p>

            <button
              onClick={() => router.push('/products')}
              className="self-start flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white text-[13px] font-black uppercase tracking-wide hover:opacity-80 transition-opacity"
              aria-label="View Daztao NFC keychain products"
            >
              View Products <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — HOW IT WORKS (AEO Numbered List)
          No cards. Massive numbered steps. Machine-readable.
      ══════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        ref={howRef}
        aria-label="How a Daztao NFC smart keychain works"
        className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-b border-gray-100"
      >
        <div className="max-w-[1200px] mx-auto">
          <header className="mb-16 md:mb-20">
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-4">
              How It Works
            </span>
            <h2 className="text-[32px] md:text-[48px] font-black tracking-tight text-[#1A1A1A]">
              Three steps. Under a second.
            </h2>
          </header>

          {/* AEO: <ol> — structured step format for featured snippets */}
          <ol className="divide-y divide-gray-100" role="list">
            {HOW_STEPS.map((step, i) => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16 py-12"
              >
                {/* Step number */}
                <div className="shrink-0 text-[60px] md:text-[80px] font-black text-gray-100 leading-none select-none w-16 md:w-28 text-left" aria-hidden="true">
                  {step.n}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-[22px] md:text-[28px] font-black text-[#1A1A1A] mb-4 tracking-tight">
                    {step.n}. {step.title}
                  </h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed max-w-2xl font-light">
                    {step.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — COMPATIBILITY & SPECS (Inverted dark section)
          bg-[#1A1A1A] for contrast — entity SEO for specs
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Daztao NFC keychain technical specifications"
        className="bg-[#1A1A1A] text-white py-24 md:py-32 px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-16">

            {/* Left — headline */}
            <div className="lg:w-2/5 shrink-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-white/40 mb-6">
                Technical Specifications
              </span>
              <h2 className="text-[32px] md:text-[44px] font-black leading-tight tracking-tight">
                Engineered for universal compatibility.
              </h2>
              <p className="mt-6 text-[15px] text-white/55 leading-relaxed font-light max-w-sm">
                NTAG215 NFC technology. The same standard used in transit cards and contactless payments, now in a keychain.
              </p>
            </div>

            {/* Right — specs grid */}
            <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10">
              {[
                {
                  label: 'App Required',
                  value: 'None',
                  detail: 'Neither you nor the receiver needs to download anything.',
                },
                {
                  label: 'iOS Compatibility',
                  value: 'iPhone 7 and newer',
                  detail: 'Native background NFC reading on iOS 14 and above.',
                },
                {
                  label: 'Android Compatibility',
                  value: '99% of devices',
                  detail: 'Samsung, OnePlus, Xiaomi, Realme, Vivo, Oppo, and more.',
                },
                {
                  label: 'Water Resistance',
                  value: '100% Waterproof',
                  detail: 'Fully sealed. Survives rain, sweat, and daily carry.',
                },
                {
                  label: 'Battery',
                  value: 'None required',
                  detail: 'Powered inductively by the reading device. Works forever.',
                },
                {
                  label: 'Tap Limit',
                  value: 'Infinite',
                  detail: 'No tap limit, no expiry, no wear from repeated use.',
                },
                {
                  label: 'Link Updates',
                  value: 'Unlimited, free',
                  detail: 'Reprogram anytime with any free NFC writer app.',
                },
                {
                  label: 'Subscription Fee',
                  value: 'Rs. 0',
                  detail: 'One-time purchase. No monthly or annual charges.',
                },
              ].map((spec) => (
                <div key={spec.label} className="bg-[#1A1A1A] p-6 md:p-8 border border-white/8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-2">{spec.label}</p>
                  <p className="text-[18px] font-black text-white mb-2">{spec.value}</p>
                  <p className="text-[12px] text-white/45 leading-relaxed">{spec.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7 — USE CASES (3-column, long-tail SEO)
          No card boxes. Image placeholder above text.
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Who uses Daztao NFC keychains"
        className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-b border-gray-100"
      >
        <div className="max-w-[1200px] mx-auto">
          <header className="mb-16">
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-4">
              Use Cases
            </span>
            <h2 className="text-[32px] md:text-[44px] font-black tracking-tight text-[#1A1A1A]">
              Built for everyone who connects in person.
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {USE_CASES.map((uc, i) => (
              <article key={i}>
                {/* Use case images — indexed to match USE_CASES order */}
                {i === 0 && (
                  <div className="relative w-full aspect-[4/3] overflow-hidden mb-6">
                    <Image
                      src="/images/products/ig-white.jpg"
                      alt="Daztao NFC keychain for founders and professionals — digital business card replacement"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {i === 1 && (
                  <div className="relative w-full aspect-[4/3] overflow-hidden mb-6">
                    <Image
                      src="/images/instagram-cover.jpg"
                      alt="Daztao NFC keychain for content creators — grow your Instagram and TikTok audience offline"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {i === 2 && (
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-6 flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="Daztao NFC keychain for events and networking — the standard for in-person connection"
                      fill
                      className="object-contain p-10"
                    />
                  </div>
                )}

                <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 mb-3">
                  {uc.segment}
                </span>

                {/* H3 targets long-tail keyword naturally */}
                <h3 className="text-[20px] font-black text-[#1A1A1A] mb-3 leading-tight tracking-tight">
                  {uc.headline}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed font-light">
                  {uc.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 8 — BUY / CONVERSION
          Distraction-free. Product + price + link input + CTA.
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Buy a Daztao NFC smart keychain"
        className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-gray-50 border-y border-gray-100"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-start gap-12 md:gap-20">

            {/* RIGHT (mobile first) / LEFT (desktop) — Buy box */}
            <div className="w-full md:w-1/2">
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-4">
                Available Now
              </span>

              {/* AEO: H2 with product name */}
              <h2 className="text-[28px] md:text-[38px] font-black tracking-tight text-[#1A1A1A] mb-4 leading-tight">
                {product?.title ?? 'Daztao NFC Smart Keychain'}
              </h2>

              <p className="text-[14px] text-gray-500 leading-relaxed mb-8 font-light max-w-md">
                {product?.description ??
                  'Share your Instagram, Snapchat, YouTube, or any link with one tap. Waterproof, reprogrammable, and compatible with all modern iPhones and Android devices.'}
              </p>

              {/* Pricing — structured for AEO and Google Shopping */}
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <span className="text-[14px] font-bold text-[#1A1A1A] block">1 Keychain</span>
                    <span className="text-[12px] text-gray-400">Standard — free shipping on prepaid</span>
                  </div>
                  <span className="text-[20px] font-black text-[#1A1A1A]">Rs. {product?.price ?? 299}</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <span className="text-[14px] font-bold text-[#1A1A1A] block">
                      2 Keychains
                      <span className="ml-2 text-[10px] font-black uppercase tracking-widest bg-[#1A1A1A] text-white px-2 py-0.5">
                        Best Value
                      </span>
                    </span>
                    <span className="text-[12px] text-gray-400">
                      Bundle — save Rs. {(product?.price ?? 299) * 2 - 500}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[20px] font-black text-[#1A1A1A] block">Rs. 500</span>
                    <span className="text-[12px] text-gray-400 line-through">Rs. {(product?.price ?? 299) * 2}</span>
                  </div>
                </div>
              </div>

              {/* Profile Link Input */}
              <div className="mb-5">
                <label
                  htmlFor="hp-profile-link"
                  className="block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2"
                >
                  Your Profile Link
                </label>
                <div className={`flex items-center gap-3 h-[52px] border px-4 bg-white transition-all ${
                  linkError
                    ? 'border-red-400 bg-red-50/20'
                    : profileLink.trim()
                    ? 'border-green-400'
                    : 'border-gray-300 focus-within:border-[#1A1A1A]'
                }`}>
                  <Link2 className={`w-4 h-4 shrink-0 ${
                    linkError ? 'text-red-400' : profileLink.trim() ? 'text-green-500' : 'text-gray-400'
                  }`} aria-hidden="true" />
                  <input
                    id="hp-profile-link"
                    ref={linkInputRef}
                    type="url"
                    value={profileLink}
                    onChange={(e) => {
                      setProfileLink(e.target.value);
                      if (linkError) setLinkError(false);
                    }}
                    placeholder="e.g. instagram.com/yourhandle"
                    className="flex-1 bg-transparent text-[14px] text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none"
                    aria-label="Enter the profile link or URL to encode on your NFC keychain"
                    aria-describedby={linkError ? 'hp-link-error' : 'hp-link-hint'}
                  />
                  {profileLink.trim() && (
                    <Check className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />
                  )}
                </div>
                <AnimatePresence>
                  {linkError && (
                    <motion.p
                      id="hp-link-error"
                      role="alert"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[12px] text-red-500 font-medium mt-1.5"
                    >
                      Please enter the link you want to share before adding to cart.
                    </motion.p>
                  )}
                </AnimatePresence>
                <p id="hp-link-hint" className="text-[11px] text-gray-400 mt-1.5">
                  This will be encoded onto your NFC chip. You can update it anytime.
                </p>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAdd}
                disabled={addState !== 'idle'}
                className={`w-full h-[56px] flex items-center justify-center gap-3 font-black text-[14px] uppercase tracking-wide transition-all duration-300 ${
                  addState === 'done'
                    ? 'bg-green-600 text-white'
                    : 'bg-[#1A1A1A] text-white hover:opacity-80 active:scale-[0.99] disabled:opacity-60'
                }`}
                aria-label="Add Daztao NFC keychain to cart"
              >
                {addState === 'adding' && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                )}
                {addState === 'done' && <Check className="w-4 h-4" aria-hidden="true" />}
                {addState === 'idle' && <ShoppingBag className="w-4 h-4" aria-hidden="true" />}
                <span>
                  {addState === 'idle' && 'Add to Cart'}
                  {addState === 'adding' && 'Adding...'}
                  {addState === 'done' && 'Added to Cart'}
                </span>
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-4">
                Ships within 2 business days. Delivered across India in 5-7 days.
              </p>
            </div>

            {/* LEFT on desktop — Product image */}
            <div className="w-full md:w-1/2 md:sticky md:top-[88px]">
              <div className="w-full aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                {product?.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={`${product.title || 'Daztao NFC keychain'} — product photo`}
                    fill
                    className="object-cover"
                    unoptimized={product.images[0].startsWith('http')}
                  />
                ) : (
                  <Image
                    src="/logo.png"
                    alt="Daztao NFC keychain product"
                    fill
                    className="object-contain p-16"
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 9 — FAQ (AEO FAQPage Schema Structure)
          Thin border accordions. Semantic markup.
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Frequently asked questions about Daztao NFC keychains"
        className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-b border-gray-100"
      >
        <div className="max-w-[860px]">
          <header className="mb-14">
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-4">
              Questions
            </span>
            <h2 className="text-[28px] md:text-[40px] font-black tracking-tight text-[#1A1A1A]">
              Everything you need to know.
            </h2>
          </header>

          {/* AEO: dl/dt/dd for question-answer schema alignment */}
          <dl>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-gray-200">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-8 py-6 text-left group"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-${i}`}
                >
                  <dt className="text-[15px] md:text-[16px] font-semibold text-[#1A1A1A] group-hover:text-gray-600 transition-colors leading-snug">
                    {item.q}
                  </dt>
                  <div
                    className={`shrink-0 w-6 h-6 border border-gray-200 flex items-center justify-center text-gray-400 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <Plus className="w-3 h-3" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      id={`faq-${i}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <dd className="pb-6 pr-10 text-[14px] text-gray-500 leading-relaxed font-light">
                        {item.a}
                      </dd>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[#1A1A1A] transition-colors border-b border-gray-300 pb-0.5"
              aria-label="View all frequently asked questions"
            >
              View all questions <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 10 — EDITORIAL FOOTER CTA
          Massive DAZTAO logotype. Clean links.
      ══════════════════════════════════════════════════════════ */}
      <footer aria-label="Daztao site footer" className="bg-[#1A1A1A] text-white">
        {/* Top — editorial logotype */}
        <div className="px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-16 md:pb-20 border-b border-white/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
              {/* Massive logotype */}
              <h2 className="text-[80px] md:text-[120px] lg:text-[160px] font-black tracking-tight leading-none text-white">
                DAZTAO
              </h2>

              {/* CTA block */}
              <div className="flex flex-col items-start md:items-end gap-4 pb-2">
                <p className="text-[15px] text-white/55 max-w-xs leading-relaxed font-light md:text-right">
                  Ready to upgrade your networking? Get your NFC smart keychain today.
                </p>
                <button
                  onClick={() => router.push('/products')}
                  className="flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-[13px] font-black uppercase tracking-wide hover:bg-white hover:text-[#1A1A1A] transition-all"
                  aria-label="Get your Daztao NFC keychain"
                >
                  Get Your Keychain <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom — links row */}
        <div className="px-6 md:px-12 lg:px-20 py-8">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            {/* Nav links */}
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { label: 'Catalog', href: '/products' },
                { label: 'About', href: '/about' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Refund Policy', href: '/refund-policy' },
                { label: 'Shipping', href: '/shipping-policy' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[12px] text-white/40 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Legal */}
            <p className="text-[11px] text-white/25 shrink-0">
              &copy; {new Date().getFullYear()} Daztao. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
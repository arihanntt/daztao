'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

// ─────────────────────────────────────────────────────────────────────────────
// Bundle definitions — two offers, hardcoded for the VIP page
// ─────────────────────────────────────────────────────────────────────────────
const BUNDLES = [
  {
    id:         'duo-pack',
    tier:       'Duo Pack',
    qty:        2,
    price:      500,
    unitPrice:  250,
    retailTotal: 598, // 299 × 2
    saving:     98,
    headline:   '2 Keychains for Rs. 500',
    sub:        'Perfect for a backup or a business partner.',
    features: [
      '2 fully programmable NFC keychains',
      'Each links to any URL — Instagram, YouTube, LinkedIn',
      'Reprogrammable unlimited times at no extra cost',
      'Free shipping on prepaid orders',
    ],
    inverted: false,
    cta:        'Claim Offer — Rs. 500',
  },
  {
    id:         'creator-bundle',
    tier:       'Creator Bundle',
    qty:        5,
    price:      1000,
    unitPrice:  200,
    retailTotal: 1495, // 299 × 5
    saving:     495,
    headline:   '5 Keychains for Rs. 1000',
    sub:        'Outfit your entire team. Buy 4 at Rs. 250 each, get the 5th free.',
    features: [
      '5 fully programmable NFC keychains',
      'Each unit individually configured with any URL',
      'Priority processing — ships within 1 business day',
      'Dedicated WhatsApp support for setup',
    ],
    inverted: true,
    cta:        'Claim Creator Bundle — Rs. 1000',
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Add-to-cart state per bundle
// ─────────────────────────────────────────────────────────────────────────────
type AddState = 'idle' | 'added';

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function OffersPage() {
  const { data: session, status } = useSession();
  const router                    = useRouter();
  const { addToCart, openCart }   = useCart();

  const [addStates, setAddStates] = useState<Record<string, AddState>>({});

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/account/offers');
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

  // ── Claim offer — add N synthetic bundle items to cart ───────────────────
  const handleClaim = (bundle: typeof BUNDLES[number]) => {
    if (addStates[bundle.id] === 'added') return;

    // Build a synthetic product object for CartContext
    // Each keychain in the bundle gets added individually so links[] is populated
    const syntheticProduct = {
      _id:         bundle.id,
      slug:        bundle.id,
      title:       `${bundle.tier} (${bundle.qty} Keychains)`,
      price:       Math.round(bundle.price / bundle.qty), // per-unit price stored
      images:      ['/logo.png'],
      profileLink: '',  // User will edit links in the cart
    };

    for (let i = 0; i < bundle.qty; i++) {
      addToCart(syntheticProduct);
    }

    setAddStates((prev) => ({ ...prev, [bundle.id]: 'added' }));
    openCart();
    setTimeout(() => {
      setAddStates((prev) => ({ ...prev, [bundle.id]: 'idle' }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
      <Header />

      <main className="max-w-[1100px] mx-auto px-6 pt-[68px]">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="py-16 md:py-24 border-b border-gray-100">
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-3">
            Member Perks
          </span>
          <h1 className="text-[40px] md:text-[64px] font-black tracking-tight text-[#1A1A1A] leading-none">
            Exclusive<br />Member Offers.
          </h1>
          <p className="text-[15px] text-gray-500 font-light leading-relaxed mt-6 max-w-md">
            As a Daztao member, you get access to bundle pricing unavailable anywhere else.
            Claim an offer to add it directly to your cart.
          </p>
        </div>

        {/* ── Bundle cards grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-16 md:py-24">
          {BUNDLES.map((bundle, i) => (
            <motion.article
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col border p-8 md:p-10 transition-shadow hover:shadow-md ${
                bundle.inverted
                  ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                  : 'bg-white border-gray-200 text-[#1A1A1A]'
              }`}
            >
              {/* Tier label */}
              <div className="flex items-center justify-between mb-8">
                <span className={`text-[10px] font-bold uppercase tracking-[0.28em] ${
                  bundle.inverted ? 'text-white/40' : 'text-gray-400'
                }`}>
                  {bundle.tier}
                </span>
                {bundle.inverted && (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/10 border border-white/20 px-3 py-1 text-white">
                    <Zap className="w-3 h-3" aria-hidden="true" />
                    Best Value
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-3">
                <p className={`text-[40px] md:text-[52px] font-black leading-none tracking-tight ${
                  bundle.inverted ? 'text-white' : 'text-[#1A1A1A]'
                }`}>
                  Rs. {bundle.price.toLocaleString('en-IN')}
                </p>
                <p className={`text-[14px] font-light mt-2 ${
                  bundle.inverted ? 'text-white/60' : 'text-gray-500'
                }`}>
                  {bundle.headline}
                </p>
              </div>

              {/* Savings badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 border ${
                  bundle.inverted
                    ? 'border-white/20 text-white/70'
                    : 'border-green-200 text-green-700 bg-green-50'
                }`}>
                  Save Rs. {bundle.saving} vs. retail
                  <span className={`line-through font-normal text-[11px] ${
                    bundle.inverted ? 'text-white/30' : 'text-gray-400'
                  }`}>
                    Rs. {bundle.retailTotal}
                  </span>
                </span>
              </div>

              {/* Sub-description */}
              <p className={`text-[14px] leading-relaxed font-light mb-8 pb-8 border-b ${
                bundle.inverted ? 'text-white/65 border-white/10' : 'text-gray-500 border-gray-100'
              }`}>
                {bundle.sub}
              </p>

              {/* Feature list */}
              <ul className="flex flex-col gap-3 mb-10 flex-1" role="list">
                {bundle.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      bundle.inverted ? 'text-white/50' : 'text-gray-400'
                    }`} aria-hidden="true" />
                    <span className={`text-[13px] font-light leading-snug ${
                      bundle.inverted ? 'text-white/70' : 'text-gray-600'
                    }`}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <AnimatePresence mode="wait">
                <motion.button
                  key={addStates[bundle.id] ?? 'idle'}
                  initial={{ opacity: 0.8, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleClaim(bundle)}
                  disabled={addStates[bundle.id] === 'added'}
                  className={`w-full h-[56px] flex items-center justify-center gap-3 font-black text-[13px] uppercase tracking-wide transition-all ${
                    addStates[bundle.id] === 'added'
                      ? bundle.inverted
                        ? 'bg-green-500 text-white'
                        : 'bg-green-600 text-white'
                      : bundle.inverted
                      ? 'bg-white text-[#1A1A1A] hover:bg-gray-100'
                      : 'bg-[#1A1A1A] text-white hover:opacity-80 active:scale-[0.99]'
                  }`}
                  aria-label={`Claim ${bundle.tier} offer`}
                >
                  {addStates[bundle.id] === 'added' ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                      {bundle.cta}
                    </>
                  )}
                </motion.button>
              </AnimatePresence>

              {/* Link hint */}
              <p className={`text-[11px] text-center mt-4 font-light ${
                bundle.inverted ? 'text-white/35' : 'text-gray-400'
              }`}>
                You will enter your profile links in the cart before checkout.
              </p>
            </motion.article>
          ))}
        </div>

        {/* ── Fine print ────────────────────────────────────────────────── */}
        <div className="pb-24 border-t border-gray-100 pt-10">
          <p className="text-[12px] text-gray-400 font-light leading-relaxed max-w-lg">
            Exclusive member pricing is available to signed-in Daztao accounts only.
            Bundle offers cannot be combined with other discounts. All keychains are
            individually programmable with any HTTPS link and can be changed anytime.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft, Share2, Star, ShoppingBag, Check,
  Zap, Smartphone, Lock, Droplets, ArrowRight, Link2,
  ChevronLeft as ChevLeft, ChevronRight as ChevRight,
  Package, ArrowUpRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
type PackageKey = 'solo' | 'bundle';

const PACKAGES: Record<PackageKey, { label: string; qty: number; badge: string | null; getSavings: (p: number) => number }> = {
  solo:   { label: '1 Keychain',  qty: 1, badge: null,       getSavings: () => 0 },
  bundle: { label: '2 Keychains', qty: 2, badge: 'Best Value', getSavings: (p) => p * 2 - 500 },
};
const BUNDLE_PRICE = 500;

const REVIEWS = [
  { name: 'Kabir S.',       role: 'Delhi',   text: 'Used it at a club. Got 3 contacts in 5 minutes without typing a word. Absolutely worth it.',   stars: 5 },
  { name: 'Ananya M.',      role: 'Mumbai',  text: 'Matte finish looks premium. Works instantly on my iPhone 15 without any app whatsoever.',        stars: 5 },
  { name: 'Rohan & Simran', role: 'Pune',    text: 'Got the bundle pack. We share our Spotify playlists with people we meet. Insane conversation starter.', stars: 5 },
  { name: 'Dev K.',         role: 'Bengaluru', text: 'Simple. Fast. No app needed. Perfect for networking at college fest.',                         stars: 5 },
];

const SPECS = [
  { Icon: Smartphone, label: 'iOS & Android'   },
  { Icon: Zap,        label: 'No App Required'  },
  { Icon: Droplets,   label: 'Waterproof'       },
  { Icon: Lock,       label: 'Secure & Private' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ProductClient
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductClient({ id }: { id: string }) {
  const router = useRouter();
  const { addToCart, openCart } = useCart();

  const [product,         setProduct]         = useState<any>(null);
  const [related,         setRelated]         = useState<any[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [activeImg,       setActiveImg]       = useState(0);
  const [selectedPkg,     setSelectedPkg]     = useState<PackageKey>('solo');
  const [addState,        setAddState]        = useState<'idle' | 'adding' | 'added'>('idle');
  const [viewers,         setViewers]         = useState(24);
  const [profileLink,     setProfileLink]     = useState('');
  const [linkError,       setLinkError]       = useState(false);
  const [copied,          setCopied]          = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);

  // ── Data fetch ───────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([prod, all]) => {
      setProduct(prod);
      setRelated(all.filter((p: any) => p.slug !== id).sort(() => 0.5 - Math.random()).slice(0, 4));
    }).catch(() => {}).finally(() => setLoading(false));

    const iv = setInterval(() => setViewers(v => Math.max(12, v + Math.floor(Math.random() * 3) - 1)), 4500);
    return () => clearInterval(iv);
  }, [id]);

  // ── Gallery ──────────────────────────────────────────────────────────────
  const gallery = useMemo(() => {
    if (!product) return [];
    if (product.media?.length) return product.media;
    return (product.images ?? []).map((url: string) => ({ type: 'image', url }));
  }, [product]);

  // ── Pricing ──────────────────────────────────────────────────────────────
  const unitPrice   = product?.price ?? 299;
  const pkgPrice    = selectedPkg === 'solo' ? unitPrice : BUNDLE_PRICE;
  const savings     = PACKAGES[selectedPkg].getSavings(unitPrice);
  const qty         = PACKAGES[selectedPkg].qty;

  // ── Add to cart ──────────────────────────────────────────────────────────
  const handleAdd = () => {
    if (addState !== 'idle' || !product) return;
    const link = profileLink.trim();
    if (!link) { setLinkError(true); linkRef.current?.focus(); setTimeout(() => setLinkError(false), 3000); return; }
    setLinkError(false);
    setAddState('adding');
    const withLink = { ...product, profileLink: link };
    for (let i = 0; i < qty; i++) addToCart(withLink);
    setTimeout(() => { setAddState('added'); openCart(); setTimeout(() => setAddState('idle'), 2800); }, 600);
  };

  // ── Share ────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: product?.title, url: window.location.href }); } catch {} }
    else { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-[68px]">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-[#1A1A1A] rounded-full animate-spin" />
        </div>
      </>
    );
  }
  if (!product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans overflow-x-hidden">
      <Header />

      <main className="pt-[68px]">

        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 h-12 flex items-center gap-2 text-[12px] text-gray-400">
            <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#1A1A1A] transition-colors">Catalog</Link>
            <span>/</span>
            <span className="text-[#1A1A1A] font-semibold truncate">{product.title}</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SPLIT LAYOUT
        ═══════════════════════════════════════════════════════════════ */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* ── LEFT: Gallery ─────────────────────────────────────── */}
            <div className="lg:sticky lg:top-[88px]">

              {/* Main image — sharp rectangle, editorial proportions */}
              <div className="relative aspect-square w-full bg-gray-100 overflow-hidden mb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    {gallery[activeImg]?.type === 'video' ? (
                      <video src={gallery[activeImg].url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    ) : (
                      <Image
                        src={gallery[activeImg]?.url || '/placeholder.png'}
                        alt={product.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Sold out overlay */}
                {!inStock && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <span className="text-[12px] font-bold uppercase tracking-[0.24em] text-gray-400">Sold Out</span>
                  </div>
                )}

                {/* Top pills */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-1.5 bg-white border border-gray-100 shadow-sm px-3 py-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">{viewers} viewing</span>
                  </div>
                </div>

                {/* Share */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={handleShare}
                    className="w-9 h-9 bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition-colors"
                    aria-label="Share product"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Arrow nav on multi-image */}
                {gallery.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg(i => (i - 1 + gallery.length) % gallery.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition z-10">
                      <ChevLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setActiveImg(i => (i + 1) % gallery.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition z-10">
                      <ChevRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {gallery.map((m: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-[72px] h-[72px] flex-shrink-0 overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-[#1A1A1A]' : 'border-gray-200 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <Image src={m.url} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Buy Box ────────────────────────────────────── */}
            <div className="flex flex-col">

              {/* Title + stars */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h1 className="text-[32px] md:text-[42px] font-black tracking-tight text-[#1A1A1A] leading-tight mb-3">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <span className="text-[12px] text-gray-400 font-semibold">4.9 / 5</span>
                  <span className="text-gray-200">·</span>
                  <span className="text-[12px] text-gray-400">247 reviews</span>
                  <span className="text-gray-200 hidden md:block">·</span>
                  {inStock ? (
                    <span className="hidden md:flex items-center gap-1.5 text-[12px] text-green-600 font-semibold">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> In Stock
                    </span>
                  ) : (
                    <span className="hidden md:block text-[12px] text-red-500 font-semibold">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[15px] text-gray-500 leading-relaxed mb-8 font-light">
                {product.description ||
                  'The ultimate tool for instant connection. Share your Instagram, Spotify, and contact info with a single tap. No app required. Works on iPhone and Android.'}
              </p>

              {/* ── Package selector ──────────────────────────────── */}
              <div className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 mb-3">Select Package</p>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(PACKAGES) as [PackageKey, (typeof PACKAGES)[PackageKey]][]).map(([key, pkg]) => {
                    const price    = key === 'solo' ? unitPrice : BUNDLE_PRICE;
                    const pkgSave  = pkg.getSavings(unitPrice);
                    const active   = selectedPkg === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedPkg(key)}
                        className={`relative text-left p-4 border-2 transition-all duration-200 ${
                          active ? 'border-[#1A1A1A] bg-white' : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                      >
                        {pkg.badge && (
                          <span className={`absolute -top-2.5 left-4 text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 ${
                            active ? 'bg-[#1A1A1A] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {pkg.badge}
                          </span>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-4 h-4 border-2 flex items-center justify-center transition-all ${
                            active ? 'border-[#1A1A1A] bg-[#1A1A1A]' : 'border-gray-300 bg-white'
                          }`}>
                            {active && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 bg-white" />}
                          </div>
                          {pkgSave > 0 && (
                            <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5">
                              Save Rs. {pkgSave}
                            </span>
                          )}
                        </div>
                        <p className={`text-[13px] font-black mb-0.5 ${active ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>{pkg.label}</p>
                        <p className={`text-[12px] font-light ${active ? 'text-gray-500' : 'text-gray-400'}`}>
                          {key === 'bundle' ? 'Rs. 500 for both' : `Rs. ${unitPrice}`}
                        </p>
                        {key === 'bundle' && (
                          <p className="text-[11px] text-gray-300 line-through mt-0.5">Rs. {unitPrice * 2}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Price display ─────────────────────────────────── */}
              <div className="flex items-baseline gap-4 mb-7">
                <span className="text-[40px] font-black text-[#1A1A1A] tracking-tight leading-none">
                  Rs. {pkgPrice}
                </span>
                {savings > 0 && (
                  <span className="text-[14px] text-green-600 font-semibold">You save Rs. {savings}</span>
                )}
              </div>

              {/* ── Profile link input ────────────────────────────── */}
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 mb-2">
                  Your Profile Link *
                </p>
                <div className={`flex items-center gap-3 h-[52px] border-2 bg-white px-4 transition-all duration-200 ${
                  linkError
                    ? 'border-red-400 bg-red-50/30'
                    : profileLink.trim()
                    ? 'border-green-400'
                    : 'border-gray-200 focus-within:border-[#1A1A1A]'
                }`}>
                  <Link2 className={`w-4 h-4 shrink-0 transition-colors ${
                    linkError ? 'text-red-400' : profileLink.trim() ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <input
                    ref={linkRef}
                    type="url"
                    value={profileLink}
                    onChange={e => { setProfileLink(e.target.value); if (linkError) setLinkError(false); }}
                    placeholder="e.g. instagram.com/yourhandle"
                    className="flex-1 bg-transparent text-[14px] text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none"
                    aria-label="Profile link to encode on NFC chip"
                    aria-invalid={linkError}
                  />
                  {profileLink.trim() && <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                </div>
                <AnimatePresence>
                  {linkError && (
                    <motion.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-[12px] text-red-500 font-medium mt-2">
                      Please enter the link you want on your keychain.
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="text-[11px] text-gray-400 mt-2 font-light">
                  This is encoded onto your NFC chip. You can reprogram it anytime.
                </p>
              </div>

              {/* ── Add to Cart button ───────────────────────────── */}
              <AnimatePresence mode="wait">
                <motion.button
                  key={addState}
                  initial={{ opacity: 0.8, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleAdd}
                  disabled={addState !== 'idle' || !inStock}
                  className={`w-full h-[56px] flex items-center justify-center gap-3 font-black text-[14px] uppercase tracking-wide transition-all mb-3 ${
                    !inStock               ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : addState === 'added' ? 'bg-green-600 text-white'
                    : addState === 'adding'? 'bg-[#1A1A1A]/70 text-white cursor-wait'
                    :                       'bg-[#1A1A1A] text-white hover:opacity-80 active:scale-[0.99]'
                  }`}
                >
                  {addState === 'idle'   && <><ShoppingBag className="w-4 h-4" /> Add to Cart — Rs. {pkgPrice}</>}
                  {addState === 'adding' && <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>}
                  {addState === 'added'  && <><Check className="w-4 h-4" /> Added to Cart</>}
                </motion.button>
              </AnimatePresence>

              {!inStock && <p className="text-[12px] text-red-500 font-medium text-center mb-3">Currently out of stock</p>}

              {/* ── Specs strip ──────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-2 mt-5 mb-6">
                {SPECS.map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 bg-white border border-gray-200 px-3 py-3">
                    <Icon className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                    <span className="text-[12px] font-semibold text-gray-600">{label}</span>
                  </div>
                ))}
              </div>

              {/* Trust line */}
              <p className="text-center text-[11px] text-gray-400 font-light">
                Free shipping on prepaid orders · Delivered in 5–7 days · 7-day returns
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            HOW IT WORKS — 3-step strip
        ═══════════════════════════════════════════════════════════════ */}
        <section className="border-t border-gray-100 bg-white" aria-label="How Daztao NFC keychain works">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-3">How It Works</span>
                <h2 className="text-[28px] md:text-[36px] font-black tracking-tight text-[#1A1A1A] leading-tight">
                  Three steps.<br />That's all it takes.
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {[
                { n: '01', title: 'Place Your Order',    body: 'Select your keychain and enter the link you want encoded. We confirm and start fulfillment within 24 hours.' },
                { n: '02', title: 'It Arrives Ready',    body: 'Your Daztao keychain arrives pre-programmed with your link. No setup required on your part.' },
                { n: '03', title: 'Tap. Share. Done.',   body: 'Hold your keychain near any NFC-enabled phone. Your profile or link opens instantly. No app required.' },
              ].map(({ n, title, body }) => (
                <div key={n} className="py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0">
                  <span className="block text-[11px] font-bold text-gray-300 mb-4">{n}</span>
                  <h3 className="text-[16px] font-black text-[#1A1A1A] mb-3 tracking-tight">{title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed font-light">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            REVIEWS
        ═══════════════════════════════════════════════════════════════ */}
        <section className="border-t border-gray-100" aria-label="Customer reviews">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-3">Reviews</span>
                <h2 className="text-[28px] md:text-[36px] font-black tracking-tight text-[#1A1A1A] leading-tight">
                  What Customers Say.
                </h2>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-[12px] text-gray-400">4.9 / 5 — 247 reviews</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
              {REVIEWS.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-[#FAFAFA] p-8"
                >
                  <div className="flex gap-0.5 text-amber-400 mb-5">
                    {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-[14px] text-gray-600 leading-relaxed font-light mb-6">"{r.text}"</p>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wide">{r.name}</p>
                    <p className="text-[11px] text-gray-400 font-light">{r.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            RELATED PRODUCTS
        ═══════════════════════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section className="border-t border-gray-100 bg-white" aria-label="Related NFC keychains">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-3">More Keychains</span>
                  <h2 className="text-[28px] md:text-[36px] font-black tracking-tight text-[#1A1A1A]">You Might Also Like.</h2>
                </div>
                <Link href="/products" className="hidden md:flex items-center gap-1 text-[12px] font-black uppercase tracking-wide text-gray-400 hover:text-[#1A1A1A] transition-colors">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                {related.map((p, i) => (
                  <motion.button
                    key={p._id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    onClick={() => router.push(`/buy/${p.slug}`)}
                    className="group text-left"
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3">
                      {p.images?.[0] && (
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      )}
                    </div>
                    <p className="text-[13px] font-black text-[#1A1A1A] truncate">{p.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[13px] font-bold text-[#1A1A1A]">Rs. {p.price}</p>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1A1A1A] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ── Mobile sticky CTA ───────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</span>
          <span className="text-[18px] font-black text-[#1A1A1A]">Rs. {pkgPrice}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          disabled={addState !== 'idle' || !inStock}
          className={`flex-1 h-12 flex items-center justify-center gap-2 font-black text-[13px] uppercase tracking-wide transition-all ${
            addState === 'added' ? 'bg-green-600 text-white'
            : 'bg-[#1A1A1A] text-white hover:opacity-80 disabled:opacity-50'
          }`}
        >
          {addState === 'adding' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : addState === 'added' ? <><Check className="w-4 h-4" /> Added</>
          : 'Add to Cart'}
        </motion.button>
      </div>
      <div className="lg:hidden h-20" /> {/* spacer for sticky bar */}

      <Footer />
    </div>
  );
}
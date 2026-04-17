'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-100 w-full mb-4" />
      <div className="h-3 bg-gray-200 w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 w-1/3" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: any; index: number }) {
  const router = useRouter();
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => router.push(`/buy/${product.slug}`)}
      className="group cursor-pointer"
    >
      {/* Image container — sharp rectangle, no border-radius */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-4">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={`${product.title} — Daztao NFC keychain`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized={product.images[0].startsWith('http')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        )}

        {/* Stock badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400">Sold Out</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/10 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <span className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] text-[12px] font-black uppercase tracking-wider px-5 py-2.5 shadow-lg">
              View Product <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </motion.div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[14px] font-black text-[#1A1A1A] tracking-tight leading-snug truncate">
            {product.title}
          </h2>
          {product.description && (
            <p className="text-[12px] text-gray-400 font-light mt-0.5 truncate">
              {product.description}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[14px] font-black text-[#1A1A1A]">
            Rs. {product.price}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-[11px] text-gray-400 line-through">
              Rs. {product.originalPrice}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(r  => r.json())
      .then(d  => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      <Header />

      <main className="pt-[68px]">

        {/* ── Page header — editorial, full-width ─────────────────────── */}
        <div className="border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-4">
                  The Collection
                </span>
                <h1 className="text-[40px] md:text-[64px] font-black tracking-tight text-[#1A1A1A] leading-none">
                  All NFC<br />Keychains.
                </h1>
              </div>
              <div className="max-w-xs">
                <p className="text-[14px] text-gray-500 font-light leading-relaxed">
                  One tap to share your Instagram, Spotify, LinkedIn, or any link.
                  No app required. Ships pan-India.
                </p>
                {!loading && products.length > 0 && (
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400 mt-3">
                    {products.length} Product{products.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Trust bar ───────────────────────────────────────────────── */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
            <div className="flex flex-wrap gap-x-10 gap-y-3 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {['Free Shipping (Prepaid)', 'No App Required', 'Works iPhone & Android', '7-Day Returns', 'Ships in 1–2 Days'].map(t => (
                <span key={t} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Product grid ────────────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 gap-5 text-center">
                <div className="w-16 h-16 border border-gray-200 flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-[#1A1A1A] mb-1">No products yet.</h2>
                  <p className="text-[14px] text-gray-400 font-light">Check back soon for new NFC keychains.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom editorial band ────────────────────────────────────── */}
        {!loading && products.length > 0 && (
          <div className="border-t border-gray-100 bg-[#1A1A1A] text-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40 mb-3">Not Sure?</p>
                <h2 className="text-[28px] md:text-[36px] font-black tracking-tight leading-tight">
                  Every keychain works instantly.<br />
                  <span className="text-white/40">No setup. No app.</span>
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/faq" className="flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white text-[13px] font-black uppercase tracking-wide hover:bg-white hover:text-[#1A1A1A] transition-all">
                  Read FAQ
                </Link>
                <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1A1A1A] text-[13px] font-black uppercase tracking-wide hover:opacity-80 transition-opacity">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

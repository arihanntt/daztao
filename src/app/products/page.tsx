'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Instagram, Ghost, MessageCircle, ArrowRight, Music, Tag, Star, Zap, Smartphone, Youtube } from 'lucide-react';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// --- CINEMATIC SKELETON LOADER ---
const CinematicLoader = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pb-40">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="relative overflow-hidden rounded-sm bg-zinc-900/40 border border-white/5 aspect-[4/5]">
        {/* The "Scanline" Shimmer */}
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent z-10"
        />
        
        {/* Shape Placeholders */}
        <div className="absolute bottom-0 w-full p-8 space-y-4">
          <div className="w-10 h-10 bg-zinc-800/50 rounded-lg animate-pulse" />
          <div className="w-3/4 h-8 bg-zinc-800/40 rounded animate-pulse" />
          <div className="w-full h-4 bg-zinc-800/20 rounded animate-pulse" />
          <div className="flex justify-between pt-4 border-t border-white/5">
            <div className="w-20 h-2 bg-zinc-800/30 rounded" />
            <div className="w-4 h-4 bg-zinc-800/30 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// --- HELPER: GENERATE METADATA ---
const getProductMeta = (type: string) => {
  switch(type) {
    case 'instagram': 
      return { 
        icon: <Instagram className="w-5 h-5 text-rose-400" />,
        tagline: "Stop repeating your username.",
        badge: "CREATOR FAVORITE",
        color: "group-hover:text-rose-400"
      };
    case 'snapchat': 
      return { 
        icon: <Ghost className="w-5 h-5 text-yellow-400" />,
        tagline: "Keep the streak alive.",
        badge: null,
        color: "group-hover:text-yellow-400"
      };
    case 'youtube': 
      return { 
        icon: <Youtube className="w-5 h-5 text-red-500" />,
        tagline: "Turn a conversation into a view.",
        badge: "MUST HAVE",
        color: "group-hover:text-red-500"
      };
    case 'whatsapp': 
      return { 
        icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
        tagline: "The modern business card.",
        badge: "BEST SELLER",
        color: "group-hover:text-emerald-400"
      };
    default: 
      return { 
        icon: <Tag className="w-5 h-5 text-white" />,
        tagline: "Your digital identity, one tap away.",
        badge: null,
        color: "group-hover:text-white"
      };
  }
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  useEffect(() => {
    NProgress.configure({ showSpinner: false, speed: 500 });
    NProgress.start();

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
        NProgress.done();
      })
      .catch(() => {
        NProgress.done();
        setLoading(false);
      });
      
    return () => { NProgress.done(); };
  }, []);

  const handleProductClick = (slug: string, id: string) => {
    if (isNavigating) return;
    setIsNavigating(id);
    NProgress.start();
    router.push(`/buy/${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 relative overflow-x-hidden">
      
      <style jsx global>{`
        #nprogress .bar { background: #fff !important; height: 3px !important; z-index: 99999; }
        #nprogress .peg { box-shadow: 0 0 10px #fb7185, 0 0 5px #fb7185 !important; }
      `}</style>

      {/* --- RETRO GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <Header />
      
      <section className="relative pt-40 px-6 z-10 pb-20">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
           <Image src="/images/choose-cover.jpg" alt="BG" fill className="object-cover" priority />
           <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#080808]/80 to-[#080808]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-2xl mb-24">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="block text-[10px] font-bold tracking-[0.3em] text-zinc-500 mb-6 uppercase">
              The Collection
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-serif italic text-white leading-[0.9] tracking-tight mb-8">
              Choose how you’re <br/> remembered.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400 text-lg font-light max-w-md leading-relaxed">
              Pick the keychain that matches your vibe.
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <CinematicLoader />
              </motion.div>
            ) : (
              <motion.div 
                key="grid" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pb-40"
              >
                {products.map((product, i) => {
                  const meta = getProductMeta(product.iconType);
                  const isThisNavigating = isNavigating === product._id;
                  
                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleProductClick(product.slug, product._id)}
                      className={`group relative cursor-pointer ${isNavigating && !isThisNavigating ? 'opacity-40 grayscale blur-[2px]' : ''} transition-all duration-700`}
                    >
                      <div className="aspect-[4/5] relative overflow-hidden rounded-sm bg-zinc-900/20 border border-white/5 group-hover:border-white/20 transition-all duration-500">
                        {/* Image with Direct URL Support */}
                        {product.images?.[0] && (
                          <Image 
                            src={product.images[0]} 
                            alt={product.title} 
                            fill 
                            className={`object-cover transition-all duration-1000 ease-out 
                              ${isThisNavigating ? 'scale-110 opacity-40 blur-md' : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'}`}
                            unoptimized={product.images[0].startsWith('http')}
                          />
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                        {isThisNavigating && (
                          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                             <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                          </div>
                        )}

                        {meta.badge && (
                          <div className="absolute top-4 left-4 bg-white text-black text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest z-20">
                            {meta.badge}
                          </div>
                        )}

                        <div className="absolute bottom-0 w-full p-8 z-20">
                          <div className="mb-4">
                            <div className="mb-3 transform group-hover:-translate-y-1 transition-transform duration-500">{meta.icon}</div>
                            <h2 className={`text-3xl font-serif text-white mb-2 transition-colors duration-300 ${meta.color}`}>
                              {product.title}
                            </h2>
                            <p className="text-sm text-white/90 font-medium mb-2 font-sans tracking-wide">
                              {meta.tagline}
                            </p>
                          </div>

                          <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 mb-6">
                             <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-500">
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3"/> Tap</span>
                                <span className="flex items-center gap-1"><Smartphone className="w-3 h-3"/> NFC</span>
                                <span className="flex items-center gap-1"><Star className="w-3 h-3"/> Pro</span>
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/10 group-hover:border-white/30 transition-colors">
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                               {isThisNavigating ? 'Connecting...' : 'View Detail'}
                             </span>
                             <ArrowRight className={`w-4 h-4 text-zinc-500 transition-all duration-300 ${!isThisNavigating && 'group-hover:text-white group-hover:translate-x-1'}`} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
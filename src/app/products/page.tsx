'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Instagram, Ghost, MessageCircle, ArrowRight, Music, Tag, Star, Zap, Smartphone } from 'lucide-react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

// --- HELPER: GENERATE INTENT & METADATA ---
const getProductMeta = (type: string) => {
  switch(type) {
    case 'instagram': 
      return { 
        icon: <Instagram className="w-5 h-5 text-rose-400" />,
        tagline: "For creators who hate spelling usernames.",
        badge: "CREATOR FAVORITE",
        color: "group-hover:text-rose-400"
      };
    case 'snapchat': 
      return { 
        icon: <Ghost className="w-5 h-5 text-yellow-400" />,
        tagline: "Keep the streak alive. Instantly.",
        badge: null,
        color: "group-hover:text-yellow-400"
      };
    case 'whatsapp': 
      return { 
        icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
        tagline: "Business connection, zero friction.",
        badge: "BEST SELLER",
        color: "group-hover:text-emerald-400"
      };
    case 'spotify': 
      return { 
        icon: <Music className="w-5 h-5 text-green-400" />,
        tagline: "Turn moments into memories.",
        badge: null,
        color: "group-hover:text-green-400"
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

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 selection:text-white relative overflow-x-hidden">
      
      {/* --- RETRO GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <Header />
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 px-6 z-10 pb-20">
        
        {/* Background Image (User Requested to Keep) */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
           <Image 
             src="/images/choose-cover.jpg" 
             alt="Background" 
             fill 
             className="object-cover"
             priority
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#080808]/80 to-[#080808]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-2xl mb-24">
            <motion.span 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="block text-[10px] font-bold tracking-[0.3em] text-zinc-500 mb-6 uppercase"
            >
              The Collection
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif italic text-white leading-[0.9] tracking-tight mb-8"
            >
              Choose how you’re <br/> remembered.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg font-light max-w-md leading-relaxed"
            >
              Pick the DAZTAO keychain that matches your vibe.
            </motion.p>
          </div>

          {loading ? (
            // --- SKELETON PRELOADER (Minimal) ---
            <div className="grid lg:grid-cols-3 gap-8 pb-32">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-zinc-900/30 animate-pulse rounded-sm border border-white/5" />
              ))}
            </div>
          ) : (
            // --- PRODUCT GRID ---
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pb-40">
              {products.map((product, i) => {
                const meta = getProductMeta(product.iconType);
                
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => router.push(`/buy/${product.slug}`)}
                    className="group relative cursor-pointer"
                  >
                    {/* Card Container */}
                    <div className="aspect-[4/5] relative overflow-hidden rounded-sm bg-zinc-900/20 border border-white/5 group-hover:border-white/20 transition-colors duration-500">
                      
                      {/* Image */}
                      {product.images?.[0] && (
                        <Image 
                          src={product.images[0]} 
                          alt={product.title} 
                          fill 
                          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                      
                      {/* Cinematic Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90" />

                      {/* Top Badge (Most Popular) */}
                      {meta.badge && (
                        <div className="absolute top-4 left-4 bg-white text-black text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-sm z-20 shadow-lg">
                          {meta.badge}
                        </div>
                      )}

                      {/* Content Area */}
                      <div className="absolute bottom-0 w-full p-8 z-20">
                        
                        {/* Icon & Title */}
                        <div className="mb-4">
                          <div className="mb-3">{meta.icon}</div>
                          <h2 className={`text-3xl font-serif text-white mb-2 transition-colors duration-300 ${meta.color}`}>
                            {product.title}
                          </h2>
                          
                          {/* THE INTENT LINE (New) */}
                          <p className="text-sm text-white/90 font-medium mb-2 font-sans tracking-wide">
                            {meta.tagline}
                          </p>
                          
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-light">
                            {product.description}
                          </p>
                        </div>

                        {/* Hover Intent Reveal (Features) */}
                        <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 mb-6">
                           <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-400">
                              <span className="flex items-center gap-1"><Zap className="w-3 h-3"/> Instant</span>
                              <span className="flex items-center gap-1"><Smartphone className="w-3 h-3"/> No App</span>
                              <span className="flex items-center gap-1"><Star className="w-3 h-3"/> Premium</span>
                           </div>
                        </div>

                        {/* Action Row */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10 group-hover:border-white/30 transition-colors">
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                             Select / Preview
                           </span>
                           <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
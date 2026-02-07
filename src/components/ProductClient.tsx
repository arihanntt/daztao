'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Heart, ArrowRight, Zap, Play, Sparkles, 
  User, Lock, Smartphone, Instagram, 
  Share2, Star, TrendingUp
} from 'lucide-react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

// --- TYPES ---
type VibeMode = 'solo' | 'couple' | 'bestie';

// --- CONFIGURATION (UPDATED FOR SOLID UI) ---
const VIBE_CONFIG = {
  solo: {
    // Solid colors, no gradients
    bg: 'bg-zinc-900',
    border: 'border-zinc-700',
    activeBorder: 'border-white',
    text: 'text-white',
    subtext: 'text-zinc-400',
    iconBg: 'bg-zinc-800',
    iconColor: 'text-white',
    btnColor: 'bg-white text-black hover:bg-zinc-200',
    badge: "STANDARD"
  },
  couple: {
    bg: 'bg-[#1a0505]', // Very dark red, almost black
    border: 'border-rose-900',
    activeBorder: 'border-rose-500',
    text: 'text-rose-100',
    subtext: 'text-rose-400',
    iconBg: 'bg-rose-950',
    iconColor: 'text-rose-500',
    btnColor: 'bg-rose-600 text-white hover:bg-rose-700',
    badge: "VALENTINE'S OFFER"
  },
  bestie: {
    bg: 'bg-[#0f0518]', // Very dark violet
    border: 'border-violet-900',
    activeBorder: 'border-violet-500',
    text: 'text-violet-100',
    subtext: 'text-violet-400',
    iconBg: 'bg-violet-950',
    iconColor: 'text-violet-500',
    btnColor: 'bg-violet-600 text-white hover:bg-violet-700',
    badge: "2 FOR ₹500"
  }
};

const RAW_REVIEWS = [
  { name: "Kabir", role: "Clubber", text: "Used it at a club in Delhi. Got 3 snaps in 5 mins without typing a word. Crazy.", stars: 5 },
  { name: "Ananya", role: "Creator", text: "Aesthetic is clean. Matte finish looks expensive. Works instantly on my iPhone 15.", stars: 5 },
  { name: "Rohan & Simran", role: "Couple", text: "Got the couple pack. It's actually useful, we use it to share our Spotify playlists.", stars: 4 },
  { name: "Dev", role: "Student", text: "Simple. Fast. No app needed. Exactly what I wanted.", stars: 5 }
];

export default function ProductClient({ id }: { id: string }) {
  const router = useRouter();
  const { addToCart } = useCart();

  // Data State
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [vibe, setVibe] = useState<VibeMode>('solo'); 
  const [isAdding, setIsAdding] = useState(false);
  const [viewers, setViewers] = useState(24);

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch(`/api/products/${id}`);
        if (!prodRes.ok) throw new Error('Product not found');
        const prodData = await prodRes.json();
        setProduct(prodData);

        const allRes = await fetch('/api/products');
        const allData = await allRes.json();
        const related = allData
          .filter((p: any) => p.slug !== id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRelatedProducts(related);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();

    const interval = setInterval(() => {
      setViewers(prev => Math.max(14, prev + Math.floor(Math.random() * 3) - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [id]);

  // --- 2. LOGIC CORE ---
  const gallery = useMemo(() => {
    if (!product) return [];
    if (product.media?.length) return product.media;
    if (product.images?.length) return product.images.map((url: string) => ({ type: 'image', url }));
    return [];
  }, [product]);

  const quantity = vibe === 'solo' ? 1 : 2;
  const price = vibe === 'solo' ? (product?.price || 0) : 500;
  const originalPrice = (product?.price || 0) * quantity;
  const savings = originalPrice - price;
  
  const theme = VIBE_CONFIG[vibe];

  const handleAddToCart = () => {
    setIsAdding(true);
    for(let i=0; i<quantity; i++) addToCart(product);
    setTimeout(() => { setIsAdding(false); router.push('/cart'); }, 800);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product.title, url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied");
    }
  };

  // --- 3. DYNAMIC SEO SCHEMA ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product?.title,
    "image": gallery[0]?.url,
    "description": product?.description || "NFC Keychain",
    "brand": { "@type": "Brand", "name": "DAZTAO" },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": "INR",
      "price": price,
      "availability": product?.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 font-mono text-xs tracking-widest">LOADING...</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans pb-20 overflow-x-hidden">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-[1200px] mx-auto pt-24 px-4 lg:px-8">
        
        {/* NAV & STATUS */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
          <button onClick={() => router.push('/products')} className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2">
            <ArrowRight className="w-3 h-3 rotate-180" /> Catalog
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">{viewers} viewing</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* ================= LEFT: SQUARE IMAGE BOX ================= */}
          <div className="lg:col-span-7 h-fit sticky top-24">
            <div className="space-y-4">
              <div className="aspect-square w-full relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                {/* Image/Video */}
                {gallery[activeMediaIndex]?.type === 'video' ? (
                  <video 
                    src={gallery[activeMediaIndex].url}
                    className="w-full h-full object-cover"
                    autoPlay muted loop playsInline
                  />
                ) : (
                  <Image 
                    src={gallery[activeMediaIndex]?.url || '/placeholder.png'} 
                    alt={product.title}
                    fill className="object-cover"
                    priority
                  />
                )}
                
                {/* Clean Pill Badge - No Glow */}
                <div className="absolute top-4 left-4 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-full flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-white"></div>
                   <span className="text-[10px] font-bold uppercase tracking-wider">{theme.badge}</span>
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {gallery.map((media: any, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveMediaIndex(i)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        activeMediaIndex === i ? 'border-white' : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={media.url} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT: THE SOLID INFO BOX ================= */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Title Section */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl lg:text-5xl font-black text-white mb-2 uppercase tracking-tight leading-none">
                  {product.title}
                </h1>
                <button onClick={handleShare} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition"><Share2 className="w-5 h-5 text-zinc-400"/></button>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-2">
                 <div className="flex text-amber-500"><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/></div>
                 <span>|</span>
                 <span>4.9/5 RATING</span>
              </div>
            </div>

            {/* --- SOLID 3D CARDS (NO GLOW) --- */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Mode</span>
                {savings > 0 && <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded">SAVING ₹{savings}</span>}
              </div>

              {/* SOLO */}
              <button 
                onClick={() => setVibe('solo')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${vibe === 'solo' ? 'bg-zinc-800 border-white' : 'bg-transparent border-zinc-800 hover:bg-zinc-900'}`}
              >
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-900 text-white border border-zinc-700`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="text-sm font-bold text-white">Solo Flex</div>
                       <div className="text-[11px] text-zinc-500">1 Unit • Standard Price</div>
                    </div>
                 </div>
                 <div className="text-sm font-bold font-mono">₹{product.price}</div>
              </button>

              {/* COUPLE */}
              <button 
                onClick={() => setVibe('couple')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${vibe === 'couple' ? 'bg-[#1a0505] border-rose-500' : 'bg-transparent border-zinc-800 hover:bg-zinc-900'}`}
              >
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${vibe === 'couple' ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-zinc-500'} border ${vibe === 'couple' ? 'border-rose-500' : 'border-zinc-700'}`}>
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                       <div className={`text-sm font-bold ${vibe === 'couple' ? 'text-rose-200' : 'text-zinc-400'}`}>Love Birds</div>
                       <div className={`text-[11px] ${vibe === 'couple' ? 'text-rose-400' : 'text-zinc-600'}`}>2 Units • Valentine's Deal</div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className={`text-sm font-bold font-mono ${vibe === 'couple' ? 'text-rose-200' : 'text-zinc-400'}`}>₹500</div>
                    <div className="text-[10px] text-zinc-600 line-through">₹{product.price * 2}</div>
                 </div>
              </button>

              {/* BESTIE */}
              <button 
                onClick={() => setVibe('bestie')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${vibe === 'bestie' ? 'bg-[#0f0518] border-violet-500' : 'bg-transparent border-zinc-800 hover:bg-zinc-900'}`}
              >
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${vibe === 'bestie' ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-zinc-500'} border ${vibe === 'bestie' ? 'border-violet-500' : 'border-zinc-700'}`}>
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                       <div className={`text-sm font-bold ${vibe === 'bestie' ? 'text-violet-200' : 'text-zinc-400'}`}>The Wingman</div>
                       <div className={`text-[11px] ${vibe === 'bestie' ? 'text-violet-400' : 'text-zinc-600'}`}>2 Units • Network 2x</div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className={`text-sm font-bold font-mono ${vibe === 'bestie' ? 'text-violet-200' : 'text-zinc-400'}`}>₹500</div>
                    <div className="text-[10px] text-zinc-600 line-through">₹{product.price * 2}</div>
                 </div>
              </button>
            </div>

            {/* Total & CTA */}
            <div className="border-t border-zinc-800 pt-6">
               <div className="flex justify-between items-end mb-6">
                 <div>
                    <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Total</div>
                    <div className="text-4xl font-black text-white tracking-tight">₹{price}</div>
                 </div>
               </div>

               <button
                 onClick={handleAddToCart}
                 disabled={isAdding || product.stock <= 0}
                 className={`w-full h-14 rounded-xl font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-3 ${theme.btnColor}`}
               >
                 {isAdding ? "PROCESSING..." : (
                   <>
                     <span>{vibe === 'solo' ? 'ADD TO CART' : 'GRAB THE DEAL'}</span>
                     <ArrowRight className="w-4 h-4" />
                   </>
                 )}
               </button>
            </div>

            {/* Description */}
            <div className="mt-8 prose prose-invert prose-sm text-zinc-400">
              <p>{product.description || "The ultimate tool for instant connection. Share your Instagram, Snapchat, and contact info with a single tap. No app required for the other person. Works on iPhone & Android."}</p>
            </div>

            {/* Solid Specs */}
            <div className="grid grid-cols-2 gap-2 mt-8">
              {[
                { icon: Smartphone, label: "iOS & Android" },
                { icon: Sparkles, label: "No App Required" },
                { icon: Lock, label: "Secure & Private" },
                { icon: TrendingUp, label: "Waterproof" }
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <f.icon className="w-4 h-4 text-zinc-500" /> 
                  <span className="text-[11px] font-bold text-zinc-300">{f.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ================= RAW FEEDBACK ================= */}
        <section className="mt-32">
           <h2 className="text-xl font-bold text-white mb-8 border-l-4 border-white pl-4">Feedback</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {RAW_REVIEWS.map((r, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                <div className="flex text-amber-500 mb-3"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed">"{r.text}"</p>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                   <span className="text-xs font-bold text-white uppercase">{r.name}</span>
                   <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">{r.role}</span>
                </div>
              </div>
            ))}
           </div>
        </section>

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 border-t border-zinc-800 pt-20 mb-20">
            <h2 className="text-xl font-bold text-white mb-8">Similar keychains</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div key={p._id} onClick={() => router.push(`/buy/${p.slug}`)} className="group cursor-pointer">
                  <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden mb-3 border border-zinc-800 group-hover:border-zinc-500 transition-colors relative">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">NO IMAGE</div>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">{p.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-zinc-500">₹{p.price}</p>
                    <ArrowRight className="w-3 h-3 text-white -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* --- SOLID MOBILE STICKY BAR --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b] border-t border-zinc-800 p-4">
        <div className="flex items-center justify-between">
           <div>
             <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 text-zinc-500`}>Total</span>
             <span className="text-xl font-black text-white">₹{price}</span>
           </div>
           <button 
             onClick={handleAddToCart}
             disabled={product.stock <= 0 || isAdding}
             className={`px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest ${theme.btnColor}`}
           >
             {isAdding ? "..." : "BUY NOW"}
           </button>
        </div>
      </div>

    </div>
  );
}
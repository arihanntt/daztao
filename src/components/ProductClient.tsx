'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Star, Check, ArrowLeft, Share2, Minus, Plus, ChevronDown, ChevronUp, 
  ShieldCheck, Truck, RotateCcw, Zap, Users, Smartphone, Globe, Music, XCircle
} from 'lucide-react';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

// --- HELPERS ---
const getStockStatus = (stock: number) => {
  if (stock <= 0) return { text: "Sold Out", color: "text-zinc-500", bg: "bg-zinc-800" };
  if (stock < 5) return { text: `Only ${stock} left`, color: "text-rose-400", bg: "bg-rose-500/20" };
  return { text: "In Stock & Ready", color: "text-emerald-400", bg: "bg-emerald-500/20" };
};

const REVIEWS = [
  { name: "Aria S.", role: "Influencer", rating: 5, date: "2d ago", text: "Used it for my Instagram. Everyone asks where I got it. The matte feel is nostalgic yet modern.", verified: true },
  { name: "Davide R.", role: "DJ / Artist", rating: 5, date: "1w ago", text: "Tapped it on a fan's phone and my Spotify opened instantly. Essential for gigs.", verified: true },
  { name: "Rahul M.", role: "Founder", rating: 5, date: "2w ago", text: "Better than paper cards. It just works.", verified: true }
];

const FAQS = [
  { q: "Do I need an app?", a: "No app required! It uses native NFC technology built into iPhone XS+ and almost all Androids." },
  { q: "Can I change the link later?", a: "Yes. You can reprogram the link anytime using free NFC tools. It's yours forever." },
  { q: "Is it waterproof?", a: "Yes, fully waterproof and durable for daily chaos." },
];

export default function ProductClient({ id }: { id: string }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isAdding, setIsAdding] = useState(false);
  const [viewers, setViewers] = useState(12);

  // --- LOGIC ---
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
    
    // Simulate live viewers
    setViewers(Math.floor(Math.random() * 30) + 10);
  }, [id]);

  const handleAddToCart = () => {
    setIsAdding(true);
    for(let i=0; i<quantity; i++) addToCart(product);
    setTimeout(() => { setIsAdding(false); router.push('/cart'); }, 600);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product.title, url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied");
    }
  };

  // --- DISCOUNT LOGIC ---
  const basePrice = product ? product.price * quantity : 0;
  const discount = quantity >= 2 ? basePrice * 0.10 : 0;
  const finalPrice = Math.floor(basePrice - discount);

  if (loading) return <div className="min-h-screen bg-[#080808]" />;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 selection:text-white pb-32 overflow-x-hidden relative">
      
      {/* --- RETRO GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <Header />

      <main className="max-w-7xl mx-auto pt-32 px-6 relative z-10">
        
        {/* Breadcrumb */}
        <button onClick={() => router.push('/products')} className="flex items-center gap-2 text-[10px] font-serif italic text-zinc-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Collection
        </button>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* ================= LEFT: GALLERY ================= */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[4/5] w-full relative rounded-sm overflow-hidden bg-zinc-900"
            >
              {product.images?.[activeImage] && (
                <Image 
                  src={product.images[activeImage]} 
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              )}
              {/* Retro Badge */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"/>
                 <span className="text-[10px] uppercase tracking-widest text-white/90">{viewers} people viewing</span>
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images?.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 rounded-sm overflow-hidden border transition-all duration-300 ${activeImage === i ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-80'}`}
                >
                  <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" sizes="80px"/>
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: INFO & BUY ================= */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="sticky top-32 space-y-8">
              
              {/* Title & Power Statement */}
              <div>
                <div className="flex justify-between items-start mb-2">
                   <h1 className="text-4xl lg:text-6xl font-serif tracking-tight text-white leading-none">
                     {product.title}
                   </h1>
                   <button onClick={handleShare} className="text-zinc-500 hover:text-white transition"><Share2 className="w-5 h-5" /></button>
                </div>
                
                {/* FIX 1: Power Statement */}
                <p className="text-lg font-light text-zinc-300 mt-2 mb-6 leading-relaxed">
                  Stop typing usernames. Start tapping identities.
                </p>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-light text-white">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-zinc-600 line-through font-serif italic">₹{product.originalPrice}</span>
                    )}
                    {quantity >= 2 && (
                      <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-widest border border-rose-500/20 rounded-sm animate-pulse">
                        10% Bundle Off
                      </span>
                    )}
                  </div>
                  {/* FIX 3: Urgency Line */}
                  <p className="text-[10px] text-rose-400 font-medium tracking-wide uppercase">
                    Custom programmed after order • Ships in 48 hrs
                  </p>
                </div>
              </div>

              {/* Description (Split for Emotion) */}
              <div className="space-y-4">
                <p className="text-white text-sm font-medium leading-relaxed">
                  Built for moments where typing feels awkward.
                </p>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">
                  {product.description || "Powered by NFC technology. No app required. Works instantly on iPhone and Android."}
                </p>
              </div>

              {/* BUYING INTERFACE */}
              <div className="bg-[#111] border border-zinc-800 p-6 rounded-sm space-y-6">
                
                {/* Quantity */}
                <div className="flex items-center justify-between">
                   <span className="text-xs uppercase tracking-widest text-zinc-500">Quantity</span>
                   <div className="flex items-center border border-zinc-700 h-8">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center hover:bg-white hover:text-black transition"><Minus className="w-3 h-3"/></button>
                     <span className="w-8 text-center text-sm font-mono">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-full flex items-center justify-center hover:bg-white hover:text-black transition"><Plus className="w-3 h-3"/></button>
                   </div>
                </div>

                {/* FIX 4: Emotional CTA */}
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAdding}
                  className="w-full h-14 bg-white text-black font-bold text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isAdding ? (
                    "PROCESSING..."
                  ) : (
                    <>
                      <span>OWN IT — ₹{finalPrice}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </button>

                {/* FIX 2: Aggressive "How it works" */}
                <div className="border-t border-zinc-800 pt-6">
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white mb-4">It takes 2 seconds</h3>
                   <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                         <span className="block text-white font-serif italic text-lg mb-1">Tap</span>
                         <span className="text-zinc-500">Hold near phone</span>
                      </div>
                      <div>
                         <span className="block text-white font-serif italic text-lg mb-1">Open</span>
                         <span className="text-zinc-500">Link launches</span>
                      </div>
                      <div>
                         <span className="block text-white font-serif italic text-lg mb-1">Connect</span>
                         <span className="text-zinc-500">You're remembered</span>
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= SECTIONS BELOW FOLD ================= */}
        
        {/* USE CASES */}
        <section className="mt-32 border-t border-zinc-900 pt-20">
           <h2 className="text-2xl font-serif italic text-white mb-10">Made for...</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Smartphone, label: "Creators", sub: "Share content instantly" },
                { icon: Music, label: "Musicians", sub: "Link Spotify/Soundcloud" },
                { icon: Globe, label: "Founders", sub: "Network faster" },
                { icon: Users, label: "Everyone", sub: "Impress your friends" },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-900/30 p-6 border border-zinc-800 hover:border-zinc-600 transition duration-300 group">
                   <item.icon className="w-6 h-6 text-zinc-400 mb-4 group-hover:text-white transition" />
                   <h3 className="text-sm font-bold text-white mb-1">{item.label}</h3>
                   <p className="text-xs text-zinc-500">{item.sub}</p>
                </div>
              ))}
           </div>
        </section>

        {/* FIX 5: "Who this is NOT for" (Premium Filter) */}
        <section className="mt-20 border border-zinc-800 p-10 relative overflow-hidden group">
           <div className="absolute inset-0 bg-rose-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
           <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl font-serif italic text-white mb-6">This is not for everyone.</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                 <li className="flex items-center gap-3"><XCircle className="w-4 h-4 text-zinc-600"/> If you like typing out long usernames.</li>
                 <li className="flex items-center gap-3"><XCircle className="w-4 h-4 text-zinc-600"/> If paper business cards getting thrown away feels fine.</li>
                 <li className="flex items-center gap-3"><XCircle className="w-4 h-4 text-zinc-600"/> If first impressions don't matter to you.</li>
              </ul>
           </div>
        </section>

        {/* REVIEWS & FAQ */}
        <div className="grid md:grid-cols-2 gap-16 mt-20 border-t border-zinc-900 pt-20">
           
           {/* REVIEWS */}
           <div>
              {/* FIX 6: Reviews Title */}
              <h3 className="text-xl font-serif italic text-white mb-8">People remember this.</h3>
              <div className="space-y-8">
                 {REVIEWS.map((r, i) => (
                    <div key={i} className="pb-8 border-b border-zinc-900 last:border-0">
                       <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-white gap-0.5">
                             {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-white" />)}
                          </div>
                          {r.verified && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wide">Verified Buyer</span>}
                       </div>
                       <p className="text-sm text-zinc-300 mb-3 leading-relaxed">"{r.text}"</p>
                       <div className="text-xs text-zinc-500 font-mono">
                          {r.name} — <span className="text-zinc-600">{r.role}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* FAQ */}
           <div>
              <h3 className="text-xl font-serif italic text-white mb-8">Questions?</h3>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border border-zinc-800 p-6 hover:bg-zinc-900/30 transition duration-300 cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-medium text-white">{faq.q}</span>
                       {openFaq === i ? <ChevronUp className="w-4 h-4 text-zinc-500"/> : <ChevronDown className="w-4 h-4 text-zinc-500"/>}
                    </div>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="pt-4 text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
           </div>

        </div>

      </main>

      {/* STICKY MOBILE BAR (Glass + Blur) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-[#111]/90 backdrop-blur-xl border border-white/10 p-2 pl-6 rounded-full flex items-center justify-between shadow-2xl ring-1 ring-white/5">
           <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-zinc-400">Total</span>
              <span className="text-lg font-bold text-white">₹{finalPrice}</span>
           </div>
           <button 
             onClick={handleAddToCart}
             disabled={product.stock <= 0 || isAdding}
             className="bg-white text-black px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-95 transition-transform"
           >
             {isAdding ? "..." : (product.stock > 0 ? "MAKE IT YOURS" : "SOLD")}
           </button>
        </div>
      </div>

    </div>
  );
}
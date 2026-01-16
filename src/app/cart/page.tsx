'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { 
  Plus, Minus, X, Link as LinkIcon, ArrowRight, ShieldCheck, ShoppingBag, ArrowLeft, PenLine
} from 'lucide-react';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, updateLink, cartTotal } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const shippingThreshold = 999;
  const progress = Math.min((cartTotal / shippingThreshold) * 100, 100);
  const remaining = shippingThreshold - cartTotal;

  if (!isClient) return <div className="min-h-screen bg-[#080808]" />;

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 selection:text-white pb-32 relative">
      
      {/* --- RETRO GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <Header />

      <main className="pt-40 px-6 max-w-7xl mx-auto relative z-10">
        
        <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase mb-4 block">Your Selection</span>
            <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-none">Bag</h1>
          </div>
          <span className="text-zinc-500 font-mono text-sm mb-2 uppercase tracking-widest">{cart.length} ITEMS</span>
        </div>

        {cart.length === 0 ? (
          // --- EMPTY STATE (Cinematic) ---
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
             <div className="w-24 h-24 border border-zinc-800 rounded-full flex items-center justify-center mb-8 text-zinc-600">
                <ShoppingBag className="w-8 h-8" />
             </div>
             <h2 className="text-3xl font-serif italic text-white mb-4">It's quiet here.</h2>
             <p className="text-zinc-500 max-w-md mb-12 leading-relaxed font-light">
               Your digital identity is waiting to be claimed. <br/> Start by choosing your vibe.
             </p>
             <button 
               onClick={() => router.push('/products')}
               className="bg-white text-black px-10 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 transition-transform"
             >
               Start Shopping
             </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24">

            {/* --- LEFT: ITEMS LIST --- */}
            <div className="lg:col-span-8">
              
              {/* Shipping Progress (Minimal) */}
              <div className="mb-16">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-zinc-500">
                    <span>{remaining > 0 ? `Add ₹${remaining} for Free Shipping` : "Free Shipping Unlocked"}</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                 </div>
                 <div className="h-[1px] w-full bg-zinc-900 overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-white absolute top-0 left-0" 
                    />
                 </div>
              </div>

              <div className="space-y-16">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div 
                      key={item._id}
                      layout
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="group border-b border-zinc-900/50 pb-16 last:border-0"
                    >
                      <div className="flex gap-8 md:gap-12 items-start">
                        
                        {/* Image */}
                        <div className="w-28 h-36 md:w-40 md:h-52 bg-zinc-900/20 rounded-sm overflow-hidden relative shrink-0 border border-white/5">
                           <Image 
                             src={item.image} 
                             alt={item.title} 
                             fill 
                             className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                             sizes="160px"
                           />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between h-36 md:h-52 py-2">
                           <div>
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">{item.title}</h2>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">₹{item.price} / UNIT</p>
                                 </div>
                                 <span className="text-xl md:text-2xl font-light text-white">₹{item.price * item.quantity}</span>
                              </div>
                           </div>

                           {/* Controls */}
                           <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-6">
                                 {/* Quantity (Plain Text Style) */}
                                 <div className="flex items-center gap-4 text-sm font-mono">
                                    <button onClick={() => updateQuantity(item._id, -1)} className="text-zinc-500 hover:text-white transition px-2 py-1">-</button>
                                    <span className="text-white min-w-[20px] text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, 1)} className="text-zinc-500 hover:text-white transition px-2 py-1">+</button>
                                 </div>
                              </div>
                              <button onClick={() => removeFromCart(item._id)} className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 hover:text-rose-500 transition border-b border-transparent hover:border-rose-500 pb-0.5">
                                 Remove
                              </button>
                           </div>
                        </div>
                      </div>

                      {/* --- LINK CONFIGURATION (Editorial Style) --- */}
                      <div className="mt-8 md:pl-[13rem]">
                         <div className="flex items-center gap-3 mb-6">
                            <PenLine className="w-3 h-3 text-zinc-500" />
                            <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-[0.2em]">Customize ({item.quantity})</span>
                         </div>
                         <div className="space-y-6 pl-4 border-l border-white/5">
                           {item.links.map((link, index) => (
                              <div key={index} className="relative group/input">
                                 <label className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest absolute -top-3 left-0">Link #{index + 1}</label>
                                 <input 
                                   type="text" 
                                   value={link}
                                   onChange={(e) => updateLink(item._id, index, e.target.value)}
                                   placeholder="Paste your profile link (Instagram, Spotify, etc.)"
                                   className="w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors font-light tracking-wide"
                                 />
                                 <p className="text-[9px] text-zinc-700 mt-2 opacity-0 group-hover/input:opacity-100 transition-opacity duration-300">
                                   *You can change this later anytime.
                                 </p>
                              </div>
                           ))}
                         </div>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* --- RIGHT: SUMMARY (Sticky & Clean) --- */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 p-8 border border-white/5 bg-zinc-900/10 backdrop-blur-sm rounded-sm">
                <h3 className="text-xl font-serif italic mb-8 text-white">Summary</h3>

                <div className="space-y-4 text-sm mb-10 font-light">
                    <div className="flex justify-between text-zinc-400">
                       <span>Subtotal</span>
                       <span className="text-white font-mono">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                       <span>Shipping</span>
                       <span className={cartTotal > shippingThreshold ? "text-emerald-400 font-mono" : "text-white font-mono"}>
                         {cartTotal > shippingThreshold ? "FREE" : "CALC LATER"}
                       </span>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 mb-10">
                    <div className="flex justify-between items-end">
                       <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Total</span>
                       <span className="text-3xl font-serif italic text-white">₹{cartTotal}</span>
                    </div>
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full py-5 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] transition-transform flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  Checkout <ArrowRight className="w-3 h-3" />
                </button>

                <p className="text-center text-[9px] text-zinc-600 mt-6 leading-relaxed">
                   By proceeding, you agree to our Terms. <br/> You can review your order before payment.
                </p>

                <div className="flex items-center justify-center gap-2 mt-6 text-[9px] text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-4">
                   <ShieldCheck className="w-3 h-3" /> Secure SSL Encryption
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
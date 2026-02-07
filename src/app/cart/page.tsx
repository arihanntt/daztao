'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { 
  Plus, Minus, X, Link as LinkIcon, ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, updateLink, cartTotal } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  // --- DISCOUNT LOGIC ---
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isDiscountEligible = totalItems >= 2;
  const discountAmount = isDiscountEligible ? 100 : 0;
  const finalTotal = cartTotal - discountAmount;

  if (!isClient) return <div className="min-h-screen bg-[#080808]" />;

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 selection:text-white pb-32 relative">
      <Header />

      <main className="pt-40 px-6 max-w-7xl mx-auto relative z-10">
        
        <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase mb-4 block">Your Selection</span>
            <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-none">Bag</h1>
          </div>
          <span className="text-zinc-500 font-mono text-sm mb-2 uppercase tracking-widest">{totalItems} ITEMS</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-32">
             <h2 className="text-3xl font-serif italic text-white mb-4">It's quiet here.</h2>
             <button onClick={() => router.push('/products')} className="bg-white text-black px-10 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em]">Start Shopping</button>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24">

            {/* --- LEFT: ITEMS LIST --- */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Promo Banner */}
              <div className={`p-4 border ${isDiscountEligible ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-zinc-900/20'} rounded-sm transition-all duration-500`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className={`w-4 h-4 ${isDiscountEligible ? 'text-emerald-400' : 'text-zinc-600'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isDiscountEligible ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {isDiscountEligible ? "Bundle Discount Applied" : "Add 2+ items to save ₹100"}
                      </span>
                    </div>
                    {!isDiscountEligible && (
                      <span className="text-white font-mono text-[10px]">Add {2 - totalItems} more</span>
                    )}
                  </div>
              </div>

              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group border-b border-zinc-800 pb-12">
                    
                    {/* Item Top Section */}
                    <div className="flex gap-6 md:gap-12 items-start mb-8">
                      <div className="w-24 h-32 md:w-32 md:h-40 bg-zinc-900 rounded-lg overflow-hidden relative shrink-0 border border-white/10">
                         <Image src={item.image} alt={item.title} fill className="object-cover opacity-90" sizes="160px"/>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start mb-2">
                             <h2 className="text-xl md:text-2xl font-medium text-white truncate pr-4">{item.title}</h2>
                             <span className="text-lg md:text-xl font-light text-white">₹{item.price * item.quantity}</span>
                         </div>
                         <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-6">Unit Price: ₹{item.price}</p>

                         <div className="flex items-center justify-between">
                            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md">
                               <button onClick={() => updateQuantity(item._id, -1)} className="px-3 py-1 hover:bg-zinc-800 transition"><Minus className="w-3 h-3 text-zinc-400"/></button>
                               <span className="px-3 text-sm font-mono text-white min-w-[30px] text-center">{item.quantity}</span>
                               <button onClick={() => updateQuantity(item._id, 1)} className="px-3 py-1 hover:bg-zinc-800 transition"><Plus className="w-3 h-3 text-zinc-400"/></button>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} className="text-xs text-zinc-500 hover:text-red-400 transition underline decoration-zinc-800 underline-offset-4">Remove</button>
                         </div>
                      </div>
                    </div>

                    {/* --- IMPROVED LINKS SECTION --- */}
                    {/* Only show if the item actually requires links */}
                    {item.links && item.links.length > 0 && (
                      <div className="bg-zinc-900/30 border border-dashed border-zinc-700 rounded-xl p-5 md:ml-[9.5rem]">
                        <div className="flex items-center gap-2 mb-4">
                          <LinkIcon className="w-3 h-3 text-blue-400" />
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Required Customization Links</span>
                        </div>
                        
                        <div className="space-y-3">
                          {item.links.map((link, index) => (
                            <div key={index} className="relative">
                               <span className="absolute left-3 top-3 text-[10px] font-bold text-zinc-600">LINK #{index + 1}</span>
                               <input 
                                 type="text" 
                                 value={link} 
                                 onChange={(e) => updateLink(item._id, index, e.target.value)}
                                 placeholder="Paste your link here"
                                 className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-16 pr-4 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                               />
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-3 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Please ensure these links are publicly accessible.
                        </p>
                      </div>
                    )}

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* --- RIGHT: SUMMARY --- */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 p-8 border border-white/5 bg-zinc-900/10 backdrop-blur-md rounded-xl">
                <h3 className="text-xl font-serif italic mb-8 text-white">Summary</h3>
                <div className="space-y-4 text-sm mb-10 font-light">
                    <div className="flex justify-between text-zinc-400">
                       <span>Subtotal</span>
                       <span className="text-white font-mono">₹{cartTotal}</span>
                    </div>
                    {isDiscountEligible && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between text-emerald-400">
                          <span>Bundle Discount</span>
                          <span className="font-mono">- ₹100</span>
                      </motion.div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                       <span>Shipping</span>
                       <span className="text-white font-mono uppercase text-[10px]">Calculated at Checkout</span>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 mb-10">
                    <div className="flex justify-between items-end">
                       <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Total</span>
                       <span className="text-4xl font-serif italic text-white">₹{finalTotal}</span>
                    </div>
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full py-5 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] transition-transform flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Proceed to Checkout <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { 
  Plus, Minus, X, Link as LinkIcon, ArrowRight, ShieldCheck, ShoppingBag, ArrowLeft, PenLine, Sparkles
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
          /* --- EMPTY STATE remains the same --- */
          <div className="text-center py-32">
             <h2 className="text-3xl font-serif italic text-white mb-4">It's quiet here.</h2>
             <button onClick={() => router.push('/products')} className="bg-white text-black px-10 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em]">Start Shopping</button>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24">

            {/* --- LEFT: ITEMS LIST --- */}
            <div className="lg:col-span-8">
              
              {/* Promo Banner */}
              <div className="mb-12">
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
              </div>

              <div className="space-y-16">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group border-b border-zinc-900/50 pb-16 last:border-0">
                      <div className="flex gap-8 md:gap-12 items-start">
                        <div className="w-28 h-36 md:w-40 md:h-52 bg-zinc-900/20 rounded-sm overflow-hidden relative shrink-0 border border-white/5">
                           <Image src={item.image} alt={item.title} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" sizes="160px"/>
                        </div>
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
                           <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-6">
                                 <div className="flex items-center gap-4 text-sm font-mono">
                                    <button onClick={() => updateQuantity(item._id, -1)} className="text-zinc-500 hover:text-white px-2">-</button>
                                    <span className="text-white">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, 1)} className="text-zinc-500 hover:text-white px-2">+</button>
                                 </div>
                              </div>
                              <button onClick={() => removeFromCart(item._id)} className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 hover:text-rose-500 transition">Remove</button>
                           </div>
                        </div>
                      </div>
                      
                      {/* Customization links mapping remains same... */}
                      <div className="mt-8 md:pl-[13rem]">
                        <div className="space-y-6 pl-4 border-l border-white/5">
                          {item.links.map((link, index) => (
                            <div key={index} className="relative">
                               <input 
                                 type="text" value={link} 
                                 onChange={(e) => updateLink(item._id, index, e.target.value)}
                                 placeholder="Paste link here..."
                                 className="w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:border-white focus:outline-none transition-colors"
                               />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* --- RIGHT: SUMMARY --- */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 p-8 border border-white/5 bg-zinc-900/10 backdrop-blur-md">
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
                       <span className="text-white font-mono uppercase">Calculated at Checkout</span>
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
                  className="w-full py-5 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] transition-transform flex items-center justify-center gap-4"
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
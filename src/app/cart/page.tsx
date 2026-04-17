'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { Plus, Minus, X, Link as LinkIcon, ArrowRight, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, updateLink, cartTotal } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isDiscountEligible = totalItems >= 2;
  const discountAmount = isDiscountEligible ? 100 : 0;
  const finalTotal = cartTotal - discountAmount;

  if (!isClient) return <div className="min-h-screen bg-[#FAFAFA]" />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      <Header />

      <main className="pt-[140px] pb-24 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto">

          {/* Page Header */}
          <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-2">Your Bag</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Cart</h1>
            </div>
            <span className="text-sm text-gray-400 font-medium mb-1">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-32">
              <h2 className="text-2xl font-black text-[#1A1A1A] mb-3">Your cart is empty.</h2>
              <p className="text-gray-500 text-sm mb-8">Explore our collection to find your perfect keychain.</p>
              <button
                onClick={() => router.push('/products')}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#1A1A1A] text-white text-[13px] font-bold hover:opacity-80 transition-opacity"
              >
                Start Shopping <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16">

              {/* --- LEFT: ITEMS LIST --- */}
              <div className="lg:col-span-8 space-y-0">

                {/* Bundle Banner */}
                <div className={`flex items-center justify-between p-4 rounded-2xl mb-8 transition-all duration-500 ${
                  isDiscountEligible
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <span className={`text-[12px] font-bold uppercase tracking-wider ${
                    isDiscountEligible ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {isDiscountEligible ? 'Bundle discount applied — saving ₹100' : `Add ${2 - totalItems} more item${2 - totalItems > 1 ? 's' : ''} to unlock ₹100 off`}
                  </span>
                  {!isDiscountEligible && (
                    <button
                      onClick={() => router.push('/products')}
                      className="text-[12px] font-bold text-[#1A1A1A] underline underline-offset-2"
                    >
                      Browse
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-100 py-7"
                    >
                      <div className="flex gap-5 items-start">
                        {/* Product Image */}
                        <div className="w-20 h-24 md:w-24 md:h-28 bg-gray-100 rounded-xl overflow-hidden relative shrink-0 border border-gray-200">
                          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="120px" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-[15px] font-semibold text-[#1A1A1A] truncate pr-4">{item.title}</h2>
                              <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">Unit: ₹{item.price}</p>
                            </div>
                            <span className="text-[15px] font-bold text-[#1A1A1A]">₹{item.price * item.quantity}</span>
                          </div>

                          {/* Quantity + Remove */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center rounded-full border border-gray-200 bg-white overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item._id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 text-[13px] font-bold text-[#1A1A1A] min-w-[30px] text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-[12px] text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>

                          {/* Link Customization */}
                          {item.links && item.links.length > 0 && (
                            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                              <div className="flex items-center gap-2 mb-3">
                                <LinkIcon className="w-3 h-3 text-gray-500" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Customization Links</span>
                              </div>
                              <div className="space-y-2">
                                {item.links.map((link, index) => (
                                  <input
                                    key={index}
                                    type="text"
                                    value={link}
                                    onChange={(e) => updateLink(item._id, index, e.target.value)}
                                    placeholder={`Link #${index + 1} — e.g. instagram.com/yourname`}
                                    className="w-full h-9 px-4 rounded-lg border border-gray-200 bg-white text-[12px] text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                                  />
                                ))}
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Make sure links are publicly accessible.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* --- RIGHT: ORDER SUMMARY --- */}
              <div className="lg:col-span-4">
                <div className="sticky top-40 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-[16px] font-black mb-6 text-[#1A1A1A]">Order Summary</h3>

                  <div className="space-y-3 text-[13px] mb-6">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#1A1A1A]">₹{cartTotal}</span>
                    </div>
                    {isDiscountEligible && (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between text-green-600"
                      >
                        <span>Bundle Discount</span>
                        <span className="font-semibold">- ₹100</span>
                      </motion.div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span className="font-medium text-[11px] uppercase tracking-wide text-gray-400">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total</span>
                      <span className="text-2xl font-black text-[#1A1A1A]">₹{finalTotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full py-4 flex items-center justify-center gap-3 rounded-full bg-[#1A1A1A] text-white text-[13px] font-bold hover:opacity-80 transition-opacity"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                    Safe & Encrypted Payment
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
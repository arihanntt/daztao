'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import {
  X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Link2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// ─────────────────────────────────────────────────────────────────────────────
// SideCart — Phase 8.3
// - Per-item profile link display + editable input
// - Auth-intercepting checkout button
// - Graceful validation before redirect
// ─────────────────────────────────────────────────────────────────────────────
export default function SideCart() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    cart,
    cartTotal,
    cartCount,
    removeFromCart,
    updateQuantity,
    updateLink,
    isCartOpen,
    closeCart,
  } = useCart();

  const [linkErrors, setLinkErrors] = useState<Record<string, boolean>>({});
  const [checkoutError, setCheckoutError] = useState('');

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isDiscountEligible = totalItems >= 2;
  const finalTotal = cartTotal - (isDiscountEligible ? 100 : 0);

  // ── Checkout interceptor ────────────────────────────────────────────────────
  const handleCheckout = () => {
    setCheckoutError('');
    setLinkErrors({});

    // 1. Validate that every item slot has a profile link
    const missingLinks: Record<string, boolean> = {};
    let hasAnyMissing = false;

    for (const item of cart) {
      for (let i = 0; i < item.quantity; i++) {
        if (!item.links[i]?.trim()) {
          missingLinks[item._id] = true;
          hasAnyMissing = true;
          break;
        }
      }
    }

    if (hasAnyMissing) {
      setLinkErrors(missingLinks);
      setCheckoutError('Please enter a profile link for each keychain before checking out.');
      return;
    }

    // 2. Auth check — intercept if not logged in
    if (status === 'loading') return; // wait for session

    closeCart();

    if (!session) {
      router.push('/login?callbackUrl=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-[200] bg-black/25 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 z-[201] w-full max-w-[440px] bg-[#FAFAFA] flex flex-col shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-[68px] border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-black text-[#1A1A1A]">Cart</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 bg-[#1A1A1A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-all"
                aria-label="Close cart"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Empty State */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-gray-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#1A1A1A] mb-1">Your cart is empty</p>
                  <p className="text-[13px] text-gray-500">Add a keychain to get started.</p>
                </div>
                <button
                  onClick={() => { closeCart(); router.push('/products'); }}
                  className="mt-2 px-6 py-3 rounded-full bg-[#1A1A1A] text-white text-[12px] font-bold hover:opacity-80 transition-opacity"
                  aria-label="Browse the NFC keychain catalog"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <>
                {/* Bundle Banner */}
                <div className={`mx-4 mt-4 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isDiscountEligible
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {isDiscountEligible
                    ? 'Bundle discount applied — saving Rs. 100'
                    : `Add ${2 - totalItems} more item${2 - totalItems > 1 ? 's' : ''} to unlock Rs. 100 off`}
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`bg-white rounded-2xl border p-3 transition-all ${
                          linkErrors[item._id] ? 'border-red-300' : 'border-gray-100'
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* Image */}
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                            <Image
                              src={item.image}
                              alt={`${item.title} product image`}
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized={item.image?.startsWith('http')}
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{item.title}</p>
                            <p className="text-[13px] font-bold text-[#1A1A1A] mt-0.5">
                              Rs. {item.price * item.quantity}
                            </p>

                            {/* Qty + Remove */}
                            <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item._id, -1)}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" aria-hidden="true" />
                                </button>
                                <span className="px-2 text-[12px] font-bold text-[#1A1A1A] min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item._id, 1)}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" aria-hidden="true" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item._id)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                aria-label={`Remove ${item.title} from cart`}
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ── Profile Link Input (per slot) ── */}
                        <div className="mt-3 space-y-2">
                          {Array.from({ length: item.quantity }).map((_, slotIndex) => {
                            const linkVal = item.links[slotIndex] ?? '';
                            const isError = linkErrors[item._id] && !linkVal.trim();
                            return (
                              <div key={slotIndex}>
                                <div className={`flex items-center gap-2 h-[38px] rounded-full border px-3 bg-[#FAFAFA] transition-all ${
                                  isError
                                    ? 'border-red-400 bg-red-50/30'
                                    : linkVal.trim()
                                    ? 'border-green-300'
                                    : 'border-gray-200 focus-within:border-[#1A1A1A]'
                                }`}>
                                  <Link2 className={`w-3.5 h-3.5 shrink-0 ${
                                    isError ? 'text-red-400' : linkVal.trim() ? 'text-green-500' : 'text-gray-400'
                                  }`} aria-hidden="true" />
                                  <input
                                    type="url"
                                    value={linkVal}
                                    onChange={(e) => {
                                      updateLink(item._id, slotIndex, e.target.value);
                                      if (linkErrors[item._id]) {
                                        setLinkErrors((prev) => ({ ...prev, [item._id]: false }));
                                        setCheckoutError('');
                                      }
                                    }}
                                    placeholder={
                                      item.quantity > 1
                                        ? `Keychain ${slotIndex + 1} — instagram.com/handle`
                                        : 'Your profile link or URL'
                                    }
                                    className="flex-1 text-[12px] text-[#1A1A1A] placeholder:text-gray-400 bg-transparent focus:outline-none min-w-0"
                                    aria-label={`Profile link for keychain ${slotIndex + 1}`}
                                  />
                                </div>
                                {isError && (
                                  <p className="text-[10px] text-red-500 font-medium mt-0.5 ml-3">
                                    Required before checkout
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary + CTA */}
                <div className="px-4 pb-6 pt-2 shrink-0 border-t border-gray-100 space-y-3">
                  {/* Price lines */}
                  <div className="space-y-2 pt-3 text-[13px]">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#1A1A1A]">Rs. {cartTotal}</span>
                    </div>
                    {isDiscountEligible && (
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between text-green-600 font-medium"
                      >
                        <span>Bundle Discount</span>
                        <span>- Rs. 100</span>
                      </motion.div>
                    )}
                    <div className="flex justify-between font-black text-[15px] text-[#1A1A1A] pt-1 border-t border-gray-100">
                      <span>Total</span>
                      <span>Rs. {finalTotal}</span>
                    </div>
                  </div>

                  {/* Global checkout error */}
                  <AnimatePresence>
                    {checkoutError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5"
                        role="alert"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-[11px] text-red-600 font-medium leading-snug">{checkoutError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Auth hint when not logged in */}
                  {!session && status !== 'loading' && (
                    <p className="text-center text-[11px] text-gray-400">
                      You will be asked to sign in before checkout.
                    </p>
                  )}

                  {/* Checkout CTA */}
                  <button
                    onClick={handleCheckout}
                    disabled={status === 'loading'}
                    className="w-full h-[52px] flex items-center justify-center gap-2.5 rounded-full bg-[#1A1A1A] text-white text-[13px] font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
                    aria-label="Proceed to checkout"
                  >
                    {status === 'loading' ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={closeCart}
                    className="w-full text-center text-[12px] text-gray-400 hover:text-[#1A1A1A] transition-colors pt-1"
                    aria-label="Continue shopping"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

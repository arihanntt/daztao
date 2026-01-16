'use client';

import { Menu, X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  // Calculate total items
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'CATALOG', path: '/products' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ];

  // 1. Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Lock Body Scroll when Menu is Open (Premium Feel)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* ================= HEADER BAR ================= */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled || open 
            ? 'bg-[#080808]/80 backdrop-blur-xl border-white/5 py-0' 
            : 'bg-transparent border-transparent py-4'
        }`}
      >
        <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`}>

          {/* LOGO */}
          <button
            onClick={() => router.push('/')}
            className="text-lg font-serif italic font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
          >
            DAZTAO
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`hover:text-white transition-colors relative group py-2 ${isActive ? 'text-white' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </button>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            
            {/* CART BUTTON */}
            <button
              onClick={() => router.push('/cart')}
              className="relative group p-2"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-zinc-400 hover:text-white transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="fixed inset-0 z-[100] bg-[#080808] flex flex-col"
          >
            
            {/* Retro Grain Overlay for Menu */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* TOP BAR */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/5 relative z-10">
              <div className="text-lg font-serif italic font-bold text-white">
                DAZTAO
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close Menu"
                className="text-zinc-400 hover:text-white transition p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* NAV LINKS */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10">
              {navItems.map((item, i) => {
                const isActive = pathname === item.path;
                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    onClick={() => {
                      setOpen(false);
                      router.push(item.path);
                    }}
                    className={`text-3xl font-serif italic tracking-tight transition-colors ${isActive ? 'text-white' : 'text-zinc-600 hover:text-white'}`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>

            {/* FOOTER OF MENU */}
            <div className="p-8 text-center border-t border-white/5 relative z-10">
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">
                A Drixe Group Company
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ShoppingBag, User, Menu, X, ArrowRight,
  LogOut, Package, Settings, Tag, ChevronDown,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Catalog', path: '/products' },
  { label: 'About',   path: '/about'    },
  { label: 'FAQ',     path: '/faq'      },
  { label: 'Contact', path: '/contact'  },
];

const ACCOUNT_LINKS = [
  { label: 'My Orders',        href: '/account/orders',   Icon: Package  },
  { label: 'Account Settings', href: '/account/settings', Icon: Settings },
  { label: 'Exclusive Offers', href: '/account/offers',   Icon: Tag      },
];

function getInitial(name?: string | null, email?: string | null) {
  if (name)  return name[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return 'U';
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function Header() {
  const router   = useRouter();
  const pathname = usePathname();
  const { cartCount, openCart }      = useCart();
  const { data: session, status }    = useSession();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Scroll shadow ────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // ── Outside click closes dropdown ────────────────────────────────────────
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [dropdownOpen]);

  // ── Body scroll lock when mobile menu open ───────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSignOut = () => {
    setDropdownOpen(false);
    signOut({ callbackUrl: '/' });
  };

  const handleUserClick = () => {
    if (status === 'loading') return;
    if (!session) { router.push('/login'); return; }
    setDropdownOpen(p => !p);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER — always white, never transparent
      ═══════════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_16px_rgba(0,0,0,0.07)]' : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[68px] gap-6">

            {/* ── Logo ──────────────────────────────────────────────────── */}
            <Link
              href="/"
              className="text-[17px] font-black tracking-[0.06em] text-[#1A1A1A] hover:opacity-60 transition-opacity shrink-0"
              aria-label="Daztao home"
            >
              DAZTAO
            </Link>

            {/* ── Desktop Nav — centred ─────────────────────────────────── */}
            <nav
              className="hidden md:flex items-center gap-0"
              aria-label="Primary navigation"
            >
              {NAV_LINKS.map(({ label, path }) => {
                const active = pathname === path || pathname.startsWith(path + '/');
                return (
                  <Link
                    key={path}
                    href={path}
                    className={`relative px-5 py-2 text-[13px] font-semibold tracking-wide transition-colors ${
                      active
                        ? 'text-[#1A1A1A]'
                        : 'text-gray-500 hover:text-[#1A1A1A]'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {label}
                    {/* Active underline */}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-5 right-5 h-[2px] bg-[#1A1A1A]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right cluster ─────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 shrink-0">

              {/* Cart ───────────────────────────────────────────────────── */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-100 transition-all rounded-sm"
                aria-label={`Open cart${cartCount > 0 ? ` — ${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}`}
              >
                <ShoppingBag className="w-[18px] h-[18px]" aria-hidden="true" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#1A1A1A] text-white text-[9px] font-black rounded-full flex items-center justify-center"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Account ────────────────────────────────────────────────── */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleUserClick}
                  className={`flex items-center gap-1.5 h-10 px-3 text-[13px] font-semibold transition-all rounded-sm ${
                    session
                      ? 'text-[#1A1A1A] hover:bg-gray-100'
                      : 'text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-100'
                  }`}
                  aria-label={session ? 'Account menu' : 'Sign in'}
                  aria-expanded={dropdownOpen}
                  aria-haspopup={session ? 'menu' : undefined}
                >
                  {session ? (
                    <>
                      {/* Avatar initial */}
                      <span className="w-6 h-6 bg-[#1A1A1A] text-white text-[11px] font-black flex items-center justify-center shrink-0 select-none">
                        {getInitial(session.user?.name, session.user?.email)}
                      </span>
                      <span className="hidden lg:block max-w-[100px] truncate text-[13px]">
                        {session.user?.name?.split(' ')[0] ?? 'Account'}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <>
                      <User className="w-[17px] h-[17px]" aria-hidden="true" />
                      <span className="hidden md:block">Sign In</span>
                    </>
                  )}
                </button>

                {/* ── Dropdown ──────────────────────────────────────────── */}
                <AnimatePresence>
                  {dropdownOpen && session && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-200 shadow-lg z-[999]"
                      role="menu"
                      aria-label="Account menu"
                    >
                      {/* User info */}
                      <div className="px-4 py-4 border-b border-gray-100">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 mb-1">
                          Signed in as
                        </p>
                        <p className="text-[13px] font-bold text-[#1A1A1A] truncate">
                          {session.user?.name ?? session.user?.email}
                        </p>
                        {session.user?.name && session.user?.email && (
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">
                            {session.user.email}
                          </p>
                        )}
                      </div>

                      {/* Links */}
                      <div className="py-1.5" role="none">
                        {ACCOUNT_LINKS.map(({ label, href, Icon }) => (
                          <button
                            key={href}
                            onClick={() => { setDropdownOpen(false); router.push(href); }}
                            role="menuitem"
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors text-left group"
                          >
                            <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1A1A1A] transition-colors shrink-0" aria-hidden="true" />
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Sign out */}
                      <div className="py-1.5 border-t border-gray-100" role="none">
                        <button
                          onClick={handleSignOut}
                          role="menuitem"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left group"
                        >
                          <LogOut className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors shrink-0" aria-hidden="true" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── CTA — visible on md+ ──────────────────────────────── */}
              <Link
                href="/products"
                className="hidden lg:flex items-center gap-2 ml-2 px-5 h-9 bg-[#1A1A1A] text-white text-[12px] font-black uppercase tracking-wider hover:opacity-80 transition-opacity"
                aria-label="Shop Daztao NFC keychains"
              >
                Shop Now
              </Link>

              {/* ── Mobile burger ─────────────────────────────────────── */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 text-[#1A1A1A] hover:bg-gray-100 transition-colors rounded-sm"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE DRAWER — full-height slide-in from left
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-[2px]"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[100] w-[320px] bg-white flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-6 h-[68px] border-b border-gray-100 shrink-0">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-[17px] font-black tracking-[0.06em] text-[#1A1A1A]"
                >
                  DAZTAO
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-100 transition-colors rounded-sm"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 pt-6 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 mb-4">
                    Navigate
                  </p>
                  <div className="flex flex-col">
                    {[{ label: 'Home', path: '/' }, ...NAV_LINKS].map(({ label, path }, i) => {
                      const active = pathname === path;
                      return (
                        <motion.div
                          key={path}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 + 0.05, duration: 0.3 }}
                        >
                          <button
                            onClick={() => { setMobileOpen(false); router.push(path); }}
                            className={`w-full flex items-center justify-between py-4 border-b border-gray-100 text-left transition-colors ${
                              active ? 'text-[#1A1A1A]' : 'text-gray-600 hover:text-[#1A1A1A]'
                            }`}
                          >
                            <span className="text-[16px] font-semibold">{label}</span>
                            <ArrowRight className="w-4 h-4 text-gray-300" aria-hidden="true" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Account section */}
                <div className="px-6 pt-4 pb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 mb-4">
                    Account
                  </p>

                  {session ? (
                    <div className="flex flex-col">
                      {/* User info pill */}
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 border border-gray-100">
                        <span className="w-8 h-8 bg-[#1A1A1A] text-white text-[12px] font-black flex items-center justify-center shrink-0">
                          {getInitial(session.user?.name, session.user?.email)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-[#1A1A1A] truncate">
                            {session.user?.name ?? 'Account'}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>

                      {ACCOUNT_LINKS.map(({ label, href, Icon }, i) => (
                        <motion.button
                          key={href}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 + 0.25 }}
                          onClick={() => { setMobileOpen(false); router.push(href); }}
                          className="flex items-center gap-3 py-3.5 border-b border-gray-100 text-left text-[14px] font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors group"
                        >
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#1A1A1A] transition-colors shrink-0" aria-hidden="true" />
                          {label}
                        </motion.button>
                      ))}

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 pt-4 text-left text-[14px] font-medium text-red-500 hover:text-red-700 transition-colors group"
                      >
                        <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setMobileOpen(false); router.push('/login'); }}
                      className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-left text-[16px] font-semibold text-gray-600 hover:text-[#1A1A1A] transition-colors"
                    >
                      Sign In
                      <ArrowRight className="w-4 h-4 text-gray-300" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="px-6 py-6 border-t border-gray-100 shrink-0">
                <button
                  onClick={() => { setMobileOpen(false); router.push('/products'); }}
                  className="w-full h-12 bg-[#1A1A1A] text-white text-[13px] font-black uppercase tracking-wider hover:opacity-80 transition-opacity"
                >
                  Shop Now
                </button>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-4 text-center">
                  A Drixe Group Company
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
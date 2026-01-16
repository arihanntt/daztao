'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const legal = [
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="relative bg-[#080808] text-[#e0e0e0] border-t border-white/5 font-sans selection:bg-rose-500/30 selection:text-white">
      
      {/* Retro Grain Overlay (Consistent with rest of site) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">

        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-20">

          {/* --- BRAND & SEO COPY --- */}
          <div className="lg:w-1/3 space-y-8">
            <div>
              <h2 className="text-2xl font-serif italic text-white tracking-tight mb-4">DAZTAO</h2>
              <p className="text-sm text-zinc-500 leading-7 font-light max-w-sm">
                DAZTAO builds premium NFC keychains that let you instantly share Instagram, Spotify, and digital profiles with one tap. 
                Designed in India for fast, physical connection.
              </p>
            </div>

            {/* Trust Strip */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-bold">
              <span>No App Required</span>
              <span>No Battery</span>
              <span>iPhone & Android</span>
            </div>

            <p className="text-[10px] text-zinc-700 tracking-wide pt-4 border-t border-white/5 inline-block">
              Ships across India • WhatsApp Support Available
            </p>
          </div>

          {/* --- LINKS GRID --- */}
          <div className="flex-1 grid grid-cols-2 gap-12 lg:gap-24">
            
            {/* Menu */}
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">Menu</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">Legal</h4>
              <ul className="space-y-4">
                {legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* --- BOTTOM BAR & SOFT CTA --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
          
          {/* Copyright */}
          <span>© {new Date().getFullYear()} DAZTAO India.</span>

          {/* Soft CTA for Scrollers */}
          <Link href="/products" className="hidden md:block text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-zinc-500 pb-0.5">
            Explore Collection →
          </Link>

          {/* Credits */}
          <span>A Drixe Group Company</span>
        </div>

      </div>
    </footer>
  );
}
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// The editorial DAZTAO footer — matches the homepage Section 10 exactly
// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  const router = useRouter();

  return (
    <footer aria-label="Daztao site footer" className="bg-[#1A1A1A] text-white">

      {/* Top — editorial logotype + CTA */}
      <div className="px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-16 md:pb-20 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">

            {/* Massive logotype */}
            <h2 className="text-[80px] md:text-[120px] lg:text-[160px] font-black tracking-tight leading-none text-white select-none">
              DAZTAO
            </h2>

            {/* CTA block */}
            <div className="flex flex-col items-start md:items-end gap-4 pb-2">
              <p className="text-[15px] text-white/55 max-w-xs leading-relaxed font-light md:text-right">
                Ready to upgrade your networking? Get your NFC smart keychain today.
              </p>
              <button
                onClick={() => router.push('/products')}
                className="flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-[13px] font-black uppercase tracking-wide hover:bg-white hover:text-[#1A1A1A] transition-all"
                aria-label="Get your Daztao NFC keychain"
              >
                Get Your Keychain <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom — links row */}
      <div className="px-6 md:px-12 lg:px-20 py-8">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Nav + policy links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: 'Catalog',         href: '/products'        },
              { label: 'About',           href: '/about'           },
              { label: 'FAQ',             href: '/faq'             },
              { label: 'Contact',         href: '/contact'         },
              { label: 'Privacy Policy',  href: '/privacy-policy'  },
              { label: 'Terms',           href: '/terms'           },
              { label: 'Refund Policy',   href: '/refund-policy'   },
              { label: 'Shipping',        href: '/shipping-policy' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-[12px] text-white/40 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Legal */}
          <p className="text-[11px] text-white/25 shrink-0">
            &copy; {new Date().getFullYear()} Daztao. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// FAQ data — kept here so the page is client-interactive (accordion)
// ─────────────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'How does a Daztao NFC keychain work?',
    a: 'A Daztao NFC keychain contains a small NTAG215 NFC chip embedded inside. When you tap the keychain against an NFC-enabled smartphone, the phone reads the chip and instantly opens the link or profile you have programmed — no apps required on the receiving side.',
  },
  {
    q: 'Do I need to download an app to use the Daztao keychain?',
    a: 'No. The person tapping your keychain does not need to install any app. The link opens directly in their browser. iPhone 7 and newer users can tap without opening any app. Android users with NFC enabled can also tap directly.',
  },
  {
    q: 'Which phones are compatible with Daztao NFC keychains?',
    a: 'All NFC-enabled smartphones. This includes iPhone 7 and newer, and virtually all Android smartphones released after 2015 — Samsung, OnePlus, Xiaomi, Vivo, Oppo, and Realme all support NFC natively.',
  },
  {
    q: 'What can I link to my Daztao keychain?',
    a: 'Any publicly accessible URL. Instagram, Snapchat, YouTube, Facebook, WhatsApp, Spotify, LinkedIn, personal portfolio websites, or a custom digital business card. You can update the link at any time.',
  },
  {
    q: 'Can I change the link on my keychain after purchase?',
    a: 'Yes, at any time for free. Use any NFC writer app from the App Store or Google Play. The process takes under one minute. There is no limit on how many times you can reprogram it.',
  },
  {
    q: 'Is the Daztao keychain waterproof?',
    a: 'Yes. Daztao keychains are built with waterproof casing, suitable for daily use in all weather. Safe in rain, sweat, and everyday carry.',
  },
  {
    q: 'Does the Daztao keychain need a battery or charging?',
    a: 'No battery required. The NFC chip draws power inductively from the reading phone\'s electromagnetic field. No charging, no battery replacement, indefinite lifespan.',
  },
  {
    q: 'How long does Daztao take to ship across India?',
    a: 'Orders are dispatched within 1 to 2 business days. Delivery across India takes 3 to 7 business days depending on your location. Prepaid orders receive free shipping. COD orders incur a Rs. 100 handling fee.',
  },
  {
    q: 'What is the Daztao bundle deal?',
    a: 'The Duo Pack gives you 2 keychains for Rs. 500, saving Rs. 98 vs. buying individually. The Creator Bundle gives you 5 keychains for Rs. 1000 — buy 4 at Rs. 250 each and get the 5th free. Both deals are available to signed-in members.',
  },
  {
    q: 'What is the return or refund policy?',
    a: 'Daztao accepts returns within 7 days of delivery if the product is unused and in its original condition. If you receive a defective or damaged item, contact us at daztaoo@gmail.com immediately and we will arrange a replacement at no cost.',
  },
  {
    q: 'How do I contact Daztao for order support?',
    a: 'Email daztaoo@gmail.com. Please include your Order ID in the subject line for the fastest resolution. We respond within 24 to 48 hours.',
  },
];

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans overflow-x-hidden">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-[68px] border-b border-gray-100">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-6">
            Support
          </span>
          <h1 className="text-[40px] md:text-[64px] font-black tracking-tight text-[#1A1A1A] leading-none mb-6">
            Frequently Asked<br />Questions.
          </h1>
          <p className="text-[16px] text-gray-500 font-light leading-relaxed max-w-lg">
            Everything you need to know about Daztao NFC smart keychains — setup,
            compatibility, ordering, and returns.
          </p>
        </div>
      </section>

      {/* ── Accordion ────────────────────────────────────────────────── */}
      <section aria-label="Frequently asked questions" className="border-b border-gray-100">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 py-16">
          <dl>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-gray-200">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-8 py-6 text-left group"
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <dt className="text-[15px] md:text-[16px] font-semibold text-[#1A1A1A] group-hover:text-gray-500 transition-colors leading-snug">
                    {item.q}
                  </dt>
                  <div
                    className={`shrink-0 w-6 h-6 border border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-200 ${
                      openIndex === i ? 'rotate-45 border-[#1A1A1A] text-[#1A1A1A]' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <Plus className="w-3 h-3" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <dd className="pb-6 pr-10">
                        <p className="text-[14px] text-gray-500 leading-relaxed font-light">{item.a}</p>
                      </dd>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-[22px] font-black text-[#1A1A1A] tracking-tight mb-2">
              Still have a question?
            </h2>
            <p className="text-[14px] text-gray-500 font-light max-w-sm">
              Our support team responds to every message. Email us with your Order ID for the fastest resolution.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="mailto:daztaoo@gmail.com"
              className="flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white text-[13px] font-black uppercase tracking-wide hover:opacity-80 transition-opacity"
              aria-label="Email Daztao support"
            >
              Email Support <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-8 py-4 border border-gray-200 text-[#1A1A1A] text-[13px] font-black uppercase tracking-wide hover:border-[#1A1A1A] transition-colors"
              aria-label="View Daztao contact page"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

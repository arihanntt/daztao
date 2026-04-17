'use client';

import { motion } from 'framer-motion';
import { Mail, MessageSquare, ShieldCheck, Zap, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function ContactClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans overflow-x-hidden">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-[68px] border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-6">
              Contact
            </span>
            <h1 className="text-[48px] md:text-[80px] lg:text-[96px] font-black leading-[0.95] tracking-tight text-[#1A1A1A] mb-8">
              Let's talk.
            </h1>
            <p className="text-[17px] md:text-[20px] text-gray-500 font-light leading-relaxed max-w-xl">
              Whether you need support, have a question about your order, or want to work with us —
              reach out directly and a real person will respond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Channels ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">

            {/* Left — channels */}
            <div className="md:w-1/2">
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-8">
                Reach Us
              </span>
              <h2 className="text-[28px] md:text-[36px] font-black tracking-tight text-[#1A1A1A] leading-tight mb-6">
                Human responses.<br />No noise.
              </h2>
              <p className="text-[15px] text-gray-500 font-light leading-relaxed mb-12 max-w-sm">
                We don't hide behind ticket numbers. Every message is read by a real person
                and replied to within 24 to 48 hours.
              </p>

              <div className="flex flex-col gap-8">
                {[
                  { Icon: Mail,          label: 'Support',  value: 'daztaoo@gmail.com',  href: 'mailto:daztaoo@gmail.com' },
                  { Icon: MessageSquare, label: 'Business', value: 'daztaoo@gmail.com',  href: 'mailto:daztaoo@gmail.com' },
                  { Icon: ShieldCheck,   label: 'Privacy',  value: 'daztaoo@gmail.com',  href: 'mailto:daztaoo@gmail.com' },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-5 group">
                    <div className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-[#1A1A1A] group-hover:text-[#1A1A1A] transition-all shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 mb-1">{label}</p>
                      <a
                        href={href}
                        className="text-[16px] font-semibold text-[#1A1A1A] hover:text-gray-500 transition-colors border-b border-gray-200 pb-0.5"
                      >
                        {value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-400 mt-10 max-w-sm leading-relaxed font-light">
                For order queries, please include your Order ID in the subject line.
                We currently serve customers across all of India.
              </p>
            </div>

            {/* Right — info box */}
            <div className="md:w-1/2">
              <div className="border border-gray-200 bg-white p-8 md:p-10 flex flex-col gap-8">
                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                    <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400 mb-1.5">Response Time</p>
                    <p className="text-[14px] text-[#1A1A1A] font-semibold">Usually within 24–48 hours.</p>
                    <p className="text-[13px] text-gray-500 font-light mt-1">Faster for order-related queries with an Order ID.</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400 mb-1.5">Operations</p>
                    <p className="text-[14px] text-[#1A1A1A] font-semibold">Remote-first, ships pan-India.</p>
                    <p className="text-[13px] text-gray-500 font-light mt-1">Fulfillment partners across major cities. Delivery in 5–7 days.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button
                    onClick={() => router.push('/products')}
                    className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#1A1A1A] hover:opacity-60 transition-opacity"
                    aria-label="Browse Daztao NFC keychain catalog"
                  >
                    Back to Catalog <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
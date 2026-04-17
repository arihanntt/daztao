import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BASE_URL = 'https://daztao.online';

export const metadata: Metadata = {
  title: 'Refund, Return & Cancellation Policy — Daztao NFC Keychains',
  description:
    'Daztao refund and replacement policy for NFC keychain orders. Custom-programmed keychains are non-refundable after dispatch. Replacements issued for Dead on Arrival or wrong items. 7-day window.',
  keywords: ['Daztao refund policy', 'NFC keychain return India', 'Daztao replacement policy', 'Daztao cancellation', 'NFC keychain return policy India'],
  alternates: { canonical: `${BASE_URL}/refund-policy` },
  openGraph: {
    title: 'Refund & Return Policy — Daztao',
    description: 'Daztao refund, replacement and cancellation terms for NFC keychain orders placed in India.',
    url: `${BASE_URL}/refund-policy`,
    siteName: 'Daztao',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/refund-policy`,
  name: 'Refund and Return Policy — Daztao',
  url: `${BASE_URL}/refund-policy`,
  description: 'Daztao refund, replacement, and cancellation policy for NFC keychain orders.',
  inLanguage: 'en-IN',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Refund Policy', item: `${BASE_URL}/refund-policy` },
    ],
  },
  publisher: { '@type': 'Organization', name: 'Daztao', url: BASE_URL },
};

export default function RefundPolicy() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
        <Header />

        <main className="max-w-3xl mx-auto px-6 md:px-8 pt-[68px] pb-24">

          {/* Page Header */}
          <div className="py-16 md:py-24 border-b border-gray-100">
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-4">Store Policies</span>
            <h1 className="text-[40px] md:text-[56px] font-black tracking-tight text-[#1A1A1A] leading-none">
              Refund, Return<br />&amp; Cancellation
            </h1>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gray-400 mt-5">Last Updated: January 2026</p>
          </div>

          {/* Content */}
          <div className="py-12 space-y-12 text-[15px] leading-relaxed text-gray-600 font-light">

            {/* Bold disclaimer */}
            <section className="border border-gray-200 bg-white p-6 md:p-8">
              <h2 className="text-[16px] font-black text-[#1A1A1A] mb-3">Important: Custom-Programmed Products</h2>
              <p className="text-[14px]">
                Daztao NFC keychains are <strong className="text-[#1A1A1A] font-semibold">custom-programmed</strong> with each customer's unique profile link before dispatch.
                Due to the personalized nature of fulfillment, <strong className="text-[#1A1A1A] font-semibold">we do not offer refunds or exchanges once an order has been processed or shipped</strong>, except where Daztao is at fault.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-6 tracking-tight">1. Replacement Eligibility</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 bg-white">
                  <div className="px-5 py-3 border-b border-gray-200 bg-green-50">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-green-700">Eligible for Replacement</p>
                  </div>
                  <ul className="px-5 py-4 space-y-3 text-[14px] text-gray-600">
                    {[
                      'Wrong product sent by Daztao (incorrect design or color)',
                      'Product physically damaged during transit',
                      'NFC chip non-functional on first use (Dead on Arrival)',
                    ].map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-gray-200 bg-white">
                  <div className="px-5 py-3 border-b border-gray-200 bg-red-50">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-700">NOT Eligible</p>
                  </div>
                  <ul className="px-5 py-4 space-y-3 text-[14px] text-gray-600">
                    {[
                      'Change of mind after order placement',
                      'Incorrect link provided by the customer',
                      'Phone does not support NFC (incompatible device)',
                      'Minor cosmetic damage after delivery',
                    ].map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-5 tracking-tight">2. How to Claim a Replacement</h2>
              <p className="mb-5">If you received a defective or wrong item, follow these steps within the claim window:</p>
              <div className="space-y-3">
                {[
                  { n: '01', title: 'Record an unboxing video', body: 'You must record a continuous, uncut unboxing video starting from the sealed package through to product inspection.' },
                  { n: '02', title: 'Contact within 24 hours', body: 'Email daztaoo@gmail.com with your Order ID in the subject line within 24 hours of the delivery timestamp.' },
                  { n: '03', title: 'Submit video for review', body: 'Attach the unboxing video to your email. Our team will review and respond within 48 hours.' },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex gap-5 border border-gray-200 bg-white px-5 py-5">
                    <span className="text-[12px] font-black text-gray-300 mt-0.5 shrink-0 w-6">{n}</span>
                    <div>
                      <p className="text-[14px] font-black text-[#1A1A1A] mb-1">{title}</p>
                      <p className="text-[13px] text-gray-500 font-light">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-4 tracking-tight">3. Cancellations</h2>
              <p>
                Orders may be cancelled within <strong className="text-[#1A1A1A] font-semibold">2 hours</strong> of placement, only if programming and packing has not yet begun.
                Email <a href="mailto:daztaoo@gmail.com" className="text-[#1A1A1A] font-semibold underline underline-offset-2 hover:opacity-60 transition">daztaoo@gmail.com</a> immediately with your Order ID.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-4 tracking-tight">4. Refund Processing</h2>
              <p>
                In the rare event a cash refund is approved (e.g., product permanently out of stock after payment), the amount is credited back to your original payment source within <strong className="text-[#1A1A1A] font-semibold">5–7 business days</strong>, subject to your bank's processing time.
              </p>
            </section>

            <section className="border-t border-gray-100 pt-10">
              <p className="text-[13px] text-gray-400">
                All replacement decisions are made at the sole discretion of Daztao management after reviewing the submitted evidence. Claims that do not meet the criteria stated above will not be accepted.
                Contact us at{' '}
                <a href="mailto:daztaoo@gmail.com" className="text-[#1A1A1A] font-semibold hover:opacity-60 transition">
                  daztaoo@gmail.com
                </a>.
              </p>
            </section>

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BASE_URL = 'https://daztao.online';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — Daztao NFC Keychains India',
  description:
    'Daztao ships NFC keychains across all of India. Orders dispatched in 1–2 business days. Metro delivery in 3–5 days, rest of India in 5–7 days. Free shipping on all prepaid orders. COD available.',
  keywords: ['Daztao shipping policy', 'NFC keychain delivery India', 'Daztao COD shipping', 'NFC keychain free shipping India', 'Daztao delivery time'],
  alternates: { canonical: `${BASE_URL}/shipping-policy` },
  openGraph: {
    title: 'Shipping & Delivery Policy — Daztao',
    description: 'Shipping timelines, COD charges, and delivery zones for Daztao NFC keychain orders in India.',
    url: `${BASE_URL}/shipping-policy`,
    siteName: 'Daztao',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/shipping-policy`,
  name: 'Shipping and Delivery Policy — Daztao',
  url: `${BASE_URL}/shipping-policy`,
  description: 'Daztao shipping timelines and delivery policy for NFC keychain orders across India.',
  inLanguage: 'en-IN',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Shipping Policy', item: `${BASE_URL}/shipping-policy` },
    ],
  },
  publisher: { '@type': 'Organization', name: 'Daztao', url: BASE_URL },
};

export default function ShippingPolicy() {
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
              Shipping &amp;<br />Delivery
            </h1>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gray-400 mt-5">Last Updated: January 2026</p>
          </div>

          {/* Content */}
          <div className="py-12 space-y-12 text-[15px] leading-relaxed text-gray-600 font-light">

            <section>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-4 tracking-tight">1. Order Processing &amp; Dispatch</h2>
              <p>
                All Daztao NFC keychain orders are carefully prepared and programmed before dispatch.
                Orders are dispatched within <strong className="text-[#1A1A1A] font-semibold">1–2 business days</strong> of confirmation.
                We operate Monday through Saturday, excluding national holidays.
              </p>
              <p className="mt-3">
                Dispatch may take an additional day during periods of high order volume.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-4 tracking-tight">2. Delivery Timelines</h2>
              <p className="mb-5">Estimated delivery after dispatch, via our logistics partners:</p>
              <div className="border border-gray-200 divide-y divide-gray-100">
                {[
                  ['Metro Cities (Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, Pune, Kolkata)', '3–5 business days'],
                  ['Tier-2 & Tier-3 Cities', '5–7 business days'],
                  ['Remote / Rural Areas', '7–10 business days'],
                ].map(([zone, time]) => (
                  <div key={zone} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 bg-white gap-1">
                    <span className="text-[14px] text-gray-700">{zone}</span>
                    <span className="text-[13px] font-black text-[#1A1A1A] uppercase tracking-wide shrink-0">{time}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[13px] text-gray-400">
                * Estimates only. Actual delivery may vary based on courier operations, weather, and regional constraints.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-4 tracking-tight">3. Shipping Charges</h2>
              <div className="border border-gray-200 divide-y divide-gray-100">
                {[
                  ['Prepaid Orders (UPI / Card / Net Banking)', 'Free Shipping'],
                  ['Cash on Delivery (COD)', 'Rs. 100 handling fee'],
                ].map(([method, charge]) => (
                  <div key={method} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 bg-white gap-1">
                    <span className="text-[14px] text-gray-700">{method}</span>
                    <span className={`text-[13px] font-black uppercase tracking-wide shrink-0 ${charge === 'Free Shipping' ? 'text-green-600' : 'text-[#1A1A1A]'}`}>{charge}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-4 tracking-tight">4. Order Tracking</h2>
              <p>
                Once your NFC keychain is shipped, a tracking number is updated in your{' '}
                <a href="/account/orders" className="text-[#1A1A1A] font-semibold underline underline-offset-2 hover:opacity-60 transition">
                  Order History
                </a>{' '}
                page and sent via WhatsApp or Email. Tracking details may take <strong className="text-[#1A1A1A] font-semibold">24–48 hours</strong> to activate on the courier's website.
              </p>
            </section>

            <section className="border-l-4 border-gray-200 pl-5">
              <h2 className="text-[16px] font-black text-[#1A1A1A] mb-3 tracking-tight">5. Courier Delays</h2>
              <p className="text-[14px]">
                Once your order is handed over to our courier partner, Daztao is not responsible for delays caused by the logistics service, weather events, or operational disruptions outside our control.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-4 tracking-tight">6. Address Accuracy</h2>
              <p>
                Please provide a complete shipping address — including house/flat number, area, landmark, city, state, and pincode.
                Daztao is not liable for non-delivery or return-to-origin (RTO) caused by incorrect address details provided at checkout.
              </p>
            </section>

            <section className="border-t border-gray-100 pt-10">
              <p className="text-[13px] text-gray-400">
                For shipping queries, contact us at{' '}
                <a href="mailto:daztaoo@gmail.com" className="text-[#1A1A1A] font-semibold hover:opacity-60 transition">
                  daztaoo@gmail.com
                </a>{' '}
                with your Order ID in the subject line.
              </p>
            </section>

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
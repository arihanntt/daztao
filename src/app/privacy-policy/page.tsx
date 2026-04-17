import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = 'https://daztao.online';

export const metadata: Metadata = {
  title: 'Privacy Policy — Daztao NFC Keychains India',
  description:
    'Read the Daztao privacy policy. We are committed to protecting your personal data. We only collect the information needed to fulfill your NFC keychain order.',
  keywords: ['Daztao privacy policy', 'NFC keychain store privacy India'],
  alternates: { canonical: `${BASE_URL}/privacy-policy` },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/privacy-policy`,
  name: 'Privacy Policy — Daztao',
  url: `${BASE_URL}/privacy-policy`,
  description: 'Daztao privacy policy — how we collect, use, and protect your data.',
  inLanguage: 'en-IN',
  publisher: { '@type': 'Organization', name: 'Daztao', url: BASE_URL },
};

export default function PrivacyPolicy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      


      <Header />

      <main className="max-w-3xl mx-auto px-4 md:px-6 pt-[120px] pb-24">
        
        {/* Header Block */}
        <div className="mb-20 border-b border-white/5 pb-12">
          <span className="block text-[10px] font-bold tracking-[0.3em] text-zinc-500 mb-6 uppercase">
            Legal & Compliance
          </span>
          <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-6 leading-none">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            Last Updated: January 2026
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-12 text-[14px] leading-7 text-gray-500">
          
          <section>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We believe in minimal data collection. We only collect information strictly necessary to fulfill your order and provide support. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Identity Data:</strong> Name (to address your package).</li>
              <li><strong>Contact Data:</strong> Phone number (for delivery coordination) and Email address (for receipts).</li>
              <li><strong>Delivery Data:</strong> Shipping address.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">2. How We Use Your Data</h2>
            <p className="mb-4">
              <strong>We do not sell, trade, or rent your personal information to others.</strong> Your data is used exclusively for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Processing and shipping your DAZTAO order.</li>
              <li>Sending you tracking updates via WhatsApp or Email.</li>
              <li>Providing human customer support if issues arise.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to maintain the safety of your personal information. Our website is scanned regularly for security holes and known vulnerabilities to make your visit as safe as possible. All payment transactions are processed through a gateway provider and are not stored or processed on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">4. Cookies & Analytics</h2>
            <p>
              DAZTAO may use basic cookies or analytics tools to understand website traffic patterns and improve the user experience. These tools collect aggregate data and do not identify you personally. You can choose to disable cookies through your individual browser options.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">5. Third-Party Services</h2>
            <p>
              We value your trust. We only share limited customer information with trusted third-party services strictly for order fulfillment purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Logistics Partners:</strong> To deliver your package.</li>
              <li><strong>Communication Platforms:</strong> To send order confirmations (e.g., WhatsApp API).</li>
              <li><strong>Payment Processors:</strong> To securely handle transactions.</li>
            </ul>
            <p className="mt-4">
              These parties are obligated to keep your information confidential and use it only for the specific service they provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">6. Your Rights</h2>
            <p>
              You have the right to privacy. You may request access to, correction of, or deletion of your personal data at any time by contacting us. We respect your privacy and will honor such requests wherever legally possible, barring data required for tax or legal records.
            </p>
          </section>

          <section className="border-t border-gray-100 pt-10 mt-10">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">7. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy or how your data is handled, please contact our privacy team directly:
            </p>
            <div className="mt-4">
              <a href="mailto:daztaoo@gmail.com" className="text-[#1A1A1A] border-b border-gray-300 hover:border-[#1A1A1A] transition-colors pb-0.5 text-base font-medium">
                daztaoo@gmail.com
              </a>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}
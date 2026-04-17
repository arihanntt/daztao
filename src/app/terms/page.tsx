import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = 'https://daztao.online';

export const metadata: Metadata = {
  title: 'Terms of Service — Daztao NFC Keychains India',
  description:
    'Read the Daztao terms of service. By purchasing an NFC keychain from Daztao, you agree to these terms governing product usage, customization, liability, and governing law.',
  keywords: ['Daztao terms of service', 'NFC keychain store terms India', 'Daztao legal agreement'],
  alternates: { canonical: `${BASE_URL}/terms` },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/terms`,
  name: 'Terms of Service — Daztao',
  url: `${BASE_URL}/terms`,
  description: 'Terms and conditions for purchasing and using Daztao NFC keychain products.',
  inLanguage: 'en-IN',
  publisher: { '@type': 'Organization', name: 'Daztao', url: BASE_URL },
};

export default function TermsOfService() {
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
            Legal Agreement
          </span>
          <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-6 leading-none">
            Terms of Service
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            Last Updated: January 2026
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-12 text-[14px] leading-7 text-gray-500">
          
          <section>
            <h2 className="text-2xl font-serif text-white mb-6">1. Acceptance of Terms</h2>
            <p>
              By accessing our website and placing an order with DAZTAO (operated by Drixe Group), you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and DAZTAO.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">2. Product Usage</h2>
            <p>
              Our NFC products are designed for sharing social media profiles, digital portfolios, and contact information. You agree not to use our products for any illegal or unauthorized purpose, including but not limited to spreading malicious software or engaging in fraudulent activities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">3. Pricing and Availability</h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section className="bg-zinc-900/30 p-8 border-l-2 border-white/10 rounded-r-sm">
            <h2 className="text-xl font-serif text-white mb-4">4. Custom Orders & Personalization</h2>
            <p className="text-zinc-300">
              Many DAZTAO products are customized (programmed or designed) specifically for you. Once an order is confirmed and the customization process has begun, <strong>it cannot be modified or cancelled</strong>. Please review your link details and shipping address carefully before confirming your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">5. NFC Compatibility Disclaimer</h2>
            <p>
              DAZTAO products rely on NFC (Near Field Communication) technology. While most modern smartphones (iPhone XS and newer, and most Android devices) are compatible, it is the customer's responsibility to ensure their device or the recipient's device supports NFC. DAZTAO is not responsible for returns or refunds based on device incompatibility.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">6. Limitation of Liability</h2>
            <p>
              In no event shall DAZTAO, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of DAZTAO and its licensors. The Service is protected by copyright, trademark, and other laws of India. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of DAZTAO.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section className="border-t border-white/5 pt-12 mt-12">
            <h2 className="text-2xl font-serif text-white mb-6">9. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4">
              <a href="mailto:daztaoo@gmail.com" className="text-white border-b border-white/30 hover:border-white transition-colors pb-0.5 text-lg">
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
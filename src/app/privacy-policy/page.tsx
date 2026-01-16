import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DAZTAO collects, uses, and protects your data. Transparency is our core value.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 selection:text-white relative overflow-x-hidden">
      
      {/* --- RETRO GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-32 relative z-10">
        
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
        <div className="space-y-16 text-sm leading-8 text-zinc-400 font-light">
          
          <section>
            <h2 className="text-2xl font-serif text-white mb-6">1. Information We Collect</h2>
            <p className="mb-4">
              We believe in minimal data collection. We only collect information strictly necessary to fulfill your order and provide support. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li><strong>Identity Data:</strong> Name (to address your package).</li>
              <li><strong>Contact Data:</strong> Phone number (for delivery coordination) and Email address (for receipts).</li>
              <li><strong>Delivery Data:</strong> Shipping address.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">2. How We Use Your Data</h2>
            <p className="mb-4">
              <strong>We do not sell, trade, or rent your personal information to others.</strong> Your data is used exclusively for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li>Processing and shipping your DAZTAO order.</li>
              <li>Sending you tracking updates via WhatsApp or Email.</li>
              <li>Providing human customer support if issues arise.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">3. Data Security</h2>
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
            <h2 className="text-2xl font-serif text-white mb-6">5. Third-Party Services</h2>
            <p>
              We value your trust. We only share limited customer information with trusted third-party services strictly for order fulfillment purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li><strong>Logistics Partners:</strong> To deliver your package.</li>
              <li><strong>Communication Platforms:</strong> To send order confirmations (e.g., WhatsApp API).</li>
              <li><strong>Payment Processors:</strong> To securely handle transactions.</li>
            </ul>
            <p className="mt-4">
              These parties are obligated to keep your information confidential and use it only for the specific service they provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">6. Your Rights</h2>
            <p>
              You have the right to privacy. You may request access to, correction of, or deletion of your personal data at any time by contacting us. We respect your privacy and will honor such requests wherever legally possible, barring data required for tax or legal records.
            </p>
          </section>

          <section className="border-t border-white/5 pt-12 mt-12">
            <h2 className="text-2xl font-serif text-white mb-6">7. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy or how your data is handled, please contact our privacy team directly:
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
  );
}
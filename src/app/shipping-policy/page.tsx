import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "Shipping timelines and delivery details for DAZTAO premium NFC products across India.",
};

export default function ShippingPolicy() {
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
            Logistics
          </span>
          <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-6 leading-tight">
            Shipping & Delivery
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            Last Updated: January 2026
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-16 text-sm leading-8 text-zinc-400 font-light">
          
          <section>
            <h2 className="text-2xl font-serif text-white mb-6">1. Order Processing & Dispatch</h2>
            <p>
              DAZTAO products are prepared and packed carefully to ensure quality and accuracy. 
              Orders are typically processed and dispatched within <strong>2–3 business days</strong> after order confirmation.
            </p>
            <p className="mt-4">
              Dispatch timelines may vary slightly during high order volumes, weekends, or public holidays. 
              We operate Monday through Saturday.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">2. Delivery Timelines</h2>
            <p className="mb-4">
              We ship orders across India using reliable economy courier partners to keep shipping free or low-cost. 
              Estimated delivery timelines after dispatch are as follows:
            </p>
            <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-sm">
              <ul className="space-y-4 text-zinc-300">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Metro Cities</span>
                  <span className="font-mono text-white">5–7 business days</span>
                </li>
                <li className="flex justify-between pt-2">
                  <span>Rest of India</span>
                  <span className="font-mono text-white">7–9 business days</span>
                </li>
              </ul>
            </div>
            <p className="mt-6 text-xs text-zinc-500">
              *Delivery times are estimates and may vary due to courier delays, weather conditions, or regional service limitations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">3. Order Tracking</h2>
            <p>
              Once your order is shipped, you will receive a tracking link via WhatsApp or Email. 
              Please note that tracking details may take up to <strong>24–48 hours</strong> to become active on the courier partner’s website after you receive the link.
            </p>
          </section>

          <section className="bg-rose-900/5 border-l-2 border-rose-900/50 p-6">
            <h2 className="text-lg font-serif text-white mb-3">4. Delays & Courier Responsibility</h2>
            <p className="text-zinc-300 text-xs leading-relaxed">
              While we work closely with our courier partners to ensure timely delivery, DAZTAO is not responsible for delays caused by the courier service after dispatch. Once handed over to the logistics partner, delivery timelines are subject to their operational processes and external factors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6">5. Address Accuracy</h2>
            <p>
              Customers are responsible for providing complete and accurate shipping information (including House No, Landmark, and Pincode). DAZTAO will not be responsible for delays, non-delivery, or return-to-origin (RTO) caused by incorrect or incomplete address details provided at checkout.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
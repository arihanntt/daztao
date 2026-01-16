import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Refund, Replacement & Cancellation Policy",
  description: "Clear guidelines on refunds, replacements, and cancellations for custom DAZTAO products.",
};

export default function RefundPolicy() {
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
            Store Policies
          </span>
          <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-6 leading-tight">
            Refund, Replacement <br/> & Cancellation
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            Last Updated: January 2026
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-16 text-sm leading-8 text-zinc-400 font-light">
          
          {/* 1. The Strong Disclaimer */}
          <section className="bg-rose-500/5 border-l-2 border-rose-500 p-8 rounded-r-sm">
            <h2 className="text-xl font-serif text-white mb-4">Important: Customization Policy</h2>
            <p className="text-zinc-300">
              DAZTAO products are customized and programmed specifically for each customer. 
              Due to the personalized nature of our products, <strong>we do not offer refunds, returns, or exchanges once an order has been processed or shipped</strong>, 
              except in cases where we have made an error.
            </p>
          </section>

          {/* 2. Replacement Criteria */}
          <section>
            <h2 className="text-2xl font-serif text-white mb-8">1. Replacement Criteria</h2>
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Eligible */}
              <div>
                <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-4 border-b border-emerald-500/20 pb-2 inline-block">
                  Eligible for Replacement
                </h3>
                <ul className="space-y-3 text-zinc-300 list-disc pl-4">
                  <li>Wrong product sent by us (Incorrect design/color).</li>
                  <li>Product received physically damaged during transit.</li>
                  <li>NFC chip non-functional upon first use (Dead on Arrival).</li>
                </ul>
              </div>

              {/* Not Eligible */}
              <div>
                <h3 className="text-rose-400 font-bold uppercase tracking-widest text-[10px] mb-4 border-b border-rose-500/20 pb-2 inline-block">
                  NOT Eligible
                </h3>
                <ul className="space-y-3 text-zinc-300 list-disc pl-4">
                  <li>Change of mind after ordering.</li>
                  <li>Incorrect links provided by the customer during order.</li>
                  <li>Device incompatibility (User owns a phone without NFC).</li>
                  <li>Minor cosmetic damage caused after delivery.</li>
                </ul>
              </div>

            </div>
          </section>

          {/* 3. The Claim Process (Strict) */}
          <section>
            <h2 className="text-2xl font-serif text-white mb-6">2. How to Claim a Replacement</h2>
            <p className="mb-4">
              We stand by our quality. If you receive a defective item, you must follow this procedure strictly to be eligible for a free replacement:
            </p>
            <ul className="space-y-4 list-decimal pl-5 text-zinc-300">
              <li>
                <strong>The Unboxing Rule:</strong> You must record a <strong>continuous unboxing video</strong> starting from the sealed package to the product inspection. The video must be uncut and unedited.
              </li>
              <li>
                <strong>24-Hour Window:</strong> You must contact our support team via WhatsApp or Email within <strong>24 hours</strong> of the delivery timestamp.
              </li>
              <li>
                <strong>Verification:</strong> Send the video and your Order ID to <span className="text-white font-medium">daztaoo@gmail.com</span>. Our team will review the footage.
              </li>
            </ul>
          </section>

          {/* 4. Cancellations */}
          <section>
            <h2 className="text-2xl font-serif text-white mb-6">3. Cancellations</h2>
            <p>
              Orders can be cancelled within <strong>2 hours</strong> of placement only if the order has not yet been processed. Once customization, packaging, or programming begins, cancellations are not possible due to the bespoke nature of the workflow.
            </p>
          </section>

          {/* 5. Refund Processing */}
          <section>
            <h2 className="text-2xl font-serif text-white mb-6">4. Refund Processing</h2>
            <p>
              In the rare event a refund is approved (e.g., product out of stock after payment), the amount will be credited back to your original payment source within 5-7 business days depending on your bank's processing speed.
            </p>
          </section>

          {/* 6. Final Authority */}
          <section className="border-t border-white/5 pt-12 mt-12">
            <h2 className="text-xl font-serif text-white mb-4">Final Decision</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-wide leading-relaxed">
              All refund, replacement, and cancellation decisions are made solely at the discretion of DAZTAO management after reviewing the evidence provided. We reserve the right to deny claims that appear fraudulent or do not meet the criteria outlined above.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
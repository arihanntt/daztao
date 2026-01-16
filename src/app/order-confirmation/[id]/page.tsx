'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, Copy, Loader2, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; 

export default function OrderConfirmation() {
  const params = useParams(); 
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Safely get the ID
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const amount = searchParams.get('amount');
  const method = searchParams.get('method');

  // YOUR UPI DETAILS
  const MY_UPI_ID = "7889386542@ybl";
  const upiLink = `upi://pay?pa=${MY_UPI_ID}&pn=DAZTAO&am=${amount}&tn=${id}&cu=INR`;

  // UTR State
  const [utr, setUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // Function to submit UTR
  const handleSubmitUtr = async () => {
    if (utr.length < 12) {
      alert("Please enter a valid 12-digit UTR / Reference ID");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Update order in DB
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          utr: utr,
          status: 'Verification Pending' // Updates status for Admin
        })
      });

      if (res.ok) {
        setPaymentSubmitted(true);
      } else {
        alert("Failed to save UTR. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"/>
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"/>

      <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 to-emerald-400" />
        
        <div className="p-8 text-center">
          
          {/* Header Icon */}
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
            <CheckCircle className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-zinc-400 text-sm mb-6">Thank you for your purchase.</p>

          <div className="bg-black/40 rounded-xl p-4 border border-zinc-800/50 mb-8">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Order ID</p>
            <p className="text-xl font-mono text-white tracking-widest select-all">{id}</p>
          </div>

          {method === 'cod' ? (
            // --- COD VIEW ---
            <div className="space-y-4">
              <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                 <Package className="w-8 h-8 text-zinc-300 mx-auto mb-2"/>
                 <h3 className="text-white font-bold mb-1">Dispatching Soon</h3>
                 <p className="text-xs text-zinc-400 leading-relaxed">
                   We have received your request. Your order will be packed and shipped shortly.
                 </p>
              </div>
              <p className="text-xs text-zinc-500">Total to pay on delivery: <span className="text-white font-bold">₹{amount}</span></p>
            </div>
          ) : (
            // --- UPI VIEW ---
            <div className="space-y-6">
              
              {!paymentSubmitted ? (
                <>
                  <div className="bg-white p-4 rounded-xl w-fit mx-auto shadow-xl">
                     <QRCodeSVG value={upiLink} size={160} />
                  </div>

                  {/* Deep Link Button (Mobile) */}
                  <a 
                    href={upiLink}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
                  >
                    <Smartphone className="w-4 h-4" /> Pay via UPI App
                  </a>
                  
                  <div className="text-left bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-4">
                     <div>
                       <p className="text-xs text-zinc-500 mb-1">Step 1: Pay Amount</p>
                       <p className="text-xl font-bold text-white">₹{amount}</p>
                     </div>
                     
                     <div className="border-t border-zinc-800 pt-4">
                       <p className="text-xs text-zinc-500 mb-2">Step 2: Enter UPI Ref / UTR Number</p>
                       <input 
                         placeholder="e.g. 324500128891" 
                         value={utr}
                         onChange={(e) => setUtr(e.target.value)}
                         className="w-full bg-black border border-zinc-700 rounded p-3 text-white text-center tracking-widest font-mono text-sm focus:border-green-500 outline-none"
                         maxLength={12}
                       />
                     </div>
                     
                     <button 
                       onClick={handleSubmitUtr}
                       disabled={isSubmitting || utr.length < 12}
                       className={`w-full py-3 font-bold text-sm rounded transition flex items-center justify-center gap-2 ${
                         utr.length >= 12 
                           ? 'bg-green-500 hover:bg-green-400 text-black' 
                           : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                       }`}
                     >
                       {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Verify Payment"}
                     </button>
                  </div>
                </>
              ) : (
                // --- PAYMENT SUBMITTED STATE ---
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4">
                   <h3 className="text-green-400 font-bold text-lg mb-2">Verification Pending</h3>
                   <p className="text-sm text-zinc-300">
                     Thank you! We have received your UTR <strong>{utr}</strong>.
                   </p>
                   <p className="text-xs text-zinc-500 mt-2">
                     Your order will be marked as "Paid" once we verify it with the bank (usually takes 1-2 hours).
                   </p>
                </div>
              )}

            </div>
          )}
        </div>

        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800">
          <button 
            onClick={() => router.push('/products')}
            className="w-full py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-zinc-200 transition flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
}
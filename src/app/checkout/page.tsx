'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
  Lock, MapPin, CreditCard, Wallet, ArrowRight, ShoppingBag, 
  Loader2, CheckCircle, Truck, Home, ShieldCheck, AlertCircle, Sparkles 
} from 'lucide-react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal } = useCart();
  const [isClient, setIsClient] = useState(false);
  
  // Interaction States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Form State
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    houseNo: '', area: '', landmark: '', city: '', state: '', pincode: '', 
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');

  // --- BUNDLE DISCOUNT LOGIC ---
  // Calculates total quantity of all items in the cart
  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const isDiscountEligible = totalItems >= 2;
  const bundleDiscount = isDiscountEligible ? 100 : 0;
  const codFee = paymentMethod === 'cod' ? 100 : 0;

  // Final Total = (Subtotal - Discount) + COD Fee
  const finalTotal = (cartTotal - bundleDiscount) + codFee;

  useEffect(() => {
    setIsClient(true);
    if (cart.length === 0) router.push('/cart');
  }, [cart, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    let newErrors: any = {};
    if (!formData.firstName) newErrors.firstName = "Required";
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = "Valid number required";
    if (!formData.houseNo) newErrors.houseNo = "Address required";
    if (!formData.pincode) newErrors.pincode = "Pincode required";
    if (!formData.city) newErrors.city = "City required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
        const orderPayload = {
            customer: formData,
            items: cart.map(item => ({
                productId: item._id,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                links: item.links,
                image: item.image
            })),
            amount: finalTotal,
            discountApplied: bundleDiscount,
            paymentMethod: paymentMethod,
        };

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Order failed.");
            setIsProcessing(false);
            return;
        }

        // --- SUCCESS & REDIRECT ---
        localStorage.removeItem('daztao_cart'); 
        
        const params = new URLSearchParams({
            orderId: data.orderId,
            total: finalTotal.toString(),
            method: paymentMethod,
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone
        });

        router.push(`/order-confirmed?${params.toString()}`);

    } catch (error) {
        console.error(error);
        alert("Network error. Please try again.");
        setIsProcessing(false);
    }
  };

  if (!isClient) return <div className="min-h-screen bg-[#080808]" />;

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-sans selection:bg-rose-500/30 selection:text-white pb-32 relative">
      
      {/* --- RETRO GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <Header />

      <section className="pt-40 px-6 max-w-7xl mx-auto relative z-10">
        
        {/* Step Indicator */}
        <div className="flex justify-center mb-12 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 gap-4">
            <span>Cart</span>
            <span className="text-zinc-800">/</span>
            <span className="text-white border-b border-white pb-1">Details</span>
            <span className="text-zinc-800">/</span>
            <span>Confirm</span>
        </div>

        <div className="mb-16 text-center lg:text-left border-b border-white/5 pb-8">
          <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-4">Secure Checkout</h1>
          <p className="text-zinc-500 font-light text-sm">Please complete your shipping details.</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24">

          {/* --- LEFT: FORM --- */}
          <div className={`lg:col-span-7 space-y-12 transition-opacity duration-300 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
            
            <div className="space-y-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-3">
                 <MapPin className="w-4 h-4" /> Shipping Address
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <InputGroup label="First Name" name="firstName" placeholder="Rahul" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                  <InputGroup label="Last Name" name="lastName" placeholder="Sharma" value={formData.lastName} onChange={handleChange} />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <InputGroup label="Phone Number" name="phone" type="tel" placeholder="+91 98765..." value={formData.phone} onChange={handleChange} error={errors.phone} />
                  <InputGroup label="Email (Optional)" name="email" type="email" placeholder="rahul@gmail.com" value={formData.email} onChange={handleChange} />
                </div>

                <div className="h-px bg-white/5 my-4"/>

                <InputGroup label="Flat / House No / Floor" name="houseNo" placeholder="e.g. Flat 402, Galaxy Apartments" value={formData.houseNo} onChange={handleChange} error={errors.houseNo} icon={Home} />
                <InputGroup label="Area / Street / Sector" name="area" placeholder="e.g. Sector 14, MG Road" value={formData.area} onChange={handleChange} />
                <InputGroup label="Landmark (Optional)" name="landmark" placeholder="e.g. Near City Mall" value={formData.landmark} onChange={handleChange} />

                <div className="grid grid-cols-3 gap-6">
                  <InputGroup label="Pincode" name="pincode" placeholder="110001" value={formData.pincode} onChange={handleChange} error={errors.pincode} />
                  <InputGroup label="City" name="city" placeholder="Delhi" value={formData.city} onChange={handleChange} error={errors.city} />
                  <InputGroup label="State" name="state" placeholder="Delhi" value={formData.state} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-3">
                 <Wallet className="w-4 h-4" /> Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div onClick={() => setPaymentMethod('upi')} className={`cursor-pointer border p-6 rounded-sm flex flex-col gap-4 relative transition-all duration-300 ${paymentMethod === 'upi' ? 'bg-zinc-900/40 border-emerald-500/50' : 'bg-transparent border-white/10 hover:border-white/20'}`}>
                  {paymentMethod === 'upi' && <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_currentColor]"/>}
                  <CreditCard className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <div>
                    <span className="text-sm font-bold block text-white mb-1">UPI / Online</span>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Free Shipping</span>
                  </div>
                </div>

                <div onClick={() => setPaymentMethod('cod')} className={`cursor-pointer border p-6 rounded-sm flex flex-col gap-4 relative transition-all duration-300 ${paymentMethod === 'cod' ? 'bg-zinc-900/40 border-orange-500/50' : 'bg-transparent border-white/10 hover:border-white/20'}`}>
                  {paymentMethod === 'cod' && <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_currentColor]"/>}
                  <Truck className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-orange-400' : 'text-zinc-600'}`} />
                  <div>
                    <span className="text-sm font-bold block text-white mb-1">Cash on Delivery</span>
                    <span className="text-[10px] text-orange-400 uppercase tracking-widest font-bold">+ ₹100 Fee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: SUMMARY --- */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-zinc-900/10 border border-white/5 p-8 rounded-sm backdrop-blur-sm">
              <h2 className="text-xl font-serif italic mb-8 text-white">Order Summary</h2>

              <div className="space-y-6 mb-8 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 items-start">
                    <div className="w-16 h-20 bg-zinc-900/50 rounded-sm border border-white/5 overflow-hidden shrink-0 relative">
                      <img src={item.image} className="w-full h-full object-cover opacity-80" alt={item.title} />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-light text-zinc-300 mt-2">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 py-6 space-y-3 text-sm font-light">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{cartTotal}</span>
                </div>
                
                {/* --- AUTO-APPLIED DISCOUNT ROW --- */}
                {isDiscountEligible && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between text-emerald-400 font-medium"
                  >
                    <span className="flex items-center gap-2"><Sparkles className="w-3 h-3"/> Bundle Discount</span>
                    <span className="font-mono">- ₹100</span>
                  </motion.div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  {paymentMethod === 'cod' ? (
                    <span className="text-orange-400 font-mono">+ ₹100</span>
                  ) : (
                    <span className="text-emerald-400 font-mono">FREE</span>
                  )}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Total</span>
                  <motion.span 
                    key={finalTotal} 
                    initial={{ scale: 1.1 }} 
                    animate={{ scale: 1 }} 
                    className="text-3xl font-serif italic text-white"
                  >
                    ₹{finalTotal}
                  </motion.span>
                </div>
                <p className="text-right text-[10px] text-zinc-600 mt-2">Est. Delivery: 3-5 Business Days</p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full py-5 font-bold text-xs uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] ${
                  isProcessing ? 'bg-zinc-800 text-zinc-500 cursor-wait' : 'bg-white text-black hover:scale-[1.02]'
                }`}
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 animate-spin"/> Processing...</>
                ) : (
                  <>Confirm Order <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500 mt-6 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> 100% Secure & Encrypted
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

// --- HELPER COMPONENT ---
function InputGroup({ label, name, type = "text", placeholder, value, onChange, error, icon: Icon }: any) {
  return (
    <div>
      <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 mb-2 block ml-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-0 top-2.5 w-4 h-4 text-zinc-600"/>}
        <input 
          name={name} 
          type={type} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          className={`w-full bg-transparent border-b py-2 text-sm text-white placeholder-zinc-800 focus:outline-none transition-colors ${Icon ? 'pl-8' : ''} ${error ? 'border-red-500/50' : 'border-zinc-800 focus:border-white'}`} 
        />
      </div>
      {error && (
        <div className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3"/> {error}
        </div>
      )}
    </div>
  );
}
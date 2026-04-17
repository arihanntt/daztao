'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { MapPin, Wallet, ArrowRight, Loader2, Truck, Home, ShieldCheck, AlertCircle, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

// --- RAZORPAY SCRIPT LOADER ---
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// --- INPUT COMPONENT ---
function InputField({ label, name, type = 'text', placeholder, value, onChange, error, icon: Icon }: any) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-12 ${Icon ? 'pl-10' : 'pl-4'} pr-4 rounded-full border text-[13px] text-[#1A1A1A] placeholder-gray-400 focus:outline-none transition-all ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-[#1A1A1A]'
          }`}
        />
      </div>
      {error && (
        <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1 pl-2">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    houseNo: '', area: '', landmark: '', city: '', state: '', pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');

  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const isDiscountEligible = totalItems >= 2;
  const bundleDiscount = isDiscountEligible ? 100 : 0;
  const codFee = paymentMethod === 'cod' ? 100 : 0;
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
    const newErrors: any = {};
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Valid number required';
    if (!formData.houseNo) newErrors.houseNo = 'Address required';
    if (!formData.pincode) newErrors.pincode = 'Pincode required';
    if (!formData.city) newErrors.city = 'City required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveOrderToBackend = async (method: string, paymentStatus: string, paymentDetails: any = {}) => {
    const orderPayload = {
      customer: formData,
      items: cart.map((item) => ({
        productId: item._id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        links: item.links || [],
      })),
      amount: finalTotal,
      discountApplied: bundleDiscount,
      paymentMethod: method,
      paymentStatus: paymentStatus,
      paymentDetails: paymentDetails,
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) throw new Error('Failed to save order');
    return await res.json();
  };

  const extractOrderId = (response: any) => {
    if (response.orderId) return response.orderId;
    if (response.order?.orderId) return response.order.orderId;
    if (response._id) return response._id;
    return 'PENDING-ID';
  };

  const processCODPayment = async () => {
    try {
      const savedOrder = await saveOrderToBackend('cod', 'Pending');
      const finalOrderId = extractOrderId(savedOrder);
      localStorage.removeItem('daztao_cart');
      const params = new URLSearchParams({
        orderId: finalOrderId,
        amount: finalTotal.toString(),
        name: `${formData.firstName} ${formData.lastName}`,
        method: 'cod',
      });
      router.push(`/order-confirmed?${params.toString()}`);
    } catch {
      alert('Something went wrong. Please check your connection.');
      setIsProcessing(false);
    }
  };

  const processRazorpayPayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) { alert('Razorpay SDK failed to load.'); setIsProcessing(false); return; }

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Daztao Store',
        description: 'Secure Payment',
        order_id: orderData.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#1A1A1A' },
        handler: async function (response: any) {
          try {
            const savedOrder = await saveOrderToBackend('upi', 'Paid', response);
            const finalOrderId = extractOrderId(savedOrder);
            localStorage.removeItem('daztao_cart');
            const params = new URLSearchParams({
              orderId: finalOrderId,
              amount: finalTotal.toString(),
              name: `${formData.firstName} ${formData.lastName}`,
              method: 'upi',
            });
            router.push(`/order-confirmed?${params.toString()}`);
          } catch {
            const params = new URLSearchParams({
              orderId: 'PAID-VERIFY-PENDING',
              amount: finalTotal.toString(),
              name: `${formData.firstName} ${formData.lastName}`,
              method: 'upi',
            });
            router.push(`/order-confirmed?${params.toString()}`);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch {
      alert('Payment initialization failed.');
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);
    if (paymentMethod === 'cod') {
      await processCODPayment();
    } else {
      await processRazorpayPayment();
    }
  };

  if (!isClient) return <div className="min-h-screen bg-[#FAFAFA]" />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      <Header />

      <main className="pt-[140px] pb-24 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] text-gray-400 uppercase tracking-widest mb-8 font-bold">
            <span>Cart</span>
            <span>/</span>
            <span className="text-[#1A1A1A]">Checkout</span>
            <span>/</span>
            <span>Confirm</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-10">Secure Checkout</h1>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-14">

            {/* ====== FORM (Left) ====== */}
            <div className={`lg:col-span-7 space-y-8 transition-opacity ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>

              {/* Shipping Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Shipping Address
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="First Name" name="firstName" placeholder="Rahul" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                    <InputField label="Last Name" name="lastName" placeholder="Sharma" value={formData.lastName} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Phone" name="phone" type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} error={errors.phone} />
                    <InputField label="Email (Optional)" name="email" type="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="h-px bg-gray-100" />
                  <InputField label="House / Flat No." name="houseNo" placeholder="Flat 402, Galaxy Apartments" value={formData.houseNo} onChange={handleChange} error={errors.houseNo} icon={Home} />
                  <InputField label="Area / Street" name="area" placeholder="Sector 14, MG Road" value={formData.area} onChange={handleChange} />
                  <InputField label="Landmark (Optional)" name="landmark" placeholder="Near City Mall" value={formData.landmark} onChange={handleChange} />
                  <div className="grid grid-cols-3 gap-4">
                    <InputField label="Pincode" name="pincode" placeholder="110001" value={formData.pincode} onChange={handleChange} error={errors.pincode} />
                    <InputField label="City" name="city" placeholder="Delhi" value={formData.city} onChange={handleChange} error={errors.city} />
                    <InputField label="State" name="state" placeholder="Delhi" value={formData.state} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Payment Method
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex flex-col gap-3 p-5 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === 'upi' ? 'border-[#1A1A1A] bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-[#1A1A1A] self-end" />}
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-[#1A1A1A]' : 'text-gray-400'}`} />
                    <div>
                      <span className="text-[13px] font-bold block text-[#1A1A1A]">UPI / Cards</span>
                      <span className="text-[11px] text-green-600 font-medium">Free, Fast & Secure</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex flex-col gap-3 p-5 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === 'cod' ? 'border-[#1A1A1A] bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#1A1A1A] self-end" />}
                    <Truck className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#1A1A1A]' : 'text-gray-400'}`} />
                    <div>
                      <span className="text-[13px] font-bold block text-[#1A1A1A]">Cash on Delivery</span>
                      <span className="text-[11px] text-orange-500 font-medium">+₹100 handling fee</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* ====== ORDER SUMMARY (Right) ====== */}
            <div className="lg:col-span-5">
              <div className="sticky top-40 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-[16px] font-black mb-6 text-[#1A1A1A]">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-56 overflow-y-auto scrollbar-hide">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3 items-start">
                      <div className="w-14 h-16 bg-gray-100 rounded-xl overflow-hidden relative shrink-0 border border-gray-200">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-[13px] font-bold text-[#1A1A1A] mt-1">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-100 py-4 space-y-3 text-[13px]">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#1A1A1A]">₹{cartTotal}</span>
                  </div>
                  {isDiscountEligible && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between text-green-600 font-medium"
                    >
                      <span>Bundle Discount</span>
                      <span>- ₹100</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    {paymentMethod === 'cod' ? (
                      <span className="text-orange-500 font-medium">+ ₹100</span>
                    ) : (
                      <span className="text-green-600 font-medium">FREE</span>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total</span>
                    <motion.span
                      key={finalTotal}
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-black text-[#1A1A1A]"
                    >
                      ₹{finalTotal}
                    </motion.span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-full flex items-center justify-center gap-3 text-[13px] font-bold transition-all ${
                    isProcessing ? 'bg-gray-200 text-gray-500 cursor-wait' : 'bg-[#1A1A1A] text-white hover:opacity-80'
                  }`}
                >
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <>{paymentMethod === 'cod' ? 'Confirm & Order' : 'Pay Now'} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[9px] text-gray-400 mt-4 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> 100% Secure & Encrypted
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ArrowUpRight, Clock, Truck, CheckCircle2, XCircle, X, Copy, ExternalLink, IndianRupee } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface OrderItem { title: string; quantity: number; price: number; image?: string; links?: string[] }
interface Order {
  _id: string; orderId: string;
  items: OrderItem[];
  amount: number; status: string; isPaid: boolean;
  paymentMethod: 'upi' | 'cod';
  trackingNumber?: string;
  createdAt: string;
  customer: { firstName: string; lastName: string; email: string; houseNo?: string; area?: string; city?: string; state?: string; pincode?: string }
}

const TIMELINE = ['Pending', 'Processing', 'Shipped', 'Delivered'] as const;
const normStatus = (s: string) => s === 'Pending Verification' ? 'Pending' : (s || 'Pending');

// ─────────────────────────────────────────────────────────────────────────────
// Status pill
// ─────────────────────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const s = normStatus(status);
  const map: Record<string, { cls: string; Icon: React.FC<{ className?: string }> }> = {
    Pending:    { cls: 'bg-amber-50 text-amber-700 border-amber-200',   Icon: Clock         },
    Processing: { cls: 'bg-blue-50 text-blue-700 border-blue-200',      Icon: Clock         },
    Shipped:    { cls: 'bg-indigo-50 text-indigo-700 border-indigo-200', Icon: Truck        },
    Delivered:  { cls: 'bg-green-50 text-green-700 border-green-200',   Icon: CheckCircle2  },
    Cancelled:  { cls: 'bg-red-50 text-red-700 border-red-200',         Icon: XCircle       },
  };
  const { cls, Icon } = map[s] ?? { cls: 'bg-gray-100 text-gray-600 border-gray-200', Icon: Clock };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      <Icon className="w-3 h-3" /> {s}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Order detail drawer
// ─────────────────────────────────────────────────────────────────────────────
function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  const statusIdx   = TIMELINE.indexOf(normStatus(order.status) as any);
  const isCancelled = order.status === 'Cancelled';

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 z-[60] w-full max-w-lg bg-[#FAFAFA] border-l border-gray-200 shadow-2xl flex flex-col"
        role="dialog" aria-modal="true" aria-label="Order details"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 mb-1">Order Details</p>
            <h2 className="text-[18px] font-black text-[#1A1A1A] tracking-tight">{order.orderId}</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-100 transition rounded-sm">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* Timeline */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 mb-4">Delivery Status</p>
            <div className="relative flex items-start justify-between">
              <div className="absolute left-4 right-4 top-4 h-px bg-gray-200 -z-0" />
              {TIMELINE.map((step, i) => {
                const done = !isCancelled && i <= statusIdx;
                return (
                  <div key={step} className="flex flex-col items-center gap-2 bg-[#FAFAFA] px-1 z-10 min-w-[60px]">
                    <div className={`w-8 h-8 border-2 flex items-center justify-center text-[11px] font-bold transition-all ${
                      isCancelled ? 'border-red-200 bg-red-50 text-red-400'
                      : done      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                      :             'border-gray-200 bg-white text-gray-300'
                    }`}>
                      {isCancelled ? <XCircle className="w-3.5 h-3.5" /> : done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-bold uppercase text-center leading-tight ${
                      isCancelled ? 'text-red-400' : done ? 'text-[#1A1A1A]' : 'text-gray-300'
                    }`}>{step}</span>
                  </div>
                );
              })}
            </div>

            {/* Tracking number */}
            {order.trackingNumber && (
              <div className="mt-4 flex items-center gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-200">
                <Truck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="text-[12px] font-mono text-indigo-700 flex-1">{order.trackingNumber}</span>
                <button onClick={() => copy(order.trackingNumber!)} className="text-indigo-400 hover:text-indigo-700 transition" title="Copy tracking number">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 mb-4">Items</p>
            <div className="border border-gray-200 divide-y divide-gray-100">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white">
                  {item.image && (
                    <div className="w-12 h-14 bg-gray-100 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-[13px] font-black text-[#1A1A1A]">{item.title}</p>
                      <p className="text-[13px] font-bold text-[#1A1A1A] shrink-0">₹{(item.price || 0) * (item.quantity || 1)}</p>
                    </div>
                    <p className="text-[12px] text-gray-400 mt-0.5">Qty: {item.quantity}</p>

                    {/* NFC profile links */}
                    {item.links?.filter(Boolean).length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 w-full mb-1">Encoded Links</p>
                        {item.links.filter(Boolean).map((link, idx) => (
                          <a
                            key={idx}
                            href={link.startsWith('http') ? link : `https://${link}`}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center gap-1 px-2 py-1 bg-[#1A1A1A] text-white text-[10px] hover:opacity-70 transition"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            {link.length > 30 ? `${link.slice(0, 30)}…` : link}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-3 px-1">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">Total</span>
              <span className="text-[18px] font-black text-[#1A1A1A]">₹{order.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment */}
          <div className={`flex items-center justify-between p-4 border ${order.isPaid ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Payment</p>
              <p className="text-[13px] font-black text-[#1A1A1A] uppercase">{order.paymentMethod}</p>
              <p className={`text-[11px] font-bold uppercase mt-0.5 ${order.isPaid ? 'text-green-700' : 'text-amber-700'}`}>
                {order.isPaid ? 'Confirmed Paid' : 'Pending Confirmation'}
              </p>
            </div>
            <IndianRupee className={`w-5 h-5 ${order.isPaid ? 'text-green-400' : 'text-amber-400'}`} />
          </div>

          {/* Shipping address */}
          {order.customer.city && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 mb-3">Shipping Address</p>
              <div className="px-4 py-3 border border-gray-200 bg-white text-[13px] text-gray-600 leading-relaxed">
                <p className="font-semibold text-[#1A1A1A]">{order.customer.firstName} {order.customer.lastName}</p>
                <p>{order.customer.houseNo}{order.customer.area ? `, ${order.customer.area}` : ''}</p>
                <p>{order.customer.city}, {order.customer.state} {order.customer.pincode}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [detail,  setDetail]  = useState<Order | null>(null);

  useEffect(() => { if (status === 'unauthenticated') router.push('/login?callbackUrl=/account/orders'); }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/orders/mine')
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setOrders(d); })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-[68px]">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-[#1A1A1A] rounded-full animate-spin" />
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
      <Header />

      <main className="max-w-[900px] mx-auto px-6 pt-[68px]">

        {/* Page header */}
        <div className="py-16 md:py-24 border-b border-gray-100">
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-3">Account</span>
          <h1 className="text-[40px] md:text-[56px] font-black tracking-tight text-[#1A1A1A]">Order History</h1>
          {session?.user?.email && <p className="text-[14px] text-gray-400 mt-2">{session.user.email}</p>}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-[#1A1A1A] rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-16 text-center text-[14px] text-red-500 font-medium">{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-16 h-16 border border-gray-200 flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <p className="text-[14px] text-gray-400 font-light">You have no order history.</p>
              <p className="text-[13px] text-gray-400 font-light mt-1">Orders placed on Daztao will appear here.</p>
            </div>
            <button onClick={() => router.push('/products')}
              className="mt-2 px-8 py-3.5 bg-[#1A1A1A] text-white text-[13px] font-black uppercase tracking-wide hover:opacity-80 transition-opacity">
              Shop the Catalog
            </button>
          </motion.div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="py-10">
            {/* Column headers — desktop */}
            <div className="hidden md:grid grid-cols-[1fr_130px_90px_110px_60px] gap-4 pb-3 border-b border-gray-200 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
              <span>Order</span><span>Date</span><span>Total</span><span>Status</span><span />
            </div>

            <div className="divide-y divide-gray-100">
              {orders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_130px_90px_110px_60px] gap-3 md:gap-4 py-6 md:items-center"
                >
                  {/* Order */}
                  <div>
                    <p className="text-[13px] font-black text-[#1A1A1A] tracking-tight">{order.orderId}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 font-light">
                      {order.items.map(it => `${it.title}${it.quantity > 1 ? ` ×${it.quantity}` : ''}`).join(', ')}
                    </p>
                    {/* Tracking chip on mobile */}
                    {order.trackingNumber && (
                      <div className="flex items-center gap-1 mt-1.5 md:hidden">
                        <Truck className="w-3 h-3 text-indigo-500" />
                        <span className="text-[10px] font-mono text-indigo-600">{order.trackingNumber}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[12px] text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>

                  <p className="text-[13px] font-bold text-[#1A1A1A]">₹{order.amount.toLocaleString('en-IN')}</p>

                  <div className="flex flex-col gap-1.5">
                    <StatusPill status={order.status} />
                    {/* Tracking visible on desktop */}
                    {order.trackingNumber && (
                      <div className="hidden md:flex items-center gap-1">
                        <Truck className="w-3 h-3 text-indigo-500" />
                        <span className="text-[10px] font-mono text-indigo-600">{order.trackingNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-start md:justify-end">
                    <button
                      onClick={() => setDetail(order)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-[#1A1A1A] transition-colors"
                    >
                      View <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="pb-24" />
      </main>

      <Footer />

      {/* Order detail drawer */}
      <AnimatePresence>
        {detail && <OrderDrawer order={detail} onClose={() => setDetail(null)} />}
      </AnimatePresence>
    </div>
  );
}

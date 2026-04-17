'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Package, Search, RefreshCw, X, CheckCircle, Truck, Clock,
  ExternalLink, Copy, Phone, Mail, ArrowRight, Ban,
  Calendar, CreditCard, Trash2, Wallet, Activity,
  ChevronLeft, AlertCircle, IndianRupee,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const TABS    = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const TIMELINE = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const norm = (s: string) => (s === 'Pending Verification' ? 'Pending' : (s || 'Pending'));

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  Pending:    { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/25' },
  Processing: { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/25'  },
  Shipped:    { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/25'},
  Delivered:  { bg: 'bg-emerald-500/10',text: 'text-emerald-400',border: 'border-emerald-500/25'},
  Cancelled:  { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/25'   },
};

function StatusBadge({ status }: { status: string }) {
  const s = norm(status);
  const st = STATUS_STYLE[s] ?? { bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${st.bg} ${st.text} ${st.border}`}>
      {s}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminOrders() {
  const router = useRouter();
  const [orders,        setOrders]        = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [selected,      setSelected]      = useState<any>(null);
  const [activeTab,     setActiveTab]     = useState('Pending');
  const [search,        setSearch]        = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState('');

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      const res  = await fetch(`/api/orders?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast('Failed to fetch orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => { fetchOrders(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchOrders(); };

  // ── Toast ────────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Status / isPaid update ───────────────────────────────────────────────
  const updateOrder = async (id: string, payload: Record<string, any>) => {
    setSaving(true);
    // Optimistic
    const patch = (o: any) => o._id === id ? { ...o, ...payload } : o;
    setOrders(prev => prev.map(patch));
    if (selected?._id === id) setSelected((s: any) => ({ ...s, ...payload }));

    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      showToast('Order updated.');
    } catch {
      showToast('Save failed — please refresh.');
    } finally {
      setSaving(false);
    }
  };

  // ── Update status shortcut ───────────────────────────────────────────────
  const updateStatus = (id: string, status: string, extra?: Record<string, any>) =>
    updateOrder(id, { status, ...extra });

  // ── Mark as Paid (COD) ───────────────────────────────────────────────────
  const markPaid = (id: string) => updateOrder(id, { isPaid: true });

  // ── Shipped with tracking ────────────────────────────────────────────────
  const markShipped = (id: string) => {
    const payload: any = { status: 'Shipped' };
    if (trackingInput.trim()) payload.trackingNumber = trackingInput.trim();
    updateOrder(id, payload);
    setTrackingInput('');
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this order permanently?')) return;
    setOrders(prev => prev.filter(o => o._id !== id));
    setSelected(null);
    try {
      await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      showToast('Order deleted.');
    } catch {
      showToast('Delete failed — please refresh.');
    }
  };

  // ── Filter + search ──────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    let data = orders;
    if (activeTab === 'Pending')   data = orders.filter(o => ['Pending', 'Pending Verification'].includes(o.status));
    else if (activeTab !== 'All')  data = orders.filter(o => o.status === activeTab);

    // ── Fix #3: safe search — guard against null/undefined fields ─────────
    const q = search.toLowerCase();
    if (!q) return data;
    return data.filter(o =>
      (o.orderId            ?? '').toLowerCase().includes(q) ||
      (o.customer?.firstName ?? '').toLowerCase().includes(q) ||
      (o.customer?.lastName  ?? '').toLowerCase().includes(q) ||
      (o.customer?.email     ?? '').toLowerCase().includes(q) ||
      (o.customer?.phone     ?? '').includes(q)
    );
  }, [orders, activeTab, search]);

  // ── Header stats ─────────────────────────────────────────────────────────
  const stats = {
    revenue:    orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + (o.amount || 0), 0),
    pending:    orders.filter(o => ['Pending', 'Pending Verification'].includes(o.status)).length,
    inProgress: orders.filter(o => ['Processing', 'Shipped'].includes(o.status)).length,
    total:      orders.length,
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans flex flex-col">

      {/* ── Global toast ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 right-4 z-[200] bg-zinc-800 border border-zinc-700 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur shrink-0">
        <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Left — logo + nav */}
          <div className="flex items-center gap-1">
            <button onClick={() => router.push('/admin')} className="flex items-center gap-2 mr-2 text-zinc-500 hover:text-white transition">
              <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm hidden sm:block tracking-tight">Daztao</span>
            </button>
            {[
              { label: 'Overview',  path: '/admin'          },
              { label: 'Orders',    path: '/admin/orders'   },
              { label: 'Products',  path: '/admin/products' },
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => router.push(path)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  path === '/admin/orders'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right — live stats + refresh */}
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-5 text-xs border-r border-zinc-800 pr-5">
              <Stat label="Revenue"    value={`₹${stats.revenue.toLocaleString('en-IN')}`} />
              <Stat label="Pending"    value={stats.pending.toString()}    highlight={stats.pending > 0}  color="text-amber-400" />
              <Stat label="Active"     value={stats.inProgress.toString()} highlight={stats.inProgress > 0} color="text-blue-400" />
              <Stat label="Total"      value={stats.total.toString()} />
            </div>
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg hover:bg-zinc-800 transition text-zinc-500 hover:text-white ${refreshing ? 'animate-spin text-indigo-400' : ''}`}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full p-6">

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 bg-zinc-900/50 border border-zinc-800 p-1 rounded-lg">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === tab
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {tab}
                {tab === 'Pending' && stats.pending > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-black text-[9px] font-black rounded-full flex items-center justify-center">
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 md:max-w-80 group">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID, name, email, phone…"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/20">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-900/80 text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-20 text-center text-zinc-500 animate-pulse">Syncing orders...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-600">
                      <Package className="w-10 h-10 opacity-20" />
                      <p>No orders in <strong>{activeTab}</strong></p>
                    </div>
                  </td></tr>
                ) : filteredData.map(order => (
                  <tr
                    key={order._id}
                    onClick={() => { setSelected(order); setTrackingInput(order.trackingNumber || ''); }}
                    className="hover:bg-zinc-800/30 cursor-pointer transition group"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-indigo-400 text-xs group-hover:text-indigo-300">
                        {order.orderId || order._id?.slice(-8)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-zinc-200 font-medium text-sm">{order.customer?.firstName} {order.customer?.lastName}</p>
                      <p className="text-zinc-500 text-xs">{order.customer?.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 text-xs max-w-[180px] truncate">
                      {order.items?.map((i: any) => `${i.title}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(', ')}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {order.paymentMethod === 'upi'
                          ? <CreditCard className="w-3 h-3 text-emerald-400" />
                          : <Wallet className="w-3 h-3 text-amber-400" />}
                        <span className={`text-xs font-bold uppercase ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {order.paymentMethod} · {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-white text-sm">
                      ₹{(order.amount || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          ORDER DETAIL DRAWER
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelected(null)}
            />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0c0c0e] border-l border-zinc-800 shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="px-6 py-5 border-b border-zinc-800 flex items-start justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-bold text-white font-mono">{selected.orderId}</h2>
                    <StatusBadge status={selected.status} />
                    {!selected.isPaid && selected.paymentMethod === 'cod' && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/25">
                        COD Unpaid
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {new Date(selected.createdAt).toLocaleString('en-IN')} · via {selected.paymentMethod?.toUpperCase()}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-zinc-800 rounded-lg transition text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer scroll body */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8 pb-48">

                  {/* ── 1. Timeline ───────────────────────────────────── */}
                  <div>
                    <div className="relative flex items-center justify-between">
                      {/* Track line */}
                      <div className="absolute left-4 right-4 top-4 h-0.5 bg-zinc-800 -z-10" />
                      {TIMELINE.map((step, idx) => {
                        const cur = TIMELINE.indexOf(norm(selected.status));
                        const done = idx <= cur && selected.status !== 'Cancelled';
                        const cancelled = selected.status === 'Cancelled';
                        return (
                          <div key={step} className="flex flex-col items-center gap-2 bg-[#0c0c0e] px-1 z-10">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                              cancelled    ? 'border-red-500 bg-red-900/20 text-red-400'
                              : done       ? 'border-indigo-500 bg-indigo-500 text-white'
                              :              'border-zinc-700 bg-zinc-900 text-zinc-600'
                            }`}>
                              {cancelled ? <Ban className="w-3.5 h-3.5" /> : idx + 1}
                            </div>
                            <span className={`text-[10px] font-bold uppercase text-center ${cancelled ? 'text-red-500' : done ? 'text-white' : 'text-zinc-600'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tracking number display */}
                    {selected.trackingNumber && (
                      <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <Truck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="text-xs text-purple-300 font-mono">{selected.trackingNumber}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(selected.trackingNumber); showToast('Tracking number copied!'); }}
                          className="ml-auto text-zinc-500 hover:text-white transition"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── 2. Customer + Address ─────────────────────────── */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Customer</h3>
                      <p className="text-white font-semibold">{selected.customer?.firstName} {selected.customer?.lastName}</p>
                      <div className="mt-2 space-y-1.5">
                        <a href={`tel:${selected.customer?.phone}`} className="flex items-center gap-1.5 text-indigo-400 hover:underline text-xs">
                          <Phone className="w-3 h-3 shrink-0" /> {selected.customer?.phone}
                        </a>
                        {selected.customer?.email && (
                          <a href={`mailto:${selected.customer.email}`} className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs">
                            <Mail className="w-3 h-3 shrink-0" /> {selected.customer.email}
                          </a>
                        )}
                        <a
                          href={`https://wa.me/91${(selected.customer?.phone || '').replace(/\D/g, '').slice(-10)}`}
                          target="_blank"
                          className="flex items-center gap-1.5 text-green-400 hover:underline text-xs"
                        >
                          <Phone className="w-3 h-3 shrink-0" /> WhatsApp
                        </a>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                        Ship To
                        <button
                          onClick={() => { navigator.clipboard.writeText([selected.customer?.houseNo, selected.customer?.area, selected.customer?.city, selected.customer?.state, selected.customer?.pincode].filter(Boolean).join(', ')); showToast('Address copied!'); }}
                          className="text-zinc-600 hover:text-white transition"
                          title="Copy address"
                        >
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                      </h3>
                      <div className="text-xs text-zinc-300 leading-5 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
                        <p>{selected.customer?.houseNo}{selected.customer?.area ? `, ${selected.customer.area}` : ''}</p>
                        {selected.customer?.landmark && <p className="text-zinc-500">({selected.customer.landmark})</p>}
                        <p>{selected.customer?.city}, {selected.customer?.state}</p>
                        <p className="font-mono text-zinc-500">{selected.customer?.pincode}</p>
                      </div>
                    </div>
                  </div>

                  {/* ── 3. Items ──────────────────────────────────────── */}
                  <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Items Ordered</h3>
                    <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
                      {selected.items?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 p-4 bg-zinc-900/20">
                          {item.image && (
                            <div className="w-14 h-16 bg-zinc-800 rounded overflow-hidden shrink-0">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-bold text-sm text-white">{item.title}</p>
                              <p className="font-mono text-sm text-zinc-400 shrink-0 ml-2">₹{(item.price || 0) * (item.quantity || 1)}</p>
                            </div>
                            <p className="text-xs text-zinc-500">Qty: <span className="text-white">{item.quantity}</span></p>

                            {/* Profile links the customer entered */}
                            {item.links?.filter(Boolean).length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {item.links.filter(Boolean).map((link: string, idx: number) => (
                                  <a
                                    key={idx}
                                    href={link.startsWith('http') ? link : `https://${link}`}
                                    target="_blank"
                                    rel="noopener"
                                    className="flex items-center gap-1 px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-[10px] hover:bg-indigo-500/20 transition border border-indigo-500/20"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5" />
                                    {link.length > 28 ? `${link.slice(0, 28)}…` : link}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order total */}
                    <div className="flex justify-between items-center mt-3 px-1">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">Order Total</span>
                      <span className="font-mono font-black text-white text-lg">₹{(selected.amount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* ── 4. Payment card ───────────────────────────────── */}
                  <div className={`flex items-center justify-between p-4 rounded-xl border ${selected.isPaid ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Payment</p>
                      <p className="text-sm font-bold text-white uppercase">{selected.paymentMethod}</p>
                      <p className={`text-xs font-bold uppercase mt-0.5 ${selected.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {selected.isPaid ? 'Confirmed Paid' : 'Payment Pending'}
                      </p>
                    </div>
                    {!selected.isPaid && (
                      <button
                        onClick={() => markPaid(selected._id)}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                      >
                        <IndianRupee className="w-3.5 h-3.5" /> Mark as Paid
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* ── Sticky action bar ────────────────────────────────── */}
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-zinc-800 bg-[#0c0c0e] space-y-3 z-20 shrink-0">

                {/* Tracking number input — show when moving to Shipped */}
                {selected.status === 'Processing' && (
                  <div className="flex gap-2">
                    <input
                      value={trackingInput}
                      onChange={e => setTrackingInput(e.target.value)}
                      placeholder="Tracking / AWB number (optional)"
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                )}

                <div className="flex gap-3">

                  {/* Pending → Accept / Reject */}
                  {['Pending', 'Pending Verification'].includes(selected.status) && (
                    <>
                      <button onClick={() => updateStatus(selected._id, 'Processing')} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition disabled:opacity-60 shadow-lg shadow-indigo-900/30">
                        <CheckCircle className="w-4 h-4" /> Accept Order
                      </button>
                      <button onClick={() => updateStatus(selected._id, 'Cancelled')} disabled={saving} className="px-5 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm rounded-xl transition">
                        Reject
                      </button>
                    </>
                  )}

                  {/* Processing → Shipped / Cancel */}
                  {selected.status === 'Processing' && (
                    <>
                      <button onClick={() => markShipped(selected._id)} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition disabled:opacity-60 shadow-lg shadow-purple-900/30">
                        <Truck className="w-4 h-4" /> Mark Shipped
                      </button>
                      <button onClick={() => updateStatus(selected._id, 'Cancelled')} disabled={saving} className="px-5 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold text-sm rounded-xl transition">
                        Cancel
                      </button>
                    </>
                  )}

                  {/* Shipped → Delivered */}
                  {selected.status === 'Shipped' && (
                    <button onClick={() => updateStatus(selected._id, 'Delivered', { isPaid: true })} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition disabled:opacity-60 shadow-lg shadow-emerald-900/30">
                      <CheckCircle className="w-4 h-4" /> Mark Delivered
                    </button>
                  )}

                  {/* Delivered / Cancelled — archive */}
                  {['Delivered', 'Cancelled'].includes(selected.status) && (
                    <div className="w-full flex gap-3">
                      <div className="flex-1 flex items-center justify-center text-sm text-zinc-500 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        Order {selected.status}
                      </div>
                      <button onClick={() => deleteOrder(selected._id)} className="px-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/40 rounded-xl transition flex items-center" title="Delete permanently">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {saving && (
                  <p className="text-center text-xs text-zinc-500 animate-pulse">Saving...</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
function Stat({ label, value, highlight = false, color = 'text-white' }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-zinc-500">{label}</span>
      <span className={`font-mono text-sm font-bold ${highlight ? color : 'text-white'}`}>{value}</span>
    </div>
  );
}
'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Package, Search, RefreshCw, X, 
  CheckCircle, Truck, Clock, MapPin, 
  ExternalLink, Copy, Phone, Mail, ArrowRight, Ban, 
  Calendar, CreditCard, Trash2, AlertTriangle, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION ---
const TABS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

// Helper: Fix status naming for logic
const getNormalizedStatus = (status: string) => {
  if (status === 'Pending Verification') return 'Pending';
  return status;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Pending');
  const [search, setSearch] = useState('');

  // --- 1. DATA FETCHING ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  // --- 2. UPDATE STATUS ---
  const updateStatus = async (id: string, newStatus: string, isPaid?: boolean) => {
    const payload: any = { status: newStatus };
    if (isPaid !== undefined) payload.isPaid = isPaid;

    setOrders(prev => prev.map(o => o._id === id ? { ...o, ...payload } : o));
    
    if (selectedOrder && selectedOrder._id === id) {
      setSelectedOrder({ ...selectedOrder, ...payload });
    }

    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      alert("Sync failed. Please refresh.");
    }
  };

  // --- 3. DELETE ORDER ---
  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;

    // Optimistic Delete
    setOrders(prev => prev.filter(o => o._id !== id));
    setSelectedOrder(null);

    try {
      await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    } catch (err) {
      alert("Delete failed. Please refresh.");
    }
  };

  // --- 4. FILTERING ENGINE ---
  const filteredData = useMemo(() => {
    let data = orders;

    if (activeTab === 'Pending') {
      data = orders.filter(o => ['Pending', 'Pending Verification'].includes(o.status));
    } else if (activeTab === 'Processing') { 
      data = orders.filter(o => o.status === 'Processing');
    } else if (activeTab === 'Shipped') {
      data = orders.filter(o => o.status === 'Shipped');
    } else if (activeTab === 'Delivered') {
      data = orders.filter(o => o.status === 'Delivered');
    } else if (activeTab === 'Cancelled') {
      data = orders.filter(o => o.status === 'Cancelled');
    }

    return data.filter(o => 
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search)
    );
  }, [orders, activeTab, search]);

  // --- STATS ---
  const stats = {
    revenue: orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.amount : 0), 0),
    newOrders: orders.filter(o => ['Pending', 'Pending Verification'].includes(o.status)).length,
    inProgress: orders.filter(o => ['Processing', 'Shipped'].includes(o.status)).length
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Order Mangement</span>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-500 border-r border-zinc-800 pr-6 h-8">
                <div className="flex flex-col items-end">
                   <span>Net Revenue</span>
                   <span className="text-white font-mono text-sm">₹{stats.revenue.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span>Pending</span>
                   <span className="text-orange-500 font-mono text-sm">{stats.newOrders}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span>Active</span>
                   <span className="text-blue-500 font-mono text-sm">{stats.inProgress}</span>
                </div>
             </div>
             
             <button 
               onClick={handleRefresh}
               className={`p-2 rounded-full hover:bg-zinc-800 transition text-zinc-400 hover:text-white ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`}
               title="Refresh Data"
             >
               <RefreshCw className="w-5 h-5"/>
             </button>
          </div>
        </div>
      </header>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full p-6">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-1 bg-zinc-900/50 border border-zinc-800 p-1 rounded-lg">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === tab 
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/20 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/80 text-zinc-500 font-medium border-b border-zinc-800 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-20 text-center text-zinc-500 animate-pulse">Syncing orders...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-600">
                        <Package className="w-12 h-12 mb-4 opacity-10"/>
                        <p className="text-zinc-500">No orders found in {activeTab}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((order) => (
                    <tr 
                      key={order._id} 
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-zinc-900/60 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-white font-bold group-hover:text-indigo-400 transition-colors">{order.orderId}</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        <div className="flex items-center gap-2">
                           <Calendar className="w-3 h-3"/> 
                           {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-200">{order.customer.firstName} {order.customer.lastName}</div>
                        <div className="text-xs text-zinc-500">{order.customer.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      {/* --- FIXED PAYMENT STATUS DISPLAY --- */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           {order.paymentMethod === 'upi' 
                             ? <CreditCard className="w-3 h-3 text-emerald-400"/> 
                             : <Wallet className="w-3 h-3 text-orange-400"/>
                           }
                           <span className={`text-xs font-bold uppercase ${order.isPaid ? 'text-emerald-500' : 'text-zinc-400'}`}>
                             {order.paymentMethod} 
                             <span className="text-[9px] opacity-60 ml-1">
                               ({order.isPaid ? 'PAID' : 'PENDING'})
                             </span>
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-white">₹{order.amount}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- DRAWER (THE BRAIN) --- */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0c0c0e] border-l border-zinc-800 shadow-2xl flex flex-col"
            >
              
              {/* Drawer Header */}
              <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-[#0c0c0e]">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    {selectedOrder.orderId}
                    <StatusBadge status={selectedOrder.status} />
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()} via {selectedOrder.paymentMethod.toUpperCase()}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-zinc-800 rounded-full transition text-zinc-500 hover:text-white">
                  <X className="w-6 h-6"/>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
                
                {/* 1. VISUAL TIMELINE */}
                <div className="relative pb-2">
                  <div className="absolute left-0 top-[14px] w-full h-0.5 bg-zinc-800 -z-10" />
                  <div className="flex justify-between">
                    {STEPS.map((step, idx) => {
                      const currentStatus = getNormalizedStatus(selectedOrder.status);
                      const currentIdx = STEPS.indexOf(currentStatus);
                      const isCompleted = idx <= currentIdx && selectedOrder.status !== 'Cancelled';
                      const isCancelled = selectedOrder.status === 'Cancelled';

                      return (
                        <div key={step} className="flex flex-col items-center gap-2 bg-[#0c0c0e] px-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                            isCancelled 
                              ? 'border-red-500 bg-red-900/20 text-red-500' 
                              : isCompleted 
                                ? 'border-indigo-500 bg-indigo-500 text-white' 
                                : 'border-zinc-700 bg-zinc-900 text-zinc-600'
                          }`}>
                            {isCancelled ? <Ban className="w-4 h-4"/> : (idx + 1)}
                          </div>
                          <span className={`text-[10px] font-bold uppercase ${
                            isCancelled ? 'text-red-500' : isCompleted ? 'text-white' : 'text-zinc-600'
                          }`}>
                            {step}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 2. CUSTOMER & SHIPPING */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Customer</h3>
                    <div>
                      <p className="text-white font-medium text-lg">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                      <div className="flex flex-col gap-2 mt-2">
                        <a href={`tel:${selectedOrder.customer.phone}`} className="flex items-center gap-2 text-indigo-400 hover:underline text-sm">
                          <Phone className="w-3 h-3"/> {selectedOrder.customer.phone}
                        </a>
                        {selectedOrder.customer.email && (
                          <a href={`mailto:${selectedOrder.customer.email}`} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm">
                            <Mail className="w-3 h-3"/> {selectedOrder.customer.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      Shipping To 
                      <button onClick={() => navigator.clipboard.writeText(`${selectedOrder.customer.houseNo}, ${selectedOrder.customer.city}`)} title="Copy" className="text-zinc-600 hover:text-white transition">
                        <Copy className="w-3 h-3"/>
                      </button>
                    </h3>
                    <div className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/30 p-3 rounded-lg border border-zinc-800">
                      <p className="text-white font-medium">{selectedOrder.customer.houseNo}, {selectedOrder.customer.area}</p>
                      {selectedOrder.customer.landmark && <p className="text-zinc-500 text-xs mt-1">({selectedOrder.customer.landmark})</p>}
                      <p className="mt-1">{selectedOrder.customer.city}, {selectedOrder.customer.state}</p>
                      <p className="font-mono text-zinc-500 mt-1">{selectedOrder.customer.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* 3. ITEMS TABLE */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Items Ordered</h3>
                  <div className="border border-zinc-800 rounded-xl overflow-hidden">
                    {selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-5 p-4 border-b border-zinc-800 last:border-0 bg-zinc-900/20">
                        <div className="w-16 h-20 bg-zinc-800 rounded-md overflow-hidden shrink-0">
                           <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-sm text-white">{item.title}</p>
                            <p className="font-mono text-sm text-zinc-400">₹{item.price * item.quantity}</p>
                          </div>
                          <p className="text-xs text-zinc-500">Qty: <span className="text-white">{item.quantity}</span></p>
                          
                          {/* LINKS */}
                          {item.links && item.links.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.links.map((link: string, idx: number) => (
                                <a key={idx} href={link} target="_blank" className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md text-[10px] hover:bg-indigo-500/20 transition border border-indigo-500/20">
                                  <ExternalLink className="w-3 h-3"/> Link {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Payment & Contact (FIXED VISUALS) */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                      <span className="text-xs text-zinc-500 block mb-1">Payment Status</span>
                      <div className="flex items-center justify-between">
                         <div>
                            <span className="block text-white font-bold uppercase text-xs">{selectedOrder.paymentMethod}</span>
                            <span className={`text-[10px] font-bold uppercase ${selectedOrder.isPaid ? 'text-emerald-500' : 'text-orange-500'}`}>
                               {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                            </span>
                         </div>
                         <span className="font-mono text-white text-lg">₹{selectedOrder.amount}</span>
                      </div>
                   </div>
                   
                   <a href={`https://wa.me/91${selectedOrder.customer.phone?.replace(/\D/g,'').slice(-10)}`} target="_blank" className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 hover:bg-green-500/20 transition font-bold text-sm">
                      <Phone className="w-4 h-4"/> Chat on WhatsApp
                   </a>
                </div>

              </div>

              {/* --- STICKY ACTIONS BAR --- */}
              <div className="p-6 border-t border-zinc-800 bg-[#0c0c0e] space-y-4 z-20 absolute bottom-0 left-0 right-0">
                <div className="flex gap-3">
                  
                  {/* PENDING ACTIONS */}
                  {getNormalizedStatus(selectedOrder.status) === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(selectedOrder._id, 'Processing')} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-900/20 transition flex items-center justify-center gap-2">
                        Accept Order <ArrowRight className="w-4 h-4"/>
                      </button>
                      <button onClick={() => updateStatus(selectedOrder._id, 'Cancelled')} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white py-3.5 rounded-xl font-bold text-sm transition">
                        Reject
                      </button>
                    </>
                  )}

                  {/* PROCESSING ACTIONS */}
                  {selectedOrder.status === 'Processing' && (
                    <>
                      <button onClick={() => updateStatus(selectedOrder._id, 'Shipped')} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/20 transition flex items-center justify-center gap-2">
                        Mark Shipped <Truck className="w-4 h-4"/>
                      </button>
                      <button onClick={() => updateStatus(selectedOrder._id, 'Cancelled')} className="px-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 py-3.5 rounded-xl font-bold text-sm transition">
                        Cancel
                      </button>
                    </>
                  )}

                  {/* SHIPPED ACTIONS */}
                  {selectedOrder.status === 'Shipped' && (
                    <button onClick={() => updateStatus(selectedOrder._id, 'Delivered', true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2">
                       Mark Delivered <CheckCircle className="w-4 h-4"/>
                    </button>
                  )}

                  {/* DELIVERED / CANCELLED ACTIONS (FIXED DELETE BUTTON) */}
                  {['Delivered', 'Cancelled'].includes(selectedOrder.status) && (
                     <div className="w-full flex gap-3">
                        <div className="flex-1 flex items-center justify-center text-sm text-zinc-500 bg-zinc-900/50 rounded-xl border border-zinc-800">
                           Order is {selectedOrder.status}
                        </div>
                        <button 
                          onClick={() => deleteOrder(selectedOrder._id)} 
                          className="px-4 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 rounded-xl transition flex items-center justify-center"
                          title="Delete Order Permanently"
                        >
                           <Trash2 className="w-5 h-5"/>
                        </button>
                     </div>
                  )}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- BADGE ---
function StatusBadge({ status }: { status: string }) {
  const norm = getNormalizedStatus(status);
  const styles: any = {
    'Pending': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Processing': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Shipped': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'Delivered': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[norm] || 'bg-zinc-800 text-zinc-400'}`}>
      {norm}
    </span>
  );
}
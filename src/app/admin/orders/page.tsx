'use client';
import { useState, useEffect } from 'react';
import { 
  Trash2, CheckCircle, Truck, Package, Search, 
  MapPin, Phone, CreditCard, Link as LinkIcon, X, Calendar 
} from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState('');

  // --- FETCH ORDERS ---
  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  // --- ACTIONS ---
  const updateStatus = async (id: string, status: string, isPaid?: boolean) => {
    const payload: any = { status };
    if (isPaid !== undefined) payload.isPaid = isPaid;

    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    // Update local state without reload
    setOrders(prev => prev.map(o => o._id === id ? { ...o, ...payload } : o));
    if (selectedOrder) setSelectedOrder({ ...selectedOrder, ...payload });
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this order permanently?")) return;
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    setOrders(prev => prev.filter(o => o._id !== id));
    setSelectedOrder(null);
  };

  // --- STATS ---
  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  // --- FILTERING ---
  const filteredOrders = orders.filter(o => 
    o.orderId.toLowerCase().includes(filter.toLowerCase()) || 
    o.customer.phone.includes(filter) ||
    o.customer.firstName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-purple-500/30">
      
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" /> Order Management
          </h1>
          <div className="flex gap-6 text-sm">
             <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
               <span className="text-zinc-500 block text-[10px] uppercase font-bold">Total Revenue</span>
               <span className="text-lg font-bold text-white">₹{totalRevenue.toLocaleString()}</span>
             </div>
             <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
               <span className="text-zinc-500 block text-[10px] uppercase font-bold">Pending</span>
               <span className="text-lg font-bold text-orange-500">{pendingCount}</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* TOOLBAR */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
            <input 
              placeholder="Search by Order ID, Name, or Phone..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-purple-500 outline-none transition"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button onClick={fetchOrders} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm font-bold transition">Refresh</button>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-3">
          {loading ? (
             <div className="text-center py-20 text-zinc-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
             <div className="text-center py-20 text-zinc-500">No orders found.</div>
          ) : (
            filteredOrders.map((order) => (
              <div 
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="group bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-zinc-600 hover:bg-zinc-900 transition-all"
              >
                {/* ID & Customer */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {order.status === 'Delivered' ? <CheckCircle className="w-5 h-5"/> : <Truck className="w-5 h-5"/>}
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-white">{order.orderId}</span>
                         <span className="text-xs text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-zinc-400">{order.customer.firstName} {order.customer.lastName}</p>
                   </div>
                </div>

                {/* Amount & Method */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                   <div className="text-right sm:text-left">
                      <span className="block text-[10px] text-zinc-500 uppercase font-bold">Amount</span>
                      <span className="font-mono font-bold">₹{order.amount}</span>
                   </div>
                   <div className="text-right sm:text-left">
                      <span className="block text-[10px] text-zinc-500 uppercase font-bold">Method</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${order.paymentMethod === 'upi' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                        {order.paymentMethod === 'upi' ? 'UPI' : 'COD'}
                      </span>
                   </div>
                   <div className="text-right sm:text-left">
                      <span className="block text-[10px] text-zinc-500 uppercase font-bold">Status</span>
                      <span className={`text-xs font-bold ${order.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                        {order.status}
                      </span>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* --- ORDER DETAIL MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09090b] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800 flex justify-between items-start sticky top-0 bg-[#09090b] z-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Order {selectedOrder.orderId}
                  <span className={`text-xs px-2 py-1 rounded border ${selectedOrder.isPaid ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                    {selectedOrder.isPaid ? 'PAID' : 'PAYMENT PENDING'}
                  </span>
                </h2>
                <p className="text-zinc-500 text-sm mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-zinc-800 rounded-lg"><X className="w-5 h-5"/></button>
            </div>

            <div className="p-6 space-y-8">
              
              {/* 1. STATUS CONTROLS */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => updateStatus(selectedOrder._id, 'Shipped', true)}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4"/> Mark Shipped & Paid
                </button>
                <button 
                  onClick={() => handleDelete(selectedOrder._id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4"/> Delete Order
                </button>
              </div>

              {/* 2. CUSTOMER DETAILS */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-3">
                 <h3 className="font-bold text-zinc-400 text-xs uppercase tracking-widest flex items-center gap-2">
                   <MapPin className="w-3 h-3"/> Customer Details
                 </h3>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                       <p className="text-zinc-500 text-xs">Name</p>
                       <p className="font-medium text-white">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                    </div>
                    <div>
                       <p className="text-zinc-500 text-xs">Phone</p>
                       <a href={`tel:${selectedOrder.customer.phone}`} className="font-medium text-blue-400 hover:underline">{selectedOrder.customer.phone}</a>
                    </div>
                    <div className="col-span-2">
                       <p className="text-zinc-500 text-xs">Address</p>
                       <p className="font-medium text-zinc-300">
                         {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                       </p>
                    </div>
                    {selectedOrder.customer.notes && (
                      <div className="col-span-2 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                         <p className="text-yellow-500 text-xs font-bold">Note:</p>
                         <p className="text-yellow-200 text-xs">{selectedOrder.customer.notes}</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* 3. ITEMS & LINKS (Important!) */}
              <div>
                 <h3 className="font-bold text-zinc-400 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                   <LinkIcon className="w-3 h-3"/> Items & Config
                 </h3>
                 <div className="space-y-3">
                    {selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
                         <img src={item.image} className="w-16 h-20 object-cover rounded bg-zinc-800" />
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="font-bold text-sm">{item.title}</p>
                              <p className="text-xs font-mono">x{item.quantity}</p>
                            </div>
                            
                            {/* THE LINKS */}
                            <div className="mt-3 space-y-1">
                               {item.links.map((link: string, idx: number) => (
                                 <div key={idx} className="flex items-center gap-2 bg-black p-2 rounded border border-zinc-800">
                                    <span className="text-[10px] text-zinc-500 font-bold">#{idx+1}</span>
                                    <a href={link} target="_blank" className="text-xs text-blue-400 truncate hover:underline">{link || "No Link Provided"}</a>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
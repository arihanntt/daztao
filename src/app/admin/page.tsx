'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, Package, DollarSign, 
  ShoppingBag, ExternalLink, Activity, 
  TrendingUp, Calendar, ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

// --- TYPES ---
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeOrders: number;
  averageOrderValue: number;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Real Data States
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0, totalOrders: 0, totalProducts: 0, activeOrders: 0, averageOrderValue: 0
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);

        const products = await productsRes.json();
        const orders = await ordersRes.json();

        // --- 1. CALCULATE CORE METRICS ---
        const validOrders = orders.filter((o: any) => o.status !== 'cancelled'); // Exclude cancelled from revenue
        const revenue = validOrders.reduce((acc: number, o: any) => acc + (o.total || 0), 0);
        const active = orders.filter((o: any) => ['pending', 'processing', 'shipped'].includes(o.status)).length;
        const aov = validOrders.length > 0 ? revenue / validOrders.length : 0;

        // --- 2. GENERATE REVENUE CHART (Last 7 Days) ---
        // Create an array of the last 7 dates
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split('T')[0]; // "2023-10-25"
        });

        // Map orders to these dates
        const chartData = last7Days.map(date => {
          const dayOrders = validOrders.filter((o: any) => o.createdAt?.startsWith(date));
          const dailyTotal = dayOrders.reduce((acc: number, o: any) => acc + (o.total || 0), 0);
          return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), // "Mon"
            fullDate: date,
            revenue: dailyTotal,
            orders: dayOrders.length
          };
        });

        // --- 3. GENERATE STATUS PIE CHART ---
        const statusCounts: Record<string, number> = {};
        orders.forEach((o: any) => {
          const status = o.status || 'pending';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        const pieData = Object.keys(statusCounts).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: statusCounts[key]
        }));

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          activeOrders: active,
          averageOrderValue: Math.round(aov)
        });
        setRevenueData(chartData);
        setStatusData(pieData);
        setRecentOrders(orders.slice(0, 5)); // Top 5 recent
        setLoading(false);

      } catch (err) {
        console.error("Error fetching admin data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 font-mono text-xs animate-pulse">SYNCING DATABASE...</div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Analytics & Operations</h1>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => router.push('/admin/orders')} className="text-xs font-bold text-zinc-400 hover:text-white transition">Orders</button>
             <span className="text-zinc-700">/</span>
             <button onClick={() => router.push('/admin/products')} className="text-xs font-bold text-zinc-400 hover:text-white transition">Products</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-8">

        {/* --- 1. REAL METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={DollarSign}
            sub="Lifetime sales"
          />
          <MetricCard 
            title="Active Orders" 
            value={stats.activeOrders.toString()} 
            icon={ShoppingBag}
            sub="Needs attention"
            alert={stats.activeOrders > 0}
          />
          <MetricCard 
            title="Avg. Order Value" 
            value={`₹${stats.averageOrderValue}`} 
            icon={TrendingUp}
            sub="Per customer"
          />
          <MetricCard 
            title="Total Products" 
            value={stats.totalProducts.toString()} 
            icon={Package}
            sub="Active SKUs"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- 2. REVENUE CHART (REAL DATA) --- */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Revenue Trends</h3>
                <p className="text-xs text-zinc-500">Sales volume over the last 7 days</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-800">
                <Calendar className="w-3 h-3"/> Last 7 Days
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              {revenueData.every(d => d.revenue === 0) ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-lg">
                  <BarChart3 className="w-8 h-8 mb-2 opacity-50"/>
                  <p className="text-sm">No sales data recorded this week.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [`₹${value}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* --- 3. QUICK ACTIONS & STATUS --- */}
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Quick Links</h3>
              <div className="space-y-3">
                <button onClick={() => router.push('/admin/products')} className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition group">
                  <span className="text-sm font-medium">Manage Inventory</span>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white"/>
                </button>
                <button onClick={() => router.push('/admin/orders')} className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition group">
                  <span className="text-sm font-medium">View All Orders</span>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white"/>
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-[250px] flex flex-col">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Order Status</h3>
              <div className="flex-1 w-full min-h-0">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-600">No orders yet</div>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, sub, alert }: any) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${alert ? 'bg-indigo-500/10 text-indigo-500' : 'bg-zinc-800 text-zinc-400'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">{title}</h3>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs text-zinc-600 mt-1">{sub}</p>
      </div>
    </div>
  );
}
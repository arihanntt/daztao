'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3, Package, DollarSign,
  ShoppingBag, Activity, TrendingUp,
  Calendar, ArrowRight, RefreshCw, Home,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeOrders: number;
  averageOrderValue: number;
}

const STATUS_COLORS: Record<string, string> = {
  'Pending Verification': '#f59e0b',
  Pending:    '#f59e0b',
  Processing: '#6366f1',
  Shipped:    '#8b5cf6',
  Delivered:  '#10b981',
  Cancelled:  '#ef4444',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [stats, setStats]             = useState<DashboardStats>({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, activeOrders: 0, averageOrderValue: 0 });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusData, setStatusData]   = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch(`/api/orders?t=${Date.now()}`),
      ]);
      const products = await productsRes.json();
      const orders   = await ordersRes.json();

      // ── Fix #1: use `amount` not `total` ───────────────────────────────
      const validOrders = orders.filter((o: any) => o.status !== 'Cancelled');
      const revenue = validOrders.reduce((acc: number, o: any) => acc + (o.amount || 0), 0);

      // ── Fix #2: correct capitalized status names ───────────────────────
      const ACTIVE_STATUSES = ['Pending', 'Pending Verification', 'Processing', 'Shipped'];
      const active = orders.filter((o: any) => ACTIVE_STATUSES.includes(o.status)).length;
      const aov    = validOrders.length > 0 ? revenue / validOrders.length : 0;

      // ── Revenue chart: last 7 days ─────────────────────────────────────
      const last7 = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });
      const chartData = last7.map(date => {
        const dayOrders = validOrders.filter((o: any) =>
          new Date(o.createdAt).toISOString().startsWith(date)
        );
        return {
          date:    new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
          revenue: dayOrders.reduce((a: number, o: any) => a + (o.amount || 0), 0),
          orders:  dayOrders.length,
        };
      });

      // ── Status pie ─────────────────────────────────────────────────────
      const statusMap: Record<string, number> = {};
      orders.forEach((o: any) => {
        const s = o.status === 'Pending Verification' ? 'Pending' : (o.status || 'Pending');
        statusMap[s] = (statusMap[s] || 0) + 1;
      });
      const pieData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

      setStats({ totalRevenue: revenue, totalOrders: orders.length, totalProducts: products.length, activeOrders: active, averageOrderValue: Math.round(aov) });
      setRevenueData(chartData);
      setStatusData(pieData);
      setRecentOrders(orders.slice(0, 8));
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchData(); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-mono">Syncing database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">Daztao Admin</span>
          </div>

          <nav className="flex items-center gap-1">
            {[
              { label: 'Overview', path: '/admin' },
              { label: 'Orders',  path: '/admin/orders' },
              { label: 'Products', path: '/admin/products' },
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => router.push(path)}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
              >
                {label}
              </button>
            ))}
            <button
              onClick={handleRefresh}
              className={`ml-2 p-2 rounded-lg hover:bg-zinc-800 transition text-zinc-500 hover:text-white ${refreshing ? 'animate-spin text-indigo-400' : ''}`}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">

        {/* ── Metric cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Net Revenue"    value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} icon={DollarSign}  sub="Excl. cancelled" />
          <MetricCard title="Active Orders"  value={stats.activeOrders.toString()}                     icon={ShoppingBag} sub="Needs attention" alert={stats.activeOrders > 0} />
          <MetricCard title="Avg Order Value" value={`₹${stats.averageOrderValue}`}                   icon={TrendingUp}  sub="Per customer" />
          <MetricCard title="Total Products" value={stats.totalProducts.toString()}                    icon={Package}     sub="Active SKUs" />
        </div>

        {/* ── Charts row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Revenue area chart */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-white">Revenue — Last 7 Days</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Daily sales volume</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-800">
                <Calendar className="w-3 h-3" /> 7 Days
              </div>
            </div>
            <div className="h-[280px]">
              {revenueData.every(d => d.revenue === 0) ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-lg">
                  <BarChart3 className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">No sales recorded this week.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', borderRadius: 8, fontSize: 12 }}
                      formatter={(v: any) => [`₹${v}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Status pie + quick links */}
          <div className="flex flex-col gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Order Status</h3>
              <div className="h-[200px]">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} innerRadius={52} outerRadius={72} paddingAngle={4} dataKey="value">
                        {statusData.map((entry, i) => (
                          <Cell key={i} fill={STATUS_COLORS[entry.name] || '#6366f1'} stroke="rgba(0,0,0,0)" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: 8, fontSize: 11 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#71717a' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-600">No orders yet</div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Manage Orders', path: '/admin/orders' },
                  { label: 'Manage Products', path: '/admin/products' },
                ].map(({ label, path }) => (
                  <button key={path} onClick={() => router.push(path)} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition group text-sm font-medium">
                    {label}
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent orders table ──────────────────────────────────────── */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Recent Orders</h3>
            <button onClick={() => router.push('/admin/orders')} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-900/80 text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-600 text-sm">No orders yet.</td></tr>
                ) : recentOrders.map(order => (
                  <tr
                    key={order._id}
                    onClick={() => router.push('/admin/orders')}
                    className="hover:bg-zinc-800/30 cursor-pointer transition"
                  >
                    <td className="px-6 py-3 font-mono font-bold text-indigo-400 text-xs">{order.orderId}</td>
                    <td className="px-6 py-3 text-zinc-300">{order.customer?.firstName} {order.customer?.lastName}</td>
                    <td className="px-6 py-3 text-zinc-500 text-xs">{order.items?.map((i: any) => i.title).join(', ')}</td>
                    <td className="px-6 py-3"><DashStatusBadge status={order.status} /></td>
                    <td className="px-6 py-3 text-right font-mono font-bold text-white">₹{order.amount?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, sub, alert }: any) {
  return (
    <div className={`bg-zinc-900/50 border rounded-xl p-5 ${alert ? 'border-indigo-500/30' : 'border-zinc-800'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${alert ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">{title}</p>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs text-zinc-600 mt-1">{sub}</p>
    </div>
  );
}

function DashStatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || '#6366f1';
  const norm = status === 'Pending Verification' ? 'Pending' : status;
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border" style={{ color, borderColor: `${color}33`, backgroundColor: `${color}15` }}>
      {norm}
    </span>
  );
}
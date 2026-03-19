'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  BarChart3, 
  ShoppingBag, 
  ChefHat, 
  TrendingUp, 
  Clock, 
  Download, 
  Calendar,
  LayoutDashboard,
  Menu as MenuIcon,
  QrCode,
  LogOut,
  Users
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    activeOrders: 0,
    avgWait: 15
  });
  const [latestOrders, setLatestOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch today's orders for revenue and count
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', today.toISOString());

      // Fetch all non-served orders
      const { data: activeOrders } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'served');

      // Fetch latest 5 orders with table info
      const { data: recent } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const revenue = todayOrders?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0;
      
      setStats({
        revenue,
        orders: todayOrders?.length || 0,
        activeOrders: activeOrders?.length || 0,
        avgWait: 12 // Simulated for now
      });
      setLatestOrders(recent || []);
      setLoading(false);
    }

    fetchDashboardData();

    // Subscribe to changes for live dashboard
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchDashboardData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-8 lg:p-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-2">Operational Analytics</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-stone-900">Live Dashboard</h2>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-5 py-3 bg-white border border-stone-100 rounded-2xl text-sm font-bold text-stone-600 shadow-sm">
            <Calendar className="w-4 h-4 text-primary" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-stone-900/10 hover:scale-105 transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>
      
      {/* Real Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Daily Revenue', value: `$${stats.revenue.toFixed(2)}`, trend: '+12%', icon: BarChart3, color: 'text-green-600' },
          { label: 'Today\'s Orders', value: stats.orders, trend: '+5%', icon: ShoppingBag, color: 'text-primary' },
          { label: 'Active Sessions', value: stats.activeOrders, trend: 'Live', icon: TrendingUp, color: 'text-amber-500' },
          { label: 'Average Prep', value: `${stats.avgWait}m`, trend: 'Target', icon: Clock, color: 'text-stone-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/40 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-serif font-bold text-stone-900">{stat.value}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-stone-50 ${stat.color}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <stat.icon className="absolute -bottom-4 -right-4 w-24 h-24 text-stone-100/50 group-hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-stone-50 flex justify-between items-center">
            <h4 className="font-serif text-2xl font-bold text-stone-900">Recent Transactions</h4>
            <Link href="/admin/kitchen" className="text-primary text-sm font-bold hover:underline">Kitchen Queue</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50 text-stone-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Table</th>
                  <th className="px-8 py-5">Value</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {latestOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-6 font-bold text-stone-900 text-sm">#{order.id.slice(0, 5).toUpperCase()}</td>
                    <td className="px-8 py-6 font-medium text-stone-500 text-sm">Table {order.table_number}</td>
                    <td className="px-8 py-6 font-serif font-bold text-stone-900">${order.total_amount.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'served' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Actions / Marketing */}
        <div className="space-y-8">
          <div className="bg-stone-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-stone-900/40">
            <div className="relative z-10">
              <h4 className="font-serif text-2xl font-bold mb-2">QR Growth</h4>
              <p className="text-stone-400 text-sm mb-6 font-medium">Generate new table codes to expand your dining area capacity.</p>
              <Link href="/admin/qr-codes" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-2xl font-bold text-sm hover:scale-105 transition-all">
                <QrCode className="w-4 h-4" />
                Generate Codes
              </Link>
            </div>
            <QrCode className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12" />
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40">
            <h4 className="font-serif text-xl font-bold text-stone-900 mb-6">Staff Performance</h4>
            <div className="space-y-6">
              {[
                { name: 'Kitchen Station', value: 85, color: 'bg-primary' },
                { name: 'Service Speed', value: 92, color: 'bg-green-500' },
                { name: 'Table Turnover', value: 64, color: 'bg-amber-500' },
              ].map((metric) => (
                <div key={metric.name}>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                    <span>{metric.name}</span>
                    <span>{metric.value}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className={`${metric.color} h-full transition-all duration-1000`} style={{ width: `${metric.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

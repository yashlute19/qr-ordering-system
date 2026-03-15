'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Utensils, 
  AlertCircle, 
  Play, 
  Check, 
  History,
  Settings,
  LayoutDashboard,
  Search,
  Bell
} from "lucide-react";

export default function AdminKitchen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .neq('status', 'served')
        .order('created_at', { ascending: true });

      if (data) setOrders(data);
      setLoading(false);
    }

    fetchOrders();

    // Subscribe to all changes in orders table
    const channel = supabase
      .channel('kds-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // New order received!
            fetchOrders(); // Re-fetch to get items too
          } else if (payload.eventType === 'UPDATE') {
            if (payload.new.status === 'served') {
              setOrders(prev => prev.filter(o => o.id !== payload.new.id));
            } else {
              setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, nextStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', orderId);

    if (error) console.error("Update failed:", error);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-amber-500';
      case 'cooking': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-stone-400';
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-stone-50"><ChefHat className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF9] font-display text-stone-900">
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900">Kitchen Display</h1>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/admin/kitchen" className="text-primary font-bold border-b-2 border-primary pb-1 text-sm tracking-wide">Active Orders</Link>
            <Link href="/admin" className="text-stone-400 font-bold hover:text-stone-900 transition-colors text-sm tracking-wide">Dashboard</Link>
            <Link href="/admin/menu" className="text-stone-400 font-bold hover:text-stone-900 transition-colors text-sm tracking-wide">Menu System</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-full border border-stone-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Live Connection</span>
          </div>
          <button className="relative p-2 text-stone-400 hover:text-primary transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </div>
      </header>

      <main className="p-8 flex-1">
        {orders.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-stone-300">
            <ChefHat className="w-20 h-20 mb-4 opacity-20" />
            <h2 className="text-2xl font-serif font-bold italic">No active orders right now</h2>
            <p className="text-sm font-medium mt-2">Take a breather, Chef!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col h-fit animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className={`${getStatusColor(order.status)} px-6 py-5 flex justify-between items-center text-white`}>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-80 mb-0.5">Table</h3>
                    <p className="text-3xl font-serif font-bold">#{order.table_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold opacity-80 mb-0.5">EST. TIME</p>
                    <p className="text-xl font-serif font-bold">15 MIN</p>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 flex-1 space-y-4">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-start group">
                      <div className="flex gap-3">
                        <span className="font-serif font-bold text-lg text-primary">{item.quantity}x</span>
                        <div>
                          <p className="font-bold text-stone-900 leading-tight">{item.menu_items.name}</p>
                          {item.notes && <p className="text-xs text-red-500 font-bold mt-1 uppercase tracking-tighter italic">Note: {item.notes}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timer */}
                <div className="px-6 py-4 bg-stone-50/50 border-t border-stone-50 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span className="font-mono text-xl font-bold text-stone-600">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 grid grid-cols-1 gap-3">
                  {order.status === 'queued' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'cooking')}
                      className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all active:scale-95 shadow-lg shadow-stone-900/10"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>START COOKING</span>
                    </button>
                  )}
                  {order.status === 'cooking' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-600/10"
                    >
                      <Check className="w-5 h-5" />
                      <span>MARK AS READY</span>
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'served')}
                      className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-900 transition-all active:scale-95 shadow-lg shadow-primary/10"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>MARK AS SERVED</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Stats */}
      <footer className="bg-white border-t border-stone-100 p-6 px-8 flex justify-between items-center sticky bottom-0 z-50">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1">Queue</span>
            <span className="text-2xl font-serif font-bold text-amber-500">{orders.filter(o => o.status === 'queued').length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1">Cooking</span>
            <span className="text-2xl font-serif font-bold text-blue-500">{orders.filter(o => o.status === 'cooking').length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1">Ready</span>
            <span className="text-2xl font-serif font-bold text-green-500">{orders.filter(o => o.status === 'ready').length}</span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-400 hover:text-stone-900 transition-colors">
            <History className="w-6 h-6" />
          </button>
          <button className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-400 hover:text-stone-900 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </div>
  );
}

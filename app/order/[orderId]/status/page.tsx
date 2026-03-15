'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, HelpCircle, ChefHat, CheckCircle2, Utensils, Clock, MessageSquare, Home, ReceiptText } from "lucide-react";
import { useParams } from "next/navigation";

export default function OrderTracking() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchOrder() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (data) setOrder(data);
      setLoading(false);
    }

    fetchOrder();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prev: any) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Clock className="animate-spin text-primary" /></div>;
  if (!order) return <div className="flex items-center justify-center min-h-screen text-stone-500 font-medium">Order not found.</div>;

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'queued': return 25;
      case 'cooking': return 50;
      case 'ready': return 75;
      case 'served': return 100;
      default: return 0;
    }
  };

  const statusMessages: Record<string, string> = {
    queued: "We've received your order and it's in the queue.",
    cooking: "Chef is currently preparing your delicious meal.",
    ready: "Your order is ready! A server will be with you shortly.",
    served: "Enjoy your meal! Let us know if you need anything else.",
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF9] pb-24 font-display">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-4 flex items-center justify-between">
        <Link href={`/order-confirmation/${orderId}`} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-stone-900" />
        </Link>
        <h1 className="font-serif text-xl font-bold text-stone-900 pr-9 flex-1 text-center">Track Order</h1>
      </header>

      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full space-y-8">
        {/* Order Header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Live Status</p>
            <h2 className="text-2xl font-bold text-stone-900 leading-none">Order #{orderId.slice(0, 5).toUpperCase()}</h2>
            <p className="text-xs text-stone-500 mt-2 font-medium">Table Number: {order.table_number}</p>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-2xl">
            <ChefHat className="w-8 h-8" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-2">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-serif text-xl text-stone-900 font-bold">Progress</h3>
            <span className="text-primary font-bold text-sm">{getStatusProgress(order.status)}%</span>
          </div>
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${getStatusProgress(order.status)}%` }}
            ></div>
          </div>
          <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-3">
            <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-stone-600 italic">
              {statusMessages[order.status] || "Updating status..."}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-8 relative px-4 py-2">
          <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-stone-100"></div>
          
          {[
            { id: 'queued', label: 'Order Received', icon: ReceiptText },
            { id: 'cooking', label: 'Cooking', icon: Utensils },
            { id: 'ready', label: 'Order Ready', icon: CheckCircle2 },
            { id: 'served', label: 'Served', icon: ChefHat }
          ].map((step, idx) => {
            const isCompleted = getStatusProgress(order.status) >= (idx + 1) * 25;
            const isCurrent = order.status === step.id;
            
            return (
              <div key={step.id} className={`flex gap-6 items-center transition-all duration-500 ${!isCompleted ? 'opacity-30' : ''}`}>
                <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-stone-100 text-stone-400'
                }`}>
                  <step.icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                </div>
                <div className="flex flex-col">
                  <h4 className={`text-lg font-serif font-bold transition-colors duration-500 ${isCurrent ? 'text-primary' : 'text-stone-900'}`}>{step.label}</h4>
                  {isCurrent && <p className="text-[10px] uppercase font-bold tracking-widest text-primary animate-pulse">In Progress</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4">
          <Link href="/menu" className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-stone-100 rounded-2xl text-stone-600 font-bold hover:bg-stone-50 transition-all shadow-sm">
            <Utensils className="w-4 h-4" />
            Order More Items
          </Link>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-100 pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-6">
          <Link href="/menu" className="flex flex-col items-center gap-1 text-stone-400 hover:text-primary transition-colors">
            <Utensils className="w-6 h-6" />
            <p className="text-[10px] font-bold uppercase tracking-wider">Menu</p>
          </Link>
          <Link href={`/order/${orderId}/status`} className="flex flex-col items-center gap-1 text-primary group">
            <ReceiptText className="w-6 h-6" />
            <p className="text-[10px] font-bold uppercase tracking-wider">Status</p>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 text-stone-400 hover:text-primary transition-colors">
            <Home className="w-6 h-6" />
            <p className="text-[10px] font-bold uppercase tracking-wider">Home</p>
          </Link>
        </div>
      </nav>
    </div>
  );
}

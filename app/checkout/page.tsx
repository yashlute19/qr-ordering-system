'use client'

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CreditCard, ChevronRight, Store, Smartphone, Table as TableIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/orders";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function MobileCheckout() {
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');

  useEffect(() => {
    setTableNumber(localStorage.getItem('table_number'));
    
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      alert("Table number not found. Please scan the QR code again.");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'online') {
        // Razorpay logic (Simplified for workflow demo)
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock',
          amount: total * 100,
          currency: "INR",
          name: "Cherry & Cream",
          description: "Restaurant Order",
          handler: async function (response: any) {
            // On payment success, create order
            const order = await createOrder(
              parseInt(tableNumber),
              cart,
              total
            );
            clearCart();
            router.push(`/order/${order.map((o: any) => o.id)[0]}/status`);
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#990003"
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // "Pay at Counter" logic
        const order = await createOrder(
          parseInt(tableNumber),
          cart,
          total
        );
        clearCart();
        router.push(`/order/${order.map((o: any) => o.id)[0]}/status`);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF9] font-display">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-4 flex items-center justify-between">
        <Link href="/cart" className="p-2 hover:bg-stone-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-stone-900" />
        </Link>
        <h1 className="font-serif text-xl font-bold text-stone-900 pr-9 flex-1 text-center">Checkout</h1>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 max-w-lg mx-auto w-full pb-40">
        {/* Table Info */}
        <section className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TableIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary/60 mb-0.5">Your Location</p>
            <p className="text-lg font-bold text-stone-900">{tableNumber ? `Table ${tableNumber}` : 'Scanning Required'}</p>
          </div>
        </section>

        {/* Order Summary */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 px-1">Order Summary</h2>
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-4 py-4 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-stone-50 overflow-hidden border border-stone-100">
                      <img alt={item.name} className="w-full h-full object-cover" src={item.image_url} />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{item.name}</p>
                      <p className="text-[10px] text-stone-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-stone-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="bg-stone-50 px-4 py-4 space-y-2">
              <div className="flex justify-between text-xs font-medium text-stone-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-stone-500">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2">
                <span>Total</span>
                <span className="text-primary font-serif">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 px-1">Payment Method</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setPaymentMethod('online')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                paymentMethod === 'online' ? 'border-primary bg-white shadow-lg shadow-primary/5' : 'border-stone-100 bg-white/50 text-stone-400'
              }`}
            >
              <div className={`p-2 rounded-lg ${paymentMethod === 'online' ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-400'}`}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-bold block text-sm">Pay Online Now</span>
                <span className="text-[10px] font-medium opacity-60">UPI, Cards, Netbanking</span>
              </div>
            </button>
            
            <button 
              onClick={() => setPaymentMethod('counter')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                paymentMethod === 'counter' ? 'border-primary bg-white shadow-lg shadow-primary/5' : 'border-stone-100 bg-white/50 text-stone-400'
              }`}
            >
              <div className={`p-2 rounded-lg ${paymentMethod === 'counter' ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-400'}`}>
                <Store className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-bold block text-sm">Pay at Counter</span>
                <span className="text-[10px] font-medium opacity-60">Pay after dining</span>
              </div>
            </button>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 p-4 pb-12 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50">
        <div className="max-w-lg mx-auto w-full">
          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing || cart.length === 0}
            className="w-full bg-primary hover:bg-stone-900 disabled:bg-stone-200 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>{paymentMethod === 'online' ? 'Proceed to Pay' : 'Place Order'}</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

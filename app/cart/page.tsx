'use client'

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Table as TableIcon, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileCart() {
  const { cart, updateQuantity, removeFromCart, updateNotes, subtotal, totalItems } = useCart();
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  useEffect(() => {
    setTableNumber(localStorage.getItem('table_number'));
  }, []);

  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  if (totalItems === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDFBF9] font-display">
        <header className="sticky top-0 z-10 flex items-center bg-white/80 backdrop-blur-md p-4 border-b border-stone-100">
          <Link href="/menu" className="p-2 hover:bg-stone-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-stone-900" />
          </Link>
          <h2 className="text-stone-900 text-lg font-bold flex-1 text-center pr-9">My Cart</h2>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-[-10vh]">
          <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-stone-300" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">Your cart is empty</h3>
          <p className="text-stone-500 mb-8 max-w-[240px]">Hungry? Browse our menu and add some delicious treats to your cart!</p>
          <Link href="/menu" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF9] font-display">
      <header className="sticky top-0 z-10 flex items-center bg-white/80 backdrop-blur-md p-4 border-b border-stone-100">
        <Link href="/menu" className="p-2 hover:bg-stone-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-stone-900" />
        </Link>
        <h2 className="text-stone-900 text-lg font-bold flex-1 text-center pr-9">My Cart</h2>
      </header>
      
      <main className="flex-1 px-4 py-6 space-y-6 pb-40 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-stone-900 text-xl font-bold">Order Details</h3>
          <span className="text-primary text-xs font-bold px-3 py-1 bg-primary/10 rounded-full uppercase tracking-wider">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
          </span>
        </div>
        
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="flex gap-4 p-4">
                <div 
                  className="w-20 h-20 bg-stone-100 bg-cover bg-center rounded-xl shrink-0" 
                  style={{backgroundImage: `url('${item.image_url}')`}}
                ></div>
                <div className="flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-stone-900 text-base font-bold leading-tight">{item.name}</h4>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-stone-900 font-bold">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 bg-stone-50 p-1 rounded-xl border border-stone-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-stone-600 hover:text-primary transition-all active:scale-90"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center text-stone-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-stone-600 hover:text-primary transition-all active:scale-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="relative group">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-primary" />
                  <input 
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    placeholder="Add cooking notes (optional)"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-stone-400 text-stone-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 p-4 pb-12 space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50">
        <div className="max-w-lg mx-auto w-full space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-500 flex items-center gap-1.5 font-medium italic"><TableIcon className="w-4 h-4" /> Table Number</span>
              <span className="font-bold text-stone-900 bg-stone-50 px-3 py-1 rounded-lg border border-stone-100">
                {tableNumber ? `${tableNumber}` : 'Not detected'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-500 font-medium">Subtotal</span>
              <span className="font-bold text-stone-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-500 font-medium">Tax (5%)</span>
              <span className="font-bold text-stone-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-stone-100">
              <span className="text-base font-bold text-stone-900">Total Amount</span>
              <span className="text-2xl font-serif font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout" className="w-full bg-primary hover:bg-stone-900 transition-all text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/10 flex items-center justify-center gap-2 active:scale-95">
            <span>Continue to Checkout</span>
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

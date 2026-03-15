'use client'

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Search, ShoppingBag, Home, Plus, ChevronRight, Utensils } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Fallback data for preview
const FALLBACK_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'coffee', name: 'Coffee', icon: 'coffee' },
  { id: 'tea', name: 'Tea', icon: 'leaf' },
  { id: 'snacks', name: 'Snacks', icon: 'cookie' },
  { id: 'pastries', name: 'Pastries', icon: 'cake' }
];

const FALLBACK_MENU_ITEMS = [
  { id: '1', name: 'Classic Latte', description: 'Rich espresso with double steamed organic cream', price: 5.50, category_id: 'coffee', image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500&auto=format&fit=crop' },
  { id: '2', name: 'Ceremonial Matcha', description: 'Premium grade stone-ground matcha with honey', price: 6.00, category_id: 'tea', image_url: 'https://images.unsplash.com/photo-1582733315330-226e6d9760bf?q=80&w=500&auto=format&fit=crop' },
  { id: '3', name: 'Cherry Scone', description: 'Buttery house-made pastry with fresh tart cherries', price: 4.50, category_id: 'pastries', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500&auto=format&fit=crop' },
  { id: '4', name: 'Avocado Toast', description: 'Toasted sourdough with chili flakes and radish', price: 12.00, category_id: 'snacks', image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=500&auto=format&fit=crop' },
];

export default function MobileMenu() {
  const searchParams = useSearchParams();
  const table = searchParams.get('table');
  const { addToCart, totalItems } = useCart();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState(FALLBACK_MENU_ITEMS);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Store table number in localStorage
  useEffect(() => {
    if (table) {
      localStorage.setItem('table_number', table);
    }
  }, [table]);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        const { data: catData } = await supabase.from('categories').select('*');
        const { data: itemData } = await supabase.from('menu_items').select('*').eq('is_available', true);
        
        if (catData && catData.length > 0) setCategories([{ id: 'all', name: 'All', icon: 'grid' }, ...catData]);
        if (itemData && itemData.length > 0) setMenuItems(itemData);
      } catch (error) {
        console.log("Using fallback data - Supabase not configured yet");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category_id === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, menuItems]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF9] pb-24 font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-stone-50 rounded-full transition-colors">
            <Home className="w-5 h-5 text-stone-600" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-stone-900 leading-none">Cherry & Cream</h1>
            {table && <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Table {table}</p>}
          </div>
        </div>
        
        <Link href="/cart" className="relative p-2 hover:bg-stone-50 rounded-full transition-colors">
          <ShoppingBag className="w-6 h-6 text-stone-900" />
          {totalItems > 0 && (
            <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
              {totalItems}
            </span>
          )}
        </Link>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-stone-400 text-stone-900 transition-all" 
            placeholder="Search our delicious menu..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex h-10 shrink-0 items-center justify-center px-6 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "bg-white text-stone-600 border border-stone-100 hover:border-stone-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all group">
            <div 
              className="w-28 h-28 bg-stone-100 bg-cover bg-center shrink-0 group-hover:scale-105 transition-transform duration-500" 
              style={{backgroundImage: `url('${item.image_url}')`}}
            ></div>
            <div className="p-3 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 font-medium">{item.description}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-stone-900 font-bold">${item.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart({...item, quantity: 1})}
                  className="bg-primary hover:bg-primary-dark text-white p-2 rounded-xl shadow-lg shadow-primary/10 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <Utensils className="w-12 h-12 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">No items found in this category.</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-100 pb-safe-area">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-6">
          <Link href="/menu" className="flex flex-col items-center gap-1 text-primary group">
            <Utensils className="w-6 h-6" />
            <p className="text-[10px] font-bold uppercase tracking-wider">Menu</p>
          </Link>
          <Link href="/cart" className="flex flex-col items-center gap-1 text-stone-400 hover:text-primary transition-colors">
            <ShoppingBag className="w-6 h-6" />
            <p className="text-[10px] font-bold uppercase tracking-wider">Cart</p>
          </Link>
          <button className="flex flex-col items-center gap-1 text-stone-400 hover:text-primary transition-colors">
            <Home className="w-6 h-6" />
            <p className="text-[10px] font-bold uppercase tracking-wider">Home</p>
          </button>
        </div>
      </nav>
    </div>
  );
}

'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronRight,
  Menu as MenuIcon,
  LayoutDashboard,
  ChefHat,
  QrCode,
  Package,
  MoreVertical
} from "lucide-react";

export default function AdminMenu() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: catData } = await supabase.from('categories').select('*');
      const { data: itemData } = await supabase.from('menu_items').select('*');
      
      if (catData) setCategories(catData);
      if (itemData) setItems(itemData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleAvailability = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ available: !current })
      .eq('id', id);
    
    if (!error) {
      setItems(items.map(item => item.id === id ? { ...item, available: !current } : item));
    }
  };

  const deleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (!error) {
        setItems(items.filter(item => item.id !== id));
      }
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === activeCategory);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-stone-50"><ChefHat className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="flex-1 overflow-y-auto p-10">
      {/* Category Filter */}
      <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`px-8 py-3 rounded-full text-sm font-bold transition-all border ${activeCategory === 'all' ? 'bg-stone-900 text-white border-stone-900 shadow-lg' : 'bg-white text-stone-500 border-stone-100 hover:border-primary/20'}`}
        >
          All Staples
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${activeCategory === cat.id ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-stone-500 border-stone-100 hover:border-primary/20'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40 overflow-hidden group hover:-translate-y-2 transition-all duration-500 flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={item.image_url} alt={item.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!item.available ? 'grayscale opacity-50' : ''}`} />
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <button className="p-3 bg-white shadow-xl rounded-2xl text-stone-400 hover:text-primary transition-all">
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
              {!item.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm">
                  <span className="px-6 py-2 bg-white/20 border border-white/30 rounded-full text-white font-bold text-xs uppercase tracking-widest">Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-2xl font-bold text-stone-900 line-clamp-1">{item.name}</h3>
                <span className="font-serif text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-stone-400 font-medium line-clamp-2 leading-relaxed mb-6">{item.description}</p>
              
              <div className="mt-auto pt-6 border-t border-stone-50 flex items-center justify-between">
                <button 
                  onClick={() => toggleAvailability(item.id, item.available)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${item.available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                >
                  {item.available ? (
                    <><Eye className="w-3.5 h-3.5" /> Published</>
                  ) : (
                    <><EyeOff className="w-3.5 h-3.5" /> Hidden</>
                  )}
                </button>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

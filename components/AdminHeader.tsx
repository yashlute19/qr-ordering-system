'use client'

import { Menu, ChefHat } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="lg:hidden h-16 bg-white border-b border-stone-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-1.5 rounded-xl text-white">
          <ChefHat className="w-5 h-5" />
        </div>
        <h1 className="font-serif text-xl font-bold text-stone-900">La Cerise</h1>
      </div>
      <button 
        onClick={onMenuClick}
        className="p-2 text-stone-600 hover:bg-stone-50 rounded-xl transition-all"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}

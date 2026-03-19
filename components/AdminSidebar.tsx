'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Users,
  X
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Menu System', icon: MenuIcon, href: '/admin/menu' },
    { label: 'Order Analytics', icon: BarChart3, href: '/admin/orders' },
    { label: 'Kitchen View', icon: ChefHat, href: '/admin/kitchen' },
    { label: 'QR Generators', icon: QrCode, href: '/admin/qr-codes' },
    { label: 'Staff Management', icon: Users, href: '/admin/staff' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-stone-100 z-50 
        transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-2xl text-white">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold leading-none text-stone-900">La Cerise</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mt-1">Management</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href} 
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-lg shadow-primary/5' 
                    : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-stone-50">
          <button className="w-full flex items-center justify-between px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm">
            <span>Sign Out</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}

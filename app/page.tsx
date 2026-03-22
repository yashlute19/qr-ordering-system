import Link from "next/link";
import { 
  Utensils, 
  LayoutDashboard, 
  ChefHat, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF9] font-display text-stone-900 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
            <ChefHat className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-stone-900 to-stone-600 bg-clip-text text-transparent">
            La Cerise
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          {['Menu', 'Cart', 'Track'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-widest leading-none">
              {item}
            </Link>
          ))}
          <div className="w-px h-4 bg-stone-100 mx-2"></div>
          <Link href="/admin/login" className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10">
            Admin Access
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 opacity-60"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-xl shadow-stone-200/50 border border-stone-50 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">The Future of Dining is Here</span>
            </div>
            
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-stone-900 mb-8 leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Serve <span className="text-primary italic">Intelligence</span> <br className="hidden md:block" /> with Every Dish.
            </h1>
            
            <p className="text-stone-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
              A comprehensive restaurant operating system. Contactless ordering, real-time kitchen display, and powerful analytics bundled in a premium interface.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
              <Link href="/menu?table=5" className="group bg-primary text-white font-bold px-10 py-5 rounded-[2rem] text-lg shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                <Smartphone className="w-5 h-5" />
                Live Demo: Table 5
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/admin/login" className="bg-white text-stone-900 border border-stone-100 font-bold px-10 py-5 rounded-[2rem] text-lg shadow-xl shadow-stone-200/20 hover:bg-stone-50 transition-all flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-stone-400" />
                Staff Portal
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        {/* <section className="px-6 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">Unified Ecosystem</h2>
              <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Menu",
                  desc: "Visually stunning menu with live search, categorization and real-time stock status.",
                  icon: Utensils,
                  link: "/menu",
                  color: "bg-orange-50 text-orange-600"
                },
                {
                  title: "Manager Suite",
                  desc: "Full administrative dashboard with revenue analytics and item performance tracking.",
                  icon: LayoutDashboard,
                  link: "/admin",
                  color: "bg-blue-50 text-blue-600"
                },
                {
                  title: "Kitchen KDS",
                  desc: "Real-time kitchen display system. Zero-refresh order management for chefs.",
                  icon: ChefHat,
                  link: "/admin/kitchen",
                  color: "bg-red-50 text-red-600"
                },
                {
                  title: "QR Space",
                  desc: "Dynamic QR code generator for table-specific ordering access on the fly.",
                  icon: QrCode,
                  link: "/admin/qr-codes",
                  color: "bg-emerald-50 text-emerald-600"
                },
                {
                  title: "Live Tracking",
                  desc: "Keep guests informed with a real-time tracking interface as their food is prepared.",
                  icon: Zap,
                  link: "/order/demo/status",
                  color: "bg-purple-50 text-purple-600"
                },
                {
                  title: "Staff Center",
                  desc: "Secure authentication and role-based access for your entire hospitality team.",
                  icon: ShieldCheck,
                  link: "/admin/login",
                  color: "bg-stone-50 text-stone-600"
                }
              ].map((feature, i) => (
                <Link key={i} href={feature.link} className="group bg-[#FDFBF9] p-10 rounded-[2.5rem] border border-stone-50 hover:border-primary/20 hover:shadow-2xl hover:shadow-stone-200/40 transition-all duration-500">
                  <div className={`size-16 rounded-[1.5rem] ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-stone-900 mb-4">{feature.title}</h4>
                  <p className="text-stone-400 font-medium leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Screen <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section> */}

        {/* Closing */}
        <section className="px-6 py-32 text-center bg-stone-900 relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          <div className="relative z-10">
            <h3 className="font-serif text-4xl md:text-5xl font-bold text-white mb-8">Ready to transform your table?</h3>
            <p className="text-stone-400 mb-12 max-w-xl mx-auto uppercase tracking-[0.2em] font-bold text-xs">
              Contact us for a full property walkthrough
            </p>
            <div className="flex flex-wrap gap-10 justify-center items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
               {['Premium', 'Responsive', 'Realtime', 'Secure'].map(label => (
                 <div key={label} className="flex items-center gap-3 text-white font-bold tracking-widest text-[10px] uppercase">
                   <CheckCircle2 className="w-4 h-4 text-primary" />
                   {label}
                 </div>
               ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-stone-900 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl text-primary border border-primary/20">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="font-serif text-lg font-bold text-white tracking-tight">La Cerise Group</span>
          </div>
          <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">© 2024 Modern Hospitality Systems</p>
          <div className="flex gap-6">
             {['Privacy', 'Terms', 'Security'].map(f => (
               <span key={f} className="text-stone-500 text-[10px] font-bold uppercase tracking-[0.1em] hover:text-primary transition-colors cursor-pointer">{f}</span>
             ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

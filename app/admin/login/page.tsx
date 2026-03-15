'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from "next/link";
import { Lock, Mail, ChevronRight, ChefHat, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="flex-col min-h-screen bg-[#FDFBF9] flex font-display text-stone-900">
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-900/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="w-full max-w-[460px] flex flex-col gap-10 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100">
              <div className="bg-primary p-2 rounded-xl text-white">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">Cherry & Cream</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mt-4">Management Portal</h1>
            <p className="text-stone-400 font-medium uppercase tracking-widest text-[10px]">Authorized Personnel Only</p>
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-stone-200/60 border border-stone-50 overflow-hidden">
            <div className="p-10 md:p-12 space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-stone-900">Login</h2>
                <p className="text-stone-400 text-sm font-medium">Use your work credentials to continue</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 rounded-[1.25rem] border border-stone-100 bg-stone-50/50 text-stone-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-bold placeholder:text-stone-300" 
                      placeholder="manager@cherrycream.com" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Security Key</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                    <input 
                      required
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 rounded-[1.25rem] border border-stone-100 bg-stone-50/50 text-stone-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-bold placeholder:text-stone-300" 
                      placeholder="••••••••••••" 
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-5 rounded-[1.25rem] shadow-xl shadow-stone-900/10 transition-all flex items-center justify-center gap-3 mt-10 disabled:opacity-50 group"
                >
                  <span>{loading ? 'Verifying...' : 'Unlock Dashboard'}</span>
                  {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-stone-300 text-[10px] font-bold uppercase tracking-widest">
              Secured by Supabase Guard • CC-772
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

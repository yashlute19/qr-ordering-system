'use client'

import { useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Printer, 
  Download, 
  ChevronLeft, 
  Grid2X2, 
  Plus,
  Trash2,
  ChefHat
} from 'lucide-react';

export default function QrGenerator() {
  const [tableCount, setTableCount] = useState(10);
  const [generatedQrs, setGeneratedQrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateCodes = async () => {
    setLoading(true);
    const codes = [];
    const baseUrl = window.location.origin + '/menu';

    for (let i = 1; i <= tableCount; i++) {
      const url = `${baseUrl}?table=${i}`;
      try {
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 800,
          margin: 2,
          color: {
            dark: '#1C1917', // stone-900
            light: '#FFFFFF',
          },
        });
        codes.push({ table: i, url, qrDataUrl });
      } catch (err) {
        console.error(err);
      }
    }
    setGeneratedQrs(codes);
    setLoading(false);
  };

  const downloadAll = () => {
    generatedQrs.forEach((qr) => {
      const link = document.createElement('a');
      link.href = qr.qrDataUrl;
      link.download = `table-${qr.table}-qr.png`;
      link.click();
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-display text-stone-900">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="p-2 hover:bg-stone-50 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-stone-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-white">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold">QR Space</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Table Management</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={downloadAll}
            disabled={generatedQrs.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-stone-900/10 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border border-stone-200 bg-white rounded-2xl text-sm font-bold hover:bg-stone-50 transition-all">
            <Printer className="w-4 h-4" />
            Print Sheets
          </button>
        </div>
      </header>

      <main className="p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Controls */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40 mb-12">
          <div className="flex flex-col md:flex-row items-end gap-8">
            <div className="flex-1 space-y-4">
              <label className="text-xs uppercase font-bold text-stone-400 tracking-widest ml-2">Number of Tables</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={tableCount}
                  onChange={(e) => setTableCount(parseInt(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 font-bold text-lg focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  min="1"
                  max="50"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300">
                  <Grid2X2 className="w-5 h-5" />
                </div>
              </div>
            </div>
            <button 
              onClick={generateCodes}
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-[1.5rem] font-bold text-lg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              {loading ? 'Generating...' : 'Regenerate QR Codes'}
            </button>
          </div>
        </section>

        {/* Results */}
        {generatedQrs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {generatedQrs.map((qr) => (
              <div key={qr.table} className="group bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="aspect-square bg-white rounded-[2rem] border-2 border-stone-50 flex items-center justify-center p-4 mb-6 group-hover:border-primary/20 transition-colors">
                  <img src={qr.qrDataUrl} alt={`Table ${qr.table}`} className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center justify-between px-2">
                  <div>
                    <h3 className="font-serif text-2xl font-bold">Table {qr.table}</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter truncate w-32">{qr.url}</p>
                  </div>
                  <a 
                    href={qr.qrDataUrl} 
                    download={`table-${qr.table}-qr.png`}
                    className="p-3 bg-stone-50 rounded-xl text-stone-400 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center text-stone-200">
            <QrCode className="w-20 h-20 mb-4 opacity-10" />
            <p className="font-serif text-2xl italic font-bold">Ready to generate your digital menu access</p>
          </div>
        )}
      </main>

      {/* Footer Utility */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 border border-white/10 px-8 py-4 rounded-full text-white shadow-2xl flex items-center gap-6 z-50">
        <div className="flex items-center gap-3 pr-6 border-r border-white/10">
          <ChefHat className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest">Brand: Cherry & Cream</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-400">Total Tables:</span>
          <span className="text-sm font-bold text-primary">{generatedQrs.length || tableCount}</span>
        </div>
      </div>
    </div>
  );
}

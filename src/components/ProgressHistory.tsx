import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, User, Clock, CheckCircle2, XCircle, BarChart3, ChevronRight, X, Trophy } from 'lucide-react';

interface QuizResult {
  date: string;
  correct: number;
  wrong: number;
  score: number;
  playerName?: string;
  total?: number;
}

const ProgressHistory: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [currentName, setCurrentName] = useState("");

  useEffect(() => {
    // Ambil data riwayat
    const savedResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    setResults(savedResults);
    
    // Ambil nama aktif
    const name = localStorage.getItem('user-name') || 'Pelajar';
    setCurrentName(name);
  }, []);

  const clear = () => {
    if(confirm("Hapus semua riwayat kuis? Data yang dihapus tidak bisa dikembalikan.")) {
      localStorage.removeItem('quiz-results');
      setResults([]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg mx-auto space-y-6 px-4 pb-20">
      {/* Header Dashboard */}
      <div className="flex items-center justify-between mt-6">
        <div>
          <h2 className="text-2xl font-black text-primary italic tracking-tight">📊 ANALYTICS</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pantau Progress Belajarmu</p>
        </div>
        {results.length > 0 && (
          <button onClick={clear} className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl transition-all shadow-sm active:scale-90">
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
           <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-4xl">📭</div>
           <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Belum ada aktivitas kuis</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {[...results].reverse().map((r, i) => (
            <motion.div 
              key={i} 
              initial={{ x: -20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedResult(r)}
              className="bg-white rounded-[1.8rem] p-5 shadow-sm border-2 border-slate-100 flex items-center gap-4 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group active:scale-[0.98]"
            >
              {/* Score Indicator */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${r.score >= 75 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {r.score}
              </div>

              {/* Info Singkat */}
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-primary uppercase tracking-wider mb-0.5">
                  {new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="font-extrabold text-slate-800 truncate text-lg capitalize">
                  {r.playerName || currentName}
                </p>
                <div className="flex gap-3 mt-1">
                   <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                     <CheckCircle2 size={12} className="text-green-500" /> {r.correct}
                   </span>
                   <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                     <XCircle size={12} className="text-red-500" /> {r.wrong}
                   </span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                <ChevronRight size={18} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- MODAL DETAIL (POP-UP) --- */}
      <AnimatePresence>
        {selectedResult && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Overlay Gelap */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedResult(null)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
            />
            
            {/* Konten Modal */}
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl overflow-hidden"
            >
              {/* Handle Bar untuk Mobile */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />
              
              <button 
                onClick={() => setSelectedResult(null)}
                className="absolute top-8 right-8 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>

              <div className="text-center space-y-8">
                <div className="space-y-2">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto">
                    <Trophy className="text-primary" size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Hasil Evaluasi</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Detail Performa Kamu</p>
                </div>

                {/* Score Circular Chart */}
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="14" fill="transparent" 
                      strokeDasharray={439.8} strokeDashoffset={439.8 - (439.8 * selectedResult.score) / 100}
                      className={`${selectedResult.score >= 70 ? 'text-primary' : 'text-orange-500'} transition-all duration-1000`} 
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800">{selectedResult.score}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skor Akhir</span>
                  </div>
                </div>

                {/* Statistik Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <DetailCard icon={<User size={16}/>} label="Nama" value={selectedResult.playerName || currentName} />
                  <DetailCard icon={<Clock size={16}/>} label="Jam" value={new Date(selectedResult.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} />
                  <DetailCard icon={<CheckCircle2 size={16} className="text-green-500"/>} label="Benar" value={`${selectedResult.correct} Soal`} />
                  <DetailCard icon={<XCircle size={16} className="text-red-500"/>} label="Salah" value={`${selectedResult.wrong} Soal`} />
                  <DetailCard icon={<BarChart3 size={16}/>} label="Total" value={`${(selectedResult.total || 20)} Soal`} />
                  <DetailCard 
                    icon={<div className={`w-3 h-3 rounded-full ${selectedResult.score >= 70 ? 'bg-green-500' : 'bg-red-500'}`} />} 
                    label="Status" 
                    value={selectedResult.score >= 70 ? "LULUS" : "REMEDIAL"} 
                  />
                </div>

                <button 
                  onClick={() => setSelectedResult(null)}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-[1.5rem] shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm active:scale-95"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Komponen Card Kecil di dalam Detail
const DetailCard = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex items-center gap-3">
    <div className="bg-white p-2 rounded-xl shadow-sm text-slate-500">{icon}</div>
    <div className="text-left overflow-hidden">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{label}</p>
      <p className="text-xs font-black text-slate-700 truncate capitalize">{value}</p>
    </div>
  </div>
);

export default ProgressHistory;

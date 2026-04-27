import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  // State untuk menyimpan pilihan jenjang sekolah
  const [schoolLevel, setSchoolLevel] = useState("");

  // Mengecek data login yang tersimpan di localStorage saat aplikasi dimuat
  useEffect(() => {
    const savedName = localStorage.getItem("user-name");
    const savedLevel = localStorage.getItem("user-school-level");
    if (savedName) {
      setUserName(savedName);
    }
    if (savedLevel) {
      setSchoolLevel(savedLevel);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi: Nama minimal 2 karakter DAN jenjang sekolah harus dipilih
    if (inputValue.trim().length >= 2 && schoolLevel !== "") {
      localStorage.setItem("user-name", inputValue.trim());
      localStorage.setItem("user-school-level", schoolLevel);
      setUserName(inputValue.trim());
    }
  };

  // Data untuk opsi sekolah agar gampang di-map menjadi kartu
  const schoolOptions = [
    { id: 'SD', label: 'Sekolah Dasar', icon: '🎒' },
    { id: 'SMP', label: 'SMP', icon: '🏫' },
    { id: 'SMA', label: 'SMA / SMK', icon: '🎓' }
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <AnimatePresence mode="wait">
          {!userName ? (
            /* TAMPILAN LOGIN / INPUT NAMA & SEKOLAH */
            <motion.div 
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F9FA] p-6"
            >
              <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-black text-primary italic tracking-tighter">
                    FUN CLOCK ⏰
                  </h1>
                  <p className="text-muted-foreground font-medium">Masuk untuk memulai petualangan!</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Input Nama Premium */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-2">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Contoh: agus kurniawan"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-primary/10 focus:border-primary focus:bg-white outline-none text-lg font-bold transition-all shadow-sm bg-white/50"
                      autoFocus
                    />
                  </div>

                  {/* Pilihan Sekolah Model Kartu Premium (Tidak Pakai Select Bawaan) */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-2">Pilih Jenjang Sekolah</label>
                    <div className="grid grid-cols-3 gap-3">
                      {schoolOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button" // Penting: type="button" agar form tidak tersubmit saat diklik
                          onClick={() => setSchoolLevel(opt.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                            schoolLevel === opt.id 
                            ? "border-primary bg-primary/5 shadow-md scale-[1.05]" 
                            : "border-primary/10 bg-white hover:border-primary/30"
                          }`}
                        >
                          <span className="text-2xl">{opt.icon}</span>
                          <span className={`text-[10px] font-black ${schoolLevel === opt.id ? "text-primary" : "text-muted-foreground"}`}>
                            {opt.id}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={inputValue.trim().length < 2 || schoolLevel === ""}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
                  >
                    MULAI BELAJAR 🚀
                  </button>
                </form>
                
                <p className="text-[10px] text-center text-muted-foreground font-bold tracking-widest pt-4 uppercase">
                   © 2026 analogstudywebb2
                </p>
              </div>
            </motion.div>
          ) : (
            /* TAMPILAN UTAMA APLIKASI SETELAH LOGIN */
            <motion.div 
              key="app"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-screen bg-background"
            >
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

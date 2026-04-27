import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import AnalogClock from './AnalogClock';
import { formatTime, generateRandomTime } from '@/lib/clockUtils';
import { getQuizResults, QuizResult } from '@/lib/quizUtils';

const THEMES = [
  { name: 'White', class: 'theme-bg-white' },
  { name: 'Black', class: 'theme-bg-black' },
  { name: 'Blue', class: 'theme-bg-blue' },
  { name: 'Pink', class: 'theme-bg-pink' },
  { name: 'Purple', class: 'theme-bg-purple' },
];

interface ClockPlaygroundProps {
  onStartQuiz: () => void;
}

const ClockPlayground: React.FC<ClockPlaygroundProps> = ({ onStartQuiz }) => {
  const [manualHours, setManualHours] = useState(10);
  const [manualMinutes, setManualMinutes] = useState(10);
  const [showDigital, setShowDigital] = useState(true);
  const [theme, setTheme] = useState('theme-bg-white');
  const [history, setHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    setHistory(getQuizResults());
  }, []);

  // Fungsi untuk mengacak waktu
  const handleRandomTime = () => {
    const { hours, minutes } = generateRandomTime();
    setManualHours(hours);
    setManualMinutes(minutes);
  };

  // Fungsi saat jarum ditarik (langsung update state manual)
  const handleTimeChange = useCallback((h: number, m: number) => {
    setManualHours(h);
    setManualMinutes(m);
  }, []);

  const totalSolved = useMemo(() => {
    return history.reduce((acc, curr) => acc + curr.total, 0);
  }, [history]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto pb-6"
    >
      {/* HEADER: Progres */}
      <div className="w-full flex justify-between px-5 py-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-dashed border-primary/40 shadow-sm">
         <div className="flex flex-col">
            <span className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Progres</span>
            <span className="text-lg font-black text-primary">{totalSolved} Soal Selesai</span>
         </div>
         <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Status</span>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Mode Belajar</span>
         </div>
      </div>

      {/* Petunjuk Warna Jarum */}
      <div className="text-center text-sm font-bold text-slate-600 bg-slate-100 px-4 py-1 rounded-full">
        <span className="text-red-500">🔴 Geser Jam</span> &nbsp;|&nbsp; <span className="text-blue-500">🔵 Geser Menit</span>
      </div>

      {/* Pemilih Tema */}
      <div className="flex gap-3 flex-wrap justify-center">
        {THEMES.map(t => (
          <button
            key={t.name}
            onClick={() => setTheme(t.class)}
            className={`w-10 h-10 rounded-full border-4 transition-all ${t.class} 
              ${theme === t.class ? 'border-primary scale-110 shadow-md' : 'border-white'}`}
            title={`Tema ${t.name}`}
          />
        ))}
      </div>

      {/* AREA JAM ANALOG */}
      <div className={`${theme} rounded-[2.5rem] p-6 sm:p-8 shadow-2xl transition-colors duration-500 w-full flex justify-center border-4 border-white`}>
        <AnalogClock
          size={280}
          interactive={true} // Selalu interaktif
          hours={manualHours}
          minutes={manualMinutes}
          onTimeChange={handleTimeChange}
          showLabels={true}
        />
      </div>

      {/* JAM DIGITAL */}
      {showDigital && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary shadow-xl rounded-2xl px-12 py-4 border-b-4 border-primary-foreground/20"
        >
          <span className="text-primary-foreground text-5xl font-black font-display tracking-tighter">
            {formatTime(manualHours, manualMinutes)}
          </span>
        </motion.div>
      )}

      {/* TOMBOL KONTROL */}
      <div className="flex flex-col gap-3 justify-center w-full px-4">
        <div className="flex gap-3 justify-center w-full">
          <button
            onClick={handleRandomTime}
            className="flex-1 bg-emerald-500 text-white px-4 py-4 rounded-2xl font-black shadow-[0_4px_0_rgb(5,150,105)] hover:translate-y-0.5 hover:shadow-none transition-all text-sm uppercase tracking-wider"
          >
            🎲 Acak Waktu
          </button>
          <button
            onClick={() => setShowDigital(!showDigital)}
            className="flex-1 bg-sky-100 text-sky-700 px-2 py-4 rounded-2xl font-bold shadow-[0_4px_0_rgb(186,230,253)] hover:translate-y-0.5 hover:shadow-none transition-all text-xs text-center uppercase"
          >
            {showDigital ? '🙈 Sembunyikan Angka' : '👁 Tampilkan Angka'}
          </button>
        </div>
      </div>

      {/* TOMBOL START KUIS */}
      <button
        onClick={onStartQuiz}
        className="w-full max-w-xs bg-purple-600 text-white px-6 py-5 rounded-3xl font-black text-xl shadow-[0_6px_0_rgb(107,33,168)] hover:translate-y-1 hover:shadow-none transition-all mt-4 animate-bounce"
      >
        MULAI KUIS! 🚀
      </button>
    </motion.div>
  );
};

export default ClockPlayground;

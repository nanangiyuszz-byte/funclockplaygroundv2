import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalogClock from './AnalogClock';
import { generateQuizQuestions, QuizQuestion } from '@/lib/quizUtils';
import { formatTime } from '@/lib/clockUtils';
import { playCorrectSound, playWrongSound, playStartSound } from '@/lib/soundUtils';
import { Trophy, ArrowRight, RotateCcw, Home, Save, CheckCircle, Check, X, Puzzle } from 'lucide-react';

interface QuizSystemProps {
  onBack: () => void;
}

const QuizSystem: React.FC<QuizSystemProps> = ({ onBack }) => {
  // State Utama
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // State untuk Fitur Puzzle (Drag)
  const [dragHours, setDragHours] = useState(12);
  const [dragMinutes, setDragMinutes] = useState(0);
  
  // State Status Kuis
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [isManualSaved, setIsManualSaved] = useState(false);
  
  // FITUR 1: State untuk jumlah soal pilihan (Default 10)
  const [questionLimit, setQuestionLimit] = useState(10); 

  // Fungsi memulai kuis dengan jumlah soal yang dipilih
  const startQuiz = () => {
    const generated = generateQuizQuestions(questionLimit);
    setQuestions(generated);
    playStartSound();
    setStarted(true);
  };

  const q = questions[currentIdx];

  // FUNGSI SIMPAN KE LOCALSTORAGE
  const forceSaveToHistory = () => {
    const savedName = localStorage.getItem('user-name') || 'Pelajar';
    const result = { 
      date: new Date().toISOString(), 
      correct: correct, 
      wrong: wrong, 
      total: questions.length, 
      score: Math.round((correct / questions.length) * 100),
      playerName: savedName
    };

    try {
      const history = JSON.parse(localStorage.getItem('quiz-results') || '[]');
      history.push(result);
      localStorage.setItem('quiz-results', JSON.stringify(history));
      setIsManualSaved(true);
    } catch (err) {
      console.error("Gagal simpan manual:", err);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      forceSaveToHistory();
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setDragHours(12);
      setDragMinutes(0);
    }
  };

  // Handler Pilihan Ganda
  const handleMCAnswer = (ans: string) => {
    if (answered) return;
    setSelectedAnswer(ans);
    setAnswered(true);
    if (ans === q.correctAnswer) {
      playCorrectSound();
      setCorrect(c => c + 1);
    } else {
      playWrongSound();
      setWrong(w => w + 1);
    }
  };

  // FITUR 2: Handler Benar atau Salah
  const handleTFAnswer = (userChoice: boolean) => {
    if (answered) return;
    const isCorrect = userChoice === q.isCorrectAnswer;
    setSelectedAnswer(userChoice ? 'true' : 'false');
    setAnswered(true);
    
    if (isCorrect) {
      playCorrectSound();
      setCorrect(c => c + 1);
    } else {
      playWrongSound();
      setWrong(w => w + 1);
    }
  };

  // FITUR 3: Handler Puzzle (Drag & Drop Jarum)
  const handleDragSubmit = () => {
    if (answered) return;
    setAnswered(true);
    
    // Toleransi 2 menit agar tidak terlalu sulit bagi anak-anak
    const hDiff = Math.abs(dragHours - q.targetHours) % 12;
    const mDiff = Math.abs(dragMinutes - q.targetMinutes);
    
    if (hDiff === 0 && mDiff <= 2) {
      playCorrectSound();
      setCorrect(c => c + 1);
      setSelectedAnswer('correct');
    } else {
      playWrongSound();
      setWrong(w => w + 1);
      setSelectedAnswer('wrong');
    }
  };

  const handleDragTimeChange = useCallback((h: number, m: number) => {
    setDragHours(h);
    setDragMinutes(m);
  }, []);

  // TAMPILAN SETUP: Pilih Jumlah Soal
  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 px-6 text-center max-w-sm mx-auto">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-2"
        >
          <Trophy size={48} className="text-primary" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-800 uppercase italic">Siap Belajar?</h2>
          <p className="text-slate-500 font-bold text-sm">Pilih jumlah soal yang ingin kamu kerjakan:</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 w-full">
          {[5, 10, 15, 20].map((num) => (
            <button
              key={num}
              onClick={() => setQuestionLimit(num)}
              className={`py-4 rounded-2xl font-black border-2 transition-all text-lg ${
                questionLimit === num 
                ? 'border-primary bg-primary text-white shadow-lg' 
                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
              }`}
            >
              {num} Soal
            </button>
          ))}
        </div>

        <button 
          onClick={startQuiz} 
          className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-xl font-black shadow-xl uppercase tracking-widest active:scale-95 transition-all mt-4 flex items-center justify-center gap-3"
        >
          MULAI KUIS 🚀
        </button>
      </div>
    );
  }

  // TAMPILAN HASIL AKHIR
  if (finished) {
    const score = Math.round((correct / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 py-12 px-6">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-2 border-slate-50 text-center space-y-6 w-full max-w-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          <h2 className="text-2xl font-black text-slate-800 uppercase italic">Skor Kamu</h2>
          <div className="text-8xl font-black text-primary my-4">{score}</div>
          
          <div className="flex justify-center gap-4">
            <div className="bg-green-50 px-5 py-3 rounded-2xl border border-green-100">
              <span className="block text-2xl font-black text-green-600">{correct}</span>
              <span className="text-[10px] font-bold text-green-700/50 uppercase">Benar</span>
            </div>
            <div className="bg-red-50 px-5 py-3 rounded-2xl border border-red-100">
              <span className="block text-2xl font-black text-red-500">{wrong}</span>
              <span className="text-[10px] font-bold text-red-600/50 uppercase">Salah</span>
            </div>
          </div>

          <div className="pt-4">
            {!isManualSaved ? (
              <button 
                onClick={forceSaveToHistory}
                className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-md hover:bg-orange-600 transition-all animate-pulse"
              >
                <Save size={18} /> SIMPAN KE RIWAYAT
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-4 rounded-2xl border border-green-100 font-bold">
                <CheckCircle size={18} /> BERHASIL DISIMPAN
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => window.location.reload()} className="bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <RotateCcw size={18} /> Main Lagi
          </button>
          <button onClick={onBack} className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <Home size={18} /> Ke Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  // TAMPILAN AREA KUIS UTAMA
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 pb-10">
      {/* Progress Bar & Header */}
      <div className="w-full space-y-3">
        <div className="flex justify-between items-end">
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
            Soal {currentIdx + 1} / {questions.length}
          </span>
          <div className="flex gap-3">
             <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Check size={14}/> {correct}</span>
             <span className="text-xs font-bold text-red-500 flex items-center gap-1"><X size={14}/> {wrong}</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
          <motion.div animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} className="bg-primary h-full rounded-full" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={q?.id} 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: -20, opacity: 0 }} 
          className="w-full flex flex-col items-center gap-6"
        >
          {/* Label Tipe Soal */}
          <div className="flex items-center gap-2 px-4 py-1.5 bg-yellow-100 rounded-full text-yellow-700">
             {q?.type === 'drag' ? <Puzzle size={14}/> : <CheckCircle size={14}/>}
             <span className="text-[10px] font-black uppercase">{q?.type === 'drag' ? 'Puzzle Rakit Jam' : 'Tebak Waktu'}</span>
          </div>

          <h3 className="text-xl font-extrabold text-center text-slate-800 leading-tight">
            {q?.questionText}
          </h3>

          {/* Komponen Visual Jam */}
          <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-50 flex justify-center w-full relative">
            <AnalogClock 
              size={240} 
              interactive={!answered && q?.type === 'drag'} 
              hours={q?.type === 'drag' ? dragHours : q?.targetHours} 
              minutes={q?.type === 'drag' ? dragMinutes : q?.targetMinutes} 
              onTimeChange={handleDragTimeChange}
              hideSeconds 
            />
          </div>

          {/* AREA INTERAKSI JAWABAN */}
          <div className="w-full space-y-4">
            
            {/* TIPE 1: PILIHAN GANDA */}
            {q?.type === 'multiple-choice' && (
              <div className="grid grid-cols-2 gap-3 w-full">
                {q.options?.map(opt => (
                  <button 
                    key={opt} 
                    disabled={answered} 
                    onClick={() => handleMCAnswer(opt)}
                    className={`py-5 rounded-2xl text-lg font-black transition-all border-2 ${
                      answered && opt === q.correctAnswer ? 'bg-green-500 border-green-500 text-white shadow-lg' : 
                      answered && opt === selectedAnswer ? 'bg-red-500 border-red-500 text-white' : 
                      'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* TIPE 2: BENAR ATAU SALAH */}
            {q?.type === 'true-false' && (
              <div className="flex gap-4 w-full">
                <button 
                  disabled={answered}
                  onClick={() => handleTFAnswer(true)}
                  className={`flex-1 py-5 rounded-2xl font-black border-2 transition-all text-lg ${
                    answered && q.isCorrectAnswer === true ? 'bg-green-500 border-green-500 text-white shadow-lg' :
                    answered && selectedAnswer === 'true' && q.isCorrectAnswer === false ? 'bg-red-500 border-red-500 text-white' :
                    'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <Check className="inline-block mr-2" /> BENAR
                </button>
                <button 
                  disabled={answered}
                  onClick={() => handleTFAnswer(false)}
                  className={`flex-1 py-5 rounded-2xl font-black border-2 transition-all text-lg ${
                    answered && q.isCorrectAnswer === false ? 'bg-green-500 border-green-500 text-white shadow-lg' :
                    answered && selectedAnswer === 'false' && q.isCorrectAnswer === true ? 'bg-red-500 border-red-500 text-white' :
                    'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <X className="inline-block mr-2" /> SALAH
                </button>
              </div>
            )}

            {/* TIPE 3: PUZZLE RAKIT JAM (DRAG) */}
            {q?.type === 'drag' && (
              <div className="w-full">
                {!answered ? (
                  <button 
                    onClick={handleDragSubmit} 
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-lg uppercase tracking-widest active:scale-95 transition-all"
                  >
                    KUNCI JAWABAN 🔒
                  </button>
                ) : (
                  <div className={`w-full py-5 rounded-2xl text-center font-black text-lg ${selectedAnswer === 'correct' ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-red-100 text-red-700 border-2 border-red-200'}`}>
                    {selectedAnswer === 'correct' ? '🎉 LUAR BIASA! KAMU BENAR' : `❌ KURANG TEPAT! JAWABAN: ${formatTime(q.targetHours, q.targetMinutes)}`}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Tombol Lanjut ke Soal Berikutnya */}
      {answered && (
        <motion.button 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          onClick={nextQuestion} 
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl uppercase tracking-widest text-sm mt-4 active:scale-95 transition-all"
        >
          {currentIdx + 1 < questions.length ? 'SOAL BERIKUTNYA' : 'LIHAT HASIL AKHIR'} <ArrowRight size={18} />
        </motion.button>
      )}
    </div>
  );
};

export default QuizSystem;

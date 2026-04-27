import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrectSound, playWrongSound } from '@/lib/soundUtils';

// BANK SOAL LENGKAP (15 Soal per Mapel)
const allQuizData: Record<string, { q: string; o: string[]; a: number }[]> = {
  ipa: [
    { q: "Alat pernapasan pada ikan adalah...", o: ["Paru-paru", "Insang", "Trakea", "Kulit"], a: 1 },
    { q: "Planet yang dijuluki Planet Merah adalah...", o: ["Venus", "Mars", "Jupiter", "Saturnus"], a: 1 },
    { q: "Sumber energi utama bagi bumi adalah...", o: ["Bulan", "Bintang", "Matahari", "Listrik"], a: 2 },
    { q: "Hewan pemakan rumput disebut...", o: ["Karnivora", "Herbivora", "Omnivora", "Insektivora"], a: 1 },
    { q: "Benda padat yang berubah menjadi gas disebut...", o: ["Mencair", "Menguap", "Menyublim", "Membeku"], a: 2 },
    { q: "Fotosintesis pada tumbuhan terjadi di...", o: ["Akar", "Batang", "Daun", "Bunga"], a: 2 },
    { q: "Gaya yang menarik benda ke pusat bumi adalah...", o: ["Magnet", "Pegas", "Gravitasi", "Gesek"], a: 2 },
    { q: "Bagian terkecil dari makhluk hidup adalah...", o: ["Jaringan", "Organ", "Sel", "Sistem"], a: 2 },
    { q: "Urutan planet ke-3 dari matahari adalah...", o: ["Merkurius", "Venus", "Bumi", "Mars"], a: 2 },
    { q: "Alat pengukur suhu disebut...", o: ["Barometer", "Termometer", "Anemometer", "Mikroskop"], a: 1 },
    { q: "Zat hijau daun disebut...", o: ["Kloroplas", "Klorofil", "Stomata", "Sitoplasma"], a: 1 },
    { q: "Air mendidih pada suhu...", o: ["50°C", "80°C", "100°C", "120°C"], a: 2 },
    { q: "Hewan bertulang belakang disebut...", o: ["Invertebrata", "Aves", "Mamalia", "Vertebrata"], a: 3 },
    { q: "Perubahan wujud cair ke padat disebut...", o: ["Mengkristal", "Membeku", "Menyublim", "Menguap"], a: 1 },
    { q: "Pusat tata surya kita adalah...", o: ["Bumi", "Bulan", "Matahari", "Galaksi"], a: 2 }
  ],
  mtk: [
    { q: "15 + 10 = ...", o: ["20", "25", "30", "35"], a: 1 },
    { q: "5 x 6 = ...", o: ["25", "30", "35", "40"], a: 1 },
    { q: "100 - 45 = ...", o: ["45", "55", "65", "75"], a: 1 },
    { q: "81 : 9 = ...", o: ["7", "8", "9", "10"], a: 2 },
    { q: "12 x 3 = ...", o: ["32", "34", "36", "38"], a: 2 },
    { q: "25 x 4 = ...", o: ["80", "90", "100", "110"], a: 2 },
    { q: "Akar kuadrat dari 64 adalah...", o: ["6", "7", "8", "9"], a: 2 },
    { q: "50 : 2 = ...", o: ["15", "20", "25", "30"], a: 2 },
    { q: "1/2 + 1/2 = ...", o: ["1", "2", "1/4", "4"], a: 0 },
    { q: "Jumlah sudut pada segitiga adalah...", o: ["90°", "180°", "270°", "360°"], a: 1 },
    { q: "15 x 2 + 5 = ...", o: ["30", "35", "40", "45"], a: 1 },
    { q: "Bangun datar yang tidak punya sudut...", o: ["Persegi", "Segitiga", "Lingkaran", "Trapesium"], a: 2 },
    { q: "7 x 8 = ...", o: ["48", "54", "56", "62"], a: 2 },
    { q: "Bilangan genap setelah 12 adalah...", o: ["11", "13", "14", "15"], a: 2 },
    { q: "100 : 5 = ...", o: ["10", "15", "20", "25"], a: 2 }
  ],
  bindo: [
    { q: "Lawan kata 'Cepat' adalah...", o: ["Lari", "Lambat", "Tinggi", "Jauh"], a: 1 },
    { q: "Ibu kota negara Indonesia adalah...", o: ["Bandung", "Surabaya", "Jakarta", "Medan"], a: 2 },
    { q: "Sinonim dari kata 'Bahagia' adalah...", o: ["Sedih", "Marah", "Senang", "Kecewa"], a: 2 },
    { q: "Kata dasar dari 'Memakan' adalah...", o: ["Makan", "Makanan", "Dimakan", "Termakan"], a: 0 },
    { q: "Penulisan kata baku yang benar adalah...", o: ["Ijin", "Izin", "Isin", "Idzin"], a: 1 },
    { q: "Antonim dari kata 'Besar' adalah...", o: ["Luas", "Tinggi", "Kecil", "Lebar"], a: 2 },
    { q: "Tanda baca untuk mengakhiri kalimat tanya adalah...", o: [".", ",", "!", "?"], a: 3 },
    { q: "Subjek pada kalimat 'Budi makan nasi' adalah...", o: ["Budi", "Makan", "Nasi", "Budi makan"], a: 0 },
    { q: "Lawan kata 'Gelap' adalah...", o: ["Hitam", "Kelam", "Terang", "Suram"], a: 2 },
    { q: "Sinonim dari kata 'Pintar' adalah...", o: ["Cerdas", "Rajin", "Giat", "Malas"], a: 0 },
    { q: "Kata 'Apotek' termasuk kata...", o: ["Tidak baku", "Baku", "Asing", "Daerah"], a: 1 },
    { q: "Awalan 'me-' pada kata 'sapu' menjadi...", o: ["Mesapu", "Mensapu", "Menyapu", "Mepu"], a: 2 },
    { q: "Sinonim 'Bunga' adalah...", o: ["Dahan", "Akar", "Kembang", "Ranting"], a: 2 },
    { q: "Lawan kata 'Haus' adalah...", o: ["Lapar", "Kenyang", "Segar", "Dingin"], a: 2 },
    { q: "Kalimat yang berisi perintah disebut kalimat...", o: ["Tanya", "Berita", "Imperatif", "Negatif"], a: 2 }
  ],
  ips: [
    { q: "Dasar negara Indonesia adalah...", o: ["UUD 45", "Pancasila", "Proklamasi", "Burung Garuda"], a: 1 },
    { q: "Benua terkecil di dunia adalah...", o: ["Asia", "Eropa", "Australia", "Afrika"], a: 2 },
    { q: "Mata uang negara Indonesia adalah...", o: ["Dollar", "Ringgit", "Rupiah", "Yen"], a: 2 },
    { q: "Candi Borobudur terletak di provinsi...", o: ["Jawa Barat", "Jawa Tengah", "Jawa Timur", "Yogyakarta"], a: 1 },
    { q: "Hari Kemerdekaan Indonesia diperingati setiap tanggal...", o: ["1 Juni", "17 Agustus", "28 Oktober", "10 November"], a: 1 },
    { q: "Provinsi yang beribu kota di Bandung adalah...", o: ["Jawa Tengah", "Banten", "Jawa Barat", "DKI Jakarta"], a: 2 },
    { q: "Alat penunjuk arah mata angin disebut...", o: ["Termometer", "Kompas", "Barometer", "Speedometer"], a: 1 },
    { q: "Garis khayal yang membagi bumi utara dan selatan adalah...", o: ["Bujur", "Lintang", "Khatulistiwa", "Meridian"], a: 2 },
    { q: "Samudra terluas di dunia adalah...", o: ["Hindia", "Atlantik", "Pasifik", "Arktik"], a: 2 },
    { q: "Suku Asmat berasal dari daerah...", o: ["Aceh", "Papua", "Kalimantan", "Sulawesi"], a: 1 },
    { q: "Rumah adat Minangkabau disebut Rumah...", o: ["Joglo", "Gadang", "Honai", "Limas"], a: 1 },
    { q: "Lagu kebangsaan Indonesia adalah...", o: ["Padamu Negeri", "Indonesia Raya", "Garuda Pancasila", "Halo Bandung"], a: 1 },
    { q: "Pertukaran barang tanpa menggunakan uang disebut...", o: ["Jual Beli", "Sewa", "Barter", "Ekspor"], a: 2 },
    { q: "Pahlawan Proklamator Indonesia adalah...", o: ["Suharto", "Soekarno-Hatta", "Diponegoro", "Kartini"], a: 1 },
    { q: "Benua terluas di dunia adalah...", o: ["Amerika", "Afrika", "Asia", "Eropa"], a: 2 }
  ]
};

const LearningHub: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const subjects = [
    { id: 'ipa', name: 'IPA', emoji: '🔬', color: 'from-green-400 to-emerald-600', desc: 'Ilmu Pengetahuan Alam' },
    { id: 'mtk', name: 'MTK', emoji: '🔢', color: 'from-blue-400 to-indigo-600', desc: 'Matematika' },
    { id: 'bindo', name: 'B. INDO', emoji: '📖', color: 'from-orange-400 to-red-500', desc: 'Bahasa Indonesia' },
    { id: 'ips', name: 'IPS', emoji: '🌍', color: 'from-purple-400 to-pink-500', desc: 'Ilmu Pengetahuan Sosial' },
  ];

  const handleNext = () => {
    if (activeSubject && selectedIdx !== null) {
      const isCorrect = selectedIdx === allQuizData[activeSubject][currentStep].a;
      let finalScore = score;
      
      if (isCorrect) {
        finalScore += 1;
        setScore(finalScore);
        playCorrectSound();
      } else {
        playWrongSound();
      }

      if (currentStep < allQuizData[activeSubject].length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedIdx(null);
      } else {
        // SIMPAN KE HISTORY
        const percentage = Math.round((finalScore / allQuizData[activeSubject].length) * 100);
        const newResult = {
          date: new Date().toISOString(),
          correct: finalScore,
          wrong: allQuizData[activeSubject].length - finalScore,
          score: percentage,
          subject: activeSubject.toUpperCase()
        };
        const existing = JSON.parse(localStorage.getItem('quiz-results') || '[]');
        localStorage.setItem('quiz-results', JSON.stringify([...existing, newResult]));
        
        setIsFinished(true);
      }
    }
  };

  const reset = () => {
    setActiveSubject(null);
    setCurrentStep(0);
    setScore(0);
    setSelectedIdx(null);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="text-center space-y-6 py-10 bg-white rounded-3xl shadow-xl p-8 border-4 border-primary/20">
        <span className="text-7xl">🏁</span>
        <h2 className="text-3xl font-black text-primary">KUIS SELESAI!</h2>
        <div className="p-4 bg-slate-50 rounded-2xl">
           <p className="text-2xl font-black text-slate-700">{score} / {activeSubject ? allQuizData[activeSubject].length : 0}</p>
           <p className="text-sm font-bold text-muted-foreground uppercase">Skor Kamu</p>
        </div>
        <button onClick={reset} className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg">KEMBALI KE MENU</button>
      </div>
    );
  }

  if (activeSubject) {
    const questions = allQuizData[activeSubject];
    const currentQ = questions[currentStep];

    return (
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="flex justify-between items-center px-2">
          <button onClick={reset} className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">← BATALKAN</button>
          <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">{activeSubject} {currentStep + 1}/{questions.length}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-slate-100 min-h-[300px] flex flex-col justify-center">
          <h3 className="text-xl font-bold text-slate-800 mb-8 text-center">{currentQ.q}</h3>
          <div className="grid gap-3">
            {currentQ.o.map((opt, idx) => (
              <button key={idx} onClick={() => setSelectedIdx(idx)}
                className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${
                  selectedIdx === idx ? 'border-primary bg-primary/10 text-primary' : 'border-slate-100 hover:border-slate-300 bg-slate-50 text-slate-600'
                }`}>
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleNext} disabled={selectedIdx === null}
          className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all ${
            selectedIdx !== null ? 'bg-primary text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}>
          {currentStep === questions.length - 1 ? 'SUBMIT HASIL' : 'SELANJUTNYA'}
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-primary uppercase italic tracking-tighter">📚 Learning Hub</h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pilih mata pelajaran untuk mulai kuis</p>
      </div>
      <div className="grid grid-cols-2 gap-4 pb-10">
        {subjects.map((s, i) => (
          <motion.button key={s.id} onClick={() => setActiveSubject(s.id)}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-br ${s.color} rounded-3xl p-6 text-center shadow-lg border-b-4 border-black/20 group relative overflow-hidden`}>
            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">{s.emoji}</span>
            <p className="text-lg font-black text-white uppercase">{s.name}</p>
            <p className="text-[10px] text-white/80 font-bold leading-tight mt-1">{s.desc}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default LearningHub;

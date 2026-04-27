import { generateRandomTime, formatTime } from './clockUtils';

// Tipe data untuk jenis pertanyaan kuis
export type QuestionType = 'multiple-choice' | 'drag' | 'true-false';

// Struktur data untuk satu soal kuis
export interface QuizQuestion {
  id: number;
  type: QuestionType;
  targetHours: number;
  targetMinutes: number;
  displayTime?: string;      // Digunakan untuk tipe true-false
  isCorrectAnswer?: boolean; // Digunakan untuk tipe true-false
  options?: string[];        // Digunakan untuk tipe multiple-choice
  correctAnswer?: string;    // Digunakan untuk tipe multiple-choice
  questionText: string;
}

// Struktur data untuk menyimpan hasil kuis di riwayat (Progress)
export interface QuizResult {
  date: string;
  correct: number;
  wrong: number;
  total: number;
  score: number;
  playerName?: string;
}

/**
 * Fungsi untuk menghasilkan daftar soal kuis secara acak.
 * Menghasilkan campuran soal Pilihan Ganda, Tarik Jarum (Puzzle), dan Benar/Salah.
 * @param count Jumlah soal yang ingin dihasilkan (sesuai pilihan user)
 */
export function generateQuizQuestions(count: number = 10): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const types: QuestionType[] = ['multiple-choice', 'drag', 'true-false'];

  for (let i = 0; i < count; i++) {
    // Generate waktu acak sebagai jawaban yang benar
    const { hours, minutes } = generateRandomTime();
    
    // Rotasi tipe soal agar bervariasi secara adil
    const type = types[i % types.length];

    if (type === 'multiple-choice') {
      const correctAnswer = formatTime(hours, minutes);
      const options = [correctAnswer];
      
      // Tambahkan 3 pilihan jawaban salah yang acak
      while (options.length < 4) {
        const wrongTime = generateRandomTime();
        const wrongAnswer = formatTime(wrongTime.hours, wrongTime.minutes);
        if (!options.includes(wrongAnswer)) {
          options.push(wrongAnswer);
        }
      }

      questions.push({
        id: i + 1,
        type: 'multiple-choice',
        targetHours: hours,
        targetMinutes: minutes,
        options: options.sort(() => Math.random() - 0.5), // Acak posisi tombol
        correctAnswer: correctAnswer,
        questionText: "Pukul berapa yang ditunjukkan oleh jam di bawah ini?",
      });

    } else if (type === 'drag') {
      // TIPE PUZZLE: User harus merakit jarum jam
      questions.push({
        id: i + 1,
        type: 'drag',
        targetHours: hours,
        targetMinutes: minutes,
        questionText: `Bantu atur jarum jam agar menunjukkan pukul ${formatTime(hours, minutes)}!`,
      });

    } else if (type === 'true-false') {
      // TIPE BENAR/SALAH: Cek kecocokan visual jam dengan teks
      const isCorrect = Math.random() > 0.5;
      let displayTimeStr = formatTime(hours, minutes);

      if (!isCorrect) {
        // Jika diset sebagai jawaban salah, buat waktu palsu
        let wrongTime = generateRandomTime();
        // Pastikan waktu palsu tidak sama dengan waktu asli
        while (wrongTime.hours === hours && wrongTime.minutes === minutes) {
          wrongTime = generateRandomTime();
        }
        displayTimeStr = formatTime(wrongTime.hours, wrongTime.minutes);
      }

      questions.push({
        id: i + 1,
        type: 'true-false',
        targetHours: hours,
        targetMinutes: minutes,
        displayTime: displayTimeStr,
        isCorrectAnswer: isCorrect,
        questionText: `Apakah benar jam di bawah ini menunjukkan pukul ${displayTimeStr}?`,
      });
    }
  }

  return questions;
}

/**
 * Fungsi untuk menyimpan hasil kuis ke Local Storage
 */
export function saveQuizResult(result: QuizResult): void {
  const existingResults = getQuizResults();
  existingResults.push(result);
  localStorage.setItem('quizHistory', JSON.stringify(existingResults));
}

/**
 * Fungsi untuk mengambil semua riwayat kuis
 */
export function getQuizResults(): QuizResult[] {
  const data = localStorage.getItem('quizHistory');
  if (data) {
    try {
      return JSON.parse(data) as QuizResult[];
    } catch (error) {
      console.error("Gagal membaca riwayat kuis:", error);
      return [];
    }
  }
  return [];
}

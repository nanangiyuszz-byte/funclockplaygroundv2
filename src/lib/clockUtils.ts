/**
 * Menghitung sudut (derajat) untuk jarum jam, menit, dan detik berdasarkan waktu.
 */
export function getAngleFromTime(hours: number, minutes: number, seconds: number = 0) {
  // Jam: 30 derajat per jam + tambahan dari menit agar pergerakan halus
  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  // Menit: 6 derajat per menit
  const minuteAngle = (minutes + seconds / 60) * 6;
  // Detik: 6 derajat per detik
  const secondAngle = seconds * 6;
  
  return { hourAngle, minuteAngle, secondAngle };
}

/**
 * Mengonversi sudut jarum kembali menjadi angka jam dan menit.
 * Digunakan saat user menggeser jarum secara manual.
 */
export function getTimeFromAngles(hourAngle: number, minuteAngle: number) {
  let hours = Math.round(hourAngle / 30) % 12;
  if (hours === 0) hours = 12;
  
  let minutes = Math.round(minuteAngle / 6) % 60;
  
  return { hours, minutes };
}

/**
 * Menghitung sudut derajat berdasarkan posisi koordinat kursor (X, Y) terhadap titik pusat jam.
 */
export function getAngleFromPoint(cx: number, cy: number, x: number, y: number) {
  const dx = x - cx;
  const dy = y - cy;
  
  // Math.atan2 memberikan hasil dalam radian, lalu diubah ke derajat
  let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
  
  // Pastikan hasil selalu positif (0-360 derajat)
  if (angle < 0) angle += 360;
  
  return angle;
}

/**
 * Mengubah angka jam dan menit menjadi format string digital (HH:MM).
 */
export function formatTime(h: number, m: number, s?: number) {
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  
  if (s !== undefined) {
    const ss = String(s).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  
  return `${hh}:${mm}`;
}

/**
 * Menghasilkan waktu acak untuk fitur kuis atau latihan.
 * Menit dibulatkan per 5 menit agar lebih mudah dipelajari anak-anak.
 */
export function generateRandomTime() {
  const hours = Math.floor(Math.random() * 12) + 1;
  const minutes = Math.floor(Math.random() * 12) * 5;
  
  return { hours, minutes };
}

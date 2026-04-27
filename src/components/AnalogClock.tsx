import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAngleFromTime, getAngleFromPoint, getTimeFromAngles } from '@/lib/clockUtils';

interface AnalogClockProps {
  size?: number;
  interactive?: boolean;
  hours?: number;
  minutes?: number;
  onTimeChange?: (hours: number, minutes: number) => void;
  showLabels?: boolean;
}

const AnalogClock: React.FC<AnalogClockProps> = ({
  size = 300,
  interactive = true, // Set default ke true agar selalu bisa diatur
  hours: propHours = 10,
  minutes: propMinutes = 10,
  onTimeChange,
  showLabels = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<'hour' | 'minute' | null>(null);
  
  // Gunakan state lokal agar jarum bisa bergerak bebas saat ditarik
  const [hourAngle, setHourAngle] = useState(0);
  const [minuteAngle, setMinuteAngle] = useState(0);

  // Sync sudut saat jam/menit dari props berubah (misal dari tombol acak)
  useEffect(() => {
    const angles = getAngleFromTime(propHours, propMinutes, 0);
    setHourAngle(angles.hourAngle);
    setMinuteAngle(angles.minuteAngle);
  }, [propHours, propMinutes]);

  const getPointerPos = useCallback((e: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handlePointerDown = (hand: 'hour' | 'minute') => (e: React.PointerEvent) => {
    if (!interactive) return;
    e.preventDefault();
    setDragging(hand);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !interactive) return;
    
    const { x, y } = getPointerPos(e);
    const center = totalSize / 2;
    const angle = getAngleFromPoint(center, center, x, y);
    
    if (dragging === 'hour') {
      // Snapping ke setiap jam (30 derajat)
      const snappedAngle = Math.round(angle / 30) * 30;
      setHourAngle(snappedAngle);
      const { hours, minutes } = getTimeFromAngles(snappedAngle, minuteAngle);
      onTimeChange?.(hours, minutes);
    } else {
      // Snapping ke setiap menit (6 derajat)
      const snappedAngle = Math.round(angle / 6) * 6;
      setMinuteAngle(snappedAngle);
      const { hours, minutes } = getTimeFromAngles(hourAngle, snappedAngle);
      onTimeChange?.(hours, minutes);
    }
  };

  const handlePointerUp = () => setDragging(null);

  const padding = 60; 
  const totalSize = size + padding * 2;
  const cx = totalSize / 2;
  const cy = totalSize / 2;
  const r = size / 2 - 10; 

  const hourNumbers = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = (num * 30 - 90) * (Math.PI / 180);
    const nr = r - 32; 
    return { num, x: cx + nr * Math.cos(angle), y: cy + nr * Math.sin(angle) };
  });

  const minuteNumbers = Array.from({ length: 12 }, (_, i) => {
    const num = i * 5;
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const nr = r + 38; 
    return { num, x: cx + nr * Math.cos(angle), y: cy + nr * Math.sin(angle) };
  });

  const minuteDots = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const dr = r - 12;
    const isHour = i % 5 === 0;
    return { x: cx + dr * Math.cos(angle), y: cy + dr * Math.sin(angle), isHour };
  });

  const getHandPos = (angle: number, length: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + length * Math.cos(rad),
      y: cy + length * Math.sin(rad)
    };
  };

  const hEnd = getHandPos(hourAngle, r * 0.5);
  const mEnd = getHandPos(minuteAngle, r * 0.78);

  return (
    <svg
      ref={svgRef}
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="select-none touch-none overflow-visible block mx-auto cursor-crosshair"
      style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.12))' }}
    >
      <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" stroke="#FFD700" strokeWidth={10} />
      
      {minuteDots.map((dot, index) => (
        <circle 
          key={`dot-${index}`} 
          cx={dot.x} cy={dot.y} 
          r={dot.isHour ? 4 : 1.5} 
          fill={dot.isHour ? '#22C55E' : '#CBD5E1'} 
        />
      ))}

      {showLabels && minuteNumbers.map((item) => (
        <text 
          key={`min-${item.num}`} 
          x={item.x} y={item.y} 
          textAnchor="middle" dominantBaseline="central" 
          fill="#64748B" fontSize={size * 0.055} fontWeight="700"
        >
          {item.num}
        </text>
      ))}

      {showLabels && hourNumbers.map((item) => (
        <text 
          key={`hour-${item.num}`} 
          x={item.x} y={item.y} 
          textAnchor="middle" dominantBaseline="central" 
          fill="#8B5CF6" fontSize={size * 0.085} fontWeight="900"
          style={{ fontFamily: '"Fredoka One", sans-serif' }}
        >
          {item.num}
        </text>
      ))}

      {/* Jarum Jam */}
      <line 
        x1={cx} y1={cy} x2={hEnd.x} y2={hEnd.y} 
        stroke="#EF4444" strokeWidth={12} strokeLinecap="round" 
        onPointerDown={handlePointerDown('hour')} 
        className="cursor-grab active:cursor-grabbing transition-all hover:stroke-red-600"
      />

      {/* Jarum Menit */}
      <line 
        x1={cx} y1={cy} x2={mEnd.x} y2={mEnd.y} 
        stroke="#3B82F6" strokeWidth={8} strokeLinecap="round" 
        onPointerDown={handlePointerDown('minute')} 
        className="cursor-grab active:cursor-grabbing transition-all hover:stroke-blue-600"
      />
      
      <circle cx={cx} cy={cy} r={8} fill="#1E293B" stroke="#FFFFFF" strokeWidth={3} />
    </svg>
  );
};

export default AnalogClock;

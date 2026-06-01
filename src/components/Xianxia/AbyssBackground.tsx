import { useMemo } from 'react';

interface Star {
  id: number; left: string; top: string; dur: number; delay: number; opacity: number;
}

export function AbyssBackground() {
  const stars = useMemo<Star[]>(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
      dur: 2 + Math.random() * 5, delay: Math.random() * 4,
      opacity: 0.12 + Math.random() * 0.45,
    })), []
  );

  const ashParticles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, x: `${Math.random() * 100}%`,
      dur: 10 + Math.random() * 20, delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 60,
    })), []
  );

  return (
    <div className="bg-abyss-layer" aria-hidden="true">
      <div className="bg-abyss-layer-1" />
      <div className="bg-abyss-layer-2" />
      <div className="bg-abyss-layer-3" />
      <div className="bg-scale-overlay" />
      {stars.map(s => (
        <span key={`star-${s.id}`} className="bg-star-premium" style={{
          left: s.left, top: s.top, animationDuration: `${s.dur}s`,
          animationDelay: `${s.delay}s`, opacity: s.opacity,
        }} />
      ))}
      {ashParticles.map(a => (
        <span key={`ash-${a.id}`} className="bg-ash" style={{
          left: a.x, animationDuration: `${a.dur}s`,
          animationDelay: `${a.delay}s`,
          ['--ash-drift' as string]: `${a.drift}px`,
        }} />
      ))}
    </div>
  );
}

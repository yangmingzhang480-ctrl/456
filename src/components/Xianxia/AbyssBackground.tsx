import { useMemo } from 'react';

export function AbyssBackground() {
  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 70}%`,
      dur: 2 + Math.random() * 5, delay: Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.35,
    })), []
  );

  const specks = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i, x: `${Math.random() * 100}%`, dur: 10 + Math.random() * 18,
      delay: Math.random() * 12, drift: (Math.random() - 0.5) * 50,
    })), []
  );

  return (
    <div className="bg-scroll-container" aria-hidden="true">
      {/* Deep abyss layers */}
      <div className="bg-abyss-layer-1" />
      <div className="bg-abyss-layer-2" />
      <div className="bg-abyss-layer-3" />
      <div className="bg-scale-overlay" />

      {/* Mountain silhouettes — ancient scroll style */}
      <div className="bg-mountains" />

      {/* Mist / cloud drifting */}
      <div className="bg-mist-layer" />

      {/* Ancient scroll paper texture */}
      <div className="bg-scroll-texture" />

      {/* Floating gold dust specks */}
      <div className="bg-gold-dust">
        {specks.map(s => (
          <span key={`speck-${s.id}`} className="bg-gold-speck" style={{
            left: s.x, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`,
            ['--speck-dur' as string]: `${s.dur}s`, ['--speck-delay' as string]: `${s.delay}s`,
            ['--speck-drift' as string]: `${s.drift}px`,
          }} />
        ))}
      </div>

      {/* Stars */}
      {stars.map(s => (
        <span key={`star-${s.id}`} className="bg-star-premium" style={{
          left: s.left, top: s.top, animationDuration: `${s.dur}s`,
          animationDelay: `${s.delay}s`, opacity: s.opacity,
        }} />
      ))}

      {/* Silk vignette frame */}
      <div className="bg-silk-vignette" />
    </div>
  );
}

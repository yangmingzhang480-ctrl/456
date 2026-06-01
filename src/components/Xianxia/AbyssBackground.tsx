import { useMemo, useEffect, useState } from 'react';

/**
 * Background image configuration.
 * Place images in: public/assets/bg/
 * Supported formats: jpg, png, webp
 *
 * The image will be used as the base background layer,
 * with all Xianxia atmospheric overlays rendered on top.
 */
const BG_IMAGES = [
  '/assets/bg/bg-main.jpg',
  '/assets/bg/bg-main.png',
  '/assets/bg/bg-main.webp',
];

export function AbyssBackground() {
  const [bgImage, setBgImage] = useState<string | null>(null);

  // Try to load background image, fallback gracefully
  useEffect(() => {
    let cancelled = false;
    async function tryLoad() {
      for (const src of BG_IMAGES) {
        try {
          await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = src;
          });
          if (!cancelled) setBgImage(src);
          return;
        } catch { /* continue to next */ }
      }
    }
    tryLoad();
    return () => { cancelled = true; };
  }, []);

  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 65}%`,
      dur: 2 + Math.random() * 5, delay: Math.random() * 4,
      opacity: 0.08 + Math.random() * 0.3,
    })), []
  );

  const specks = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i, x: `${Math.random() * 100}%`, dur: 10 + Math.random() * 18,
      delay: Math.random() * 12, drift: (Math.random() - 0.5) * 50,
    })), []
  );

  return (
    <div className="bg-scroll-container" aria-hidden="true">
      {/* Layer 0: Background Image (when available) */}
      {bgImage && (
        <div className="bg-image-layer" style={{ backgroundImage: `url(${bgImage})` }} />
      )}
      {/* Image blend overlay — only shown when image is active */}
      {bgImage && <div className="bg-image-overlay" />}

      {/* Layer 0-alt: Color washes (fallback when no image) */}
      {!bgImage && <div className="bg-abyss-layer-1-fallback" />}
      {!bgImage && <div className="bg-abyss-layer-2" />}
      {!bgImage && <div className="bg-abyss-layer-3" />}
      {!bgImage && <div className="bg-scale-overlay" />}

      {/* Layer 2: Mountain silhouettes */}
      <div className="bg-mountains" />

      {/* Layer 3: Mist / clouds */}
      <div className="bg-mist-layer" />

      {/* Layer 4: Sky darken */}
      <div className="bg-sky-darken" />

      {/* Layer 5: Scroll texture */}
      <div className="bg-scroll-texture" />

      {/* Layer 6: Gold dust particles */}
      <div className="bg-gold-dust">
        {specks.map(s => (
          <span key={`speck-${s.id}`} className="bg-gold-speck" style={{
            left: s.x, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`,
            ['--speck-dur' as string]: `${s.dur}s`, ['--speck-delay' as string]: `${s.delay}s`,
            ['--speck-drift' as string]: `${s.drift}px`,
          }} />
        ))}
      </div>

      {/* Layer 7: Vignette */}
      <div className="bg-silk-vignette" />

      {/* Layer 8: Crimson horizon glow */}
      <div className="bg-crimson-horizon" />

      {/* Stars (visible in sky area) */}
      {stars.map(s => (
        <span key={`star-${s.id}`} className="bg-star-premium" style={{
          left: s.left, top: s.top, animationDuration: `${s.dur}s`,
          animationDelay: `${s.delay}s`, opacity: s.opacity,
        }} />
      ))}
    </div>
  );
}

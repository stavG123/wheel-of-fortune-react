import React, { useEffect, useRef, useState } from 'react';
import './ad-square.css';

// AdSquare
// Props:
// - images: [{ src, alt }] array or strings (src). If empty, nothing shown.
// - intervalMs: how often to rotate in milliseconds (default 10 minutes)
// - className: additional class names
export default function AdSquare({ images = [], intervalMs = 10 * 1000, className = '' }) {
  const normalized = images.map(img => (typeof img === 'string' ? { src: img, alt: '' } : img));
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!normalized || normalized.length <= 1) return undefined;

    const tick = () => {
      if (!pausedRef.current) {
        setIndex(i => (i + 1) % normalized.length);
      }
    };

    timerRef.current = setInterval(tick, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [normalized.length, intervalMs]);

  if (!normalized || normalized.length === 0) return null;

  const { src, alt } = normalized[index];

  return (
    <div
      className={`ad-square ${className}`}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      role="img"
      aria-label={alt || `Ad ${index + 1} of ${normalized.length}`}>
      <img src={src} alt={alt} />
    </div>
  );
}

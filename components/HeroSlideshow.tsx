'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

// Cross-fades between the hero photos, as on the live site.
export default function HeroSlideshow({ images, interval = 6000 }: { images: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => window.clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0" aria-hidden>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          preload={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-[1500ms] ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav, site, socials } from '@/content/site';
import { Close, Phone } from './Icons';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // The contact page has a black background, so the menu button switches to light lines.
  const onDark = pathname === '/contact';

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-5 py-4 lg:px-9 lg:py-6">
        <Link href="/" aria-label={`${site.name} home`} className="block">
          <Image src="/logo.svg" alt={site.name} width={647} height={288} priority className="h-11 w-auto lg:h-[54px]" />
        </Link>

        <div className="flex items-center gap-4 lg:gap-10">
          <Link href="/contact" className="btn-pill px-4 py-1.5 text-[15px] lg:px-8 lg:py-2 lg:text-[16px]">
            Let&apos;s Talk <Phone className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className={`grid h-12 w-12 place-items-center border lg:h-[60px] lg:w-[60px] ${
              onDark ? 'border-white/80 text-white' : 'border-ink/70 text-ink'
            }`}
          >
            <span className="block w-7 space-y-[9px] lg:w-8">
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-ink text-white">
          <div className="flex items-center justify-between px-5 py-4 lg:px-9 lg:py-6">
            <Link href="/" aria-label={`${site.name} home`}>
              <Image src="/logo.svg" alt={site.name} width={647} height={288} className="h-11 w-auto brightness-0 invert lg:h-[54px]" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-12 w-12 place-items-center border border-white/70 lg:h-[60px] lg:w-[60px]"
            >
              <Close />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center px-8 lg:px-24">
            <ul className="space-y-3 lg:space-y-4">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-[26px] uppercase tracking-wide text-paper transition-colors hover:text-gold lg:text-[44px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-2 border-t border-white/15 px-8 py-6 text-sm text-paper/80 lg:flex-row lg:justify-between lg:px-24">
            <p>
              <a href={site.phoneHref} className="hover:text-white">{site.phone}</a>
              {'  ·  '}
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </p>
            <p className="space-x-4">
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {s.label}
                </a>
              ))}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

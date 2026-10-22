'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { modconOneNav, site } from '@/content/site';
import { Close } from './Icons';

// Header for the Modcon One landing page: in-page links instead of the hamburger menu.
export default function ModconOneHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between gap-6 px-4 py-3 lg:px-5">
        <Link href="/" aria-label={`${site.name} home`}>
          <Image src="/logo.svg" alt={site.name} width={647} height={288} priority className="h-12 w-auto lg:h-[72px]" />
        </Link>

        <nav aria-label="Modcon One sections" className="hidden lg:block">
          <ul className="flex gap-7 font-helvetica text-[15px] text-black">
            {modconOneNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="border-b border-transparent pb-0.5 hover:border-black">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#visit" className="rounded-md border border-black bg-white/60 px-4 py-2 font-helvetica text-[14px] text-black hover:bg-black hover:text-white lg:px-5 lg:text-[15px]">
            Book a Site Visit
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-md border border-black lg:hidden"
          >
            {open ? (
              <Close className="h-5 w-5" />
            ) : (
              <span className="block w-5 space-y-1.5">
                <span className="block h-px bg-black" />
                <span className="block h-px bg-black" />
                <span className="block h-px bg-black" />
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Modcon One sections" className="mx-4 rounded-md bg-white p-4 shadow-lg lg:hidden">
          <ul className="space-y-3 font-helvetica text-[17px] text-black">
            {modconOneNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="block py-1">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

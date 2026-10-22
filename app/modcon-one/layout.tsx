import Link from 'next/link';
import { Phone, WhatsApp } from '@/components/Icons';
import ModconOneHeader from '@/components/ModconOneHeader';
import { site, whatsappHref } from '@/content/site';

export default function ModconOneLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ModconOneHeader />
      <main id="main">{children}</main>
      <footer className="flex flex-col items-center justify-between gap-2 bg-black px-5 pb-[calc(84px+env(safe-area-inset-bottom))] pt-5 font-form text-[13px] text-paper/80 sm:flex-row md:pb-5 lg:px-9">
        <p>
          © {site.name} {new Date().getFullYear()}. All Rights Reserved.
        </p>
        <p className="flex items-center gap-4">
          <Link href="/" className="py-3 hover:text-white">
            modconbuilders.com
          </Link>
          <a href="https://brandmintstudios.in" target="_blank" rel="noopener noreferrer" className="py-3 hover:text-white">
            Built with Brand Mint
          </a>
        </p>
      </footer>

      {/* App-style action bar on phones: the three things a visitor here wants to do. */}
      <nav
        aria-label="Quick actions"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_auto_1fr] gap-2 border-t border-black/10 bg-white/90 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden"
      >
        <a href={site.phoneHref} aria-label={`Call ${site.phone}`} className="grid h-12 w-12 place-items-center rounded-xl border border-black/20 text-black active:scale-95">
          <Phone className="h-5 w-5" />
        </a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="grid h-12 w-12 place-items-center rounded-xl border border-black/20 text-black active:scale-95">
          <WhatsApp className="h-5 w-5" />
        </a>
        <a href="#visit" className="grid h-12 place-items-center rounded-xl bg-black font-helvetica text-[16px] text-white active:scale-[.98]">
          Book a Site Visit
        </a>
      </nav>
    </>
  );
}

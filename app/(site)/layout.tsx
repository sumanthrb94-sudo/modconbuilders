import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { WhatsApp } from '@/components/Icons';
import { whatsappHref } from '@/content/site';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] text-white shadow-lg transition-colors hover:bg-black"
      >
        <WhatsApp /> Get in Touch
      </a>
    </>
  );
}

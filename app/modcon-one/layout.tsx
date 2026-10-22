import Link from 'next/link';
import ModconOneHeader from '@/components/ModconOneHeader';
import { site } from '@/content/site';

export default function ModconOneLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ModconOneHeader />
      <main>{children}</main>
      <footer className="flex flex-col items-center justify-between gap-2 bg-black px-5 py-5 font-form text-[13px] text-paper/80 sm:flex-row lg:px-9">
        <p>
          © {site.name} {new Date().getFullYear()}. All Rights Reserved.
        </p>
        <Link href="/" className="hover:text-white">
          modconbuilders.com
        </Link>
      </footer>
    </>
  );
}

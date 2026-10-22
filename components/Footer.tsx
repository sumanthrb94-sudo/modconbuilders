import Image from 'next/image';
import Link from 'next/link';
import { footerLinks, mapsHref, site, socials } from '@/content/site';

export default function Footer() {
  return (
    <footer className="bg-white px-5 pt-14 lg:px-14 lg:pt-16">
      <div className="grid gap-10 pb-12 md:grid-cols-[1fr_auto_auto] md:gap-24 lg:gap-x-[160px]">
        <Link href="/" aria-label={`${site.name} home`} className="text-black">
          <Image src="/logo-wordmark.svg" alt={site.name} width={430} height={44} className="h-[50px] w-auto" />
        </Link>

        <div>
          <h2 className="mb-4 text-[18px] font-medium text-navy">Links</h2>
          <ul className="space-y-4 text-[16px] text-body">
            {footerLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-ink" {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-[18px] font-medium text-navy">Address</h2>
          <ul className="space-y-4 text-[16px] text-body">
            <li>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                {site.regions}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-ink">{site.email}</a>
            </li>
            <li>
              <a href={site.phoneHref} className="hover:text-ink">{site.phone}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#2F312B] py-6 text-[14px] font-medium text-[#2F312B] md:flex-row md:items-center md:justify-between">
        <p>
          {socials.map((s, i) => (
            <span key={s.href}>
              {i > 0 && <span className="mx-2">|</span>}
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {s.label}
              </a>
            </span>
          ))}
        </p>
        <p>
          © {site.name} {new Date().getFullYear()}. All Rights Reserved.{' '}
          <a href="https://brandmintstudios.in" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Built with Brand Mint
          </a>
        </p>
      </div>
    </footer>
  );
}

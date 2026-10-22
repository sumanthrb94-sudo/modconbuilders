import type { Metadata, Viewport } from 'next';
import Reveal from '@/components/Reveal';
import { site, socials } from '@/content/site';
import { instrumentSerif, interTight, satoshi, syncopate } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: '%s' },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: '/images/home-hero-1.jpg', width: 2400, height: 1500 }],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: site.name,
  url: site.url,
  logo: `${site.url}/logo.svg`,
  image: `${site.url}/images/home-hero-1.jpg`,
  description: site.description,
  telephone: site.phone,
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '8th floor, The District, Myscape Rd, Financial District, Nanakramguda',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500008',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 17.4663867, longitude: 78.3750654 },
  areaServed: ['Hyderabad', 'United Arab Emirates'],
  sameAs: socials.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${instrumentSerif.variable} ${syncopate.variable} ${interTight.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
        <Reveal />
      </body>
    </html>
  );
}

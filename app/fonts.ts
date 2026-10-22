import localFont from 'next/font/local';
import { Inter_Tight, Instrument_Serif, Syncopate } from 'next/font/google';

// Body and headings. Self-hosted: Satoshi isn't on Google Fonts (Fontshare, ITF Free Font License).
export const satoshi = localFont({
  src: [
    { path: './fonts/Satoshi-Variable.woff2', weight: '300 900', style: 'normal' },
    { path: './fonts/Satoshi-VariableItalic.woff2', weight: '300 900', style: 'italic' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

// Gold accent words ("Quality", "Your Future") and step numbers.
export const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: 'italic',
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

// Free stand-in for Engravers Gothic (the live site's hero font, a commercial licence).
export const syncopate = Syncopate({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-syncopate',
  display: 'swap',
});

// Form labels and inputs.
export const interTight = Inter_Tight({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

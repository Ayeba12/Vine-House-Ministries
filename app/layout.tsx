import type { Metadata } from 'next';
import { Anton, DM_Sans } from 'next/font/google';
import './globals.css';
import { CookieBanner } from '@/components/CookieBanner';

// Display face: Anton, single weight. Body face: DM Sans, variable.
// Exposed as --font-*-src and consumed through the theme tokens in globals.css.
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton-src',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans-src',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vine House Ministries — Contemporary Sanctuary & Digital Ministry',
  description: 'A contemporary sanctuary: warm, reverent, welcoming, spiritually grounded, and confidently modern.',
  openGraph: {
    title: 'Vine House Ministries',
    description: 'A contemporary sanctuary: warm, reverent, welcoming, spiritually grounded, and confidently modern.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vine House Ministries',
    description: 'A contemporary sanctuary: warm, reverent, welcoming, spiritually grounded, and confidently modern.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${dmSans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-[#F9F7F2] text-[#1E242B] selection:bg-[#2C3E2D] selection:text-[#F9F7F2]" suppressHydrationWarning>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}


import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#F9F7F2] text-[#1E242B] selection:bg-[#2C3E2D] selection:text-[#F9F7F2]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}


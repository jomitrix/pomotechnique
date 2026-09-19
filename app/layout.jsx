import '@/styles/globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata = {
  title: 'Pomotechnique',
  description: 'Simple Pomodoro timer web app',
  icons: {
    icon: `${basePath}/favicon.ico`,
    shortcut: `${basePath}/favicon.ico`,
    apple: `${basePath}/icon.png`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`dark ${plusJakarta.variable}`}>
      <body className={`${plusJakarta.className} antialiased bg-neutral-950 text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
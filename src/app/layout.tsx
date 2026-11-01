import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/i18n/I18nContext';
import { OsProvider } from '@/os/state/OsContext';

export const metadata: Metadata = {
  title: 'ECOS — Windows 98 / Y2K Operating System',
  description: 'Escritorio virtual retro interactivo que simula Windows 98 con estética Y2K.',
  icons: {
    icon: '/icons/ecos-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased overflow-hidden select-none bg-[#008080]">
        <I18nProvider>
          <OsProvider>
            {children}
          </OsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}


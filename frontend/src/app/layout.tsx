import type { Metadata } from 'next';
import { CookiesProvider } from 'next-client-cookies/server';

import './globals.css';

export const metadata: Metadata = {
  title: 'N-Chat',
  description: 'N-Chat',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div id="modal"></div>
        <CookiesProvider>
          {children}
          {modal}
        </CookiesProvider>
      </body>
    </html>
  );
}

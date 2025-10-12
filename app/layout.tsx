import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientNavbarWrapper from './components/ClientNavbarWrapper';
import ClientFooterWrapper from './components/ClientFooterWrapper';
import { Toaster } from 'react-hot-toast';
import { ChakraProvider } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Providers } from "./providers";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Halı Saha Organizasyonu',
  description: 'En yakın halı sahayı bulun ve randevu alın',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <ClientNavbarWrapper />
          {children}
          <ClientFooterWrapper />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
} 
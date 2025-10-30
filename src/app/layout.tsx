// src/app/layout.tsx
import type { Metadata } from "next";

import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";



export const metadata: Metadata = {
  title: "SOLO - Psicologia",
  description: "Psicoterapia Cognitivo Comportamental, Avaliação Neuropsicológica e Reabilitação Cognitiva com foco em evidências científicas e acolhimento humano.",
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}


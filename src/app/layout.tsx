// src/app/layout.tsx
import type { Metadata } from "next";

import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DynamicWhatsAppButton from "@/components/DynamicWhatsAppButton";

export const metadata: Metadata = {
  title: "SOLO - Psicologia",
  description: "Psicoterapia Cognitivo Comportamental, Avaliação Neuropsicológica e Reabilitação Cognitiva com foco em evidências científicas e acolhimento humano.",
  icons: {
    icon: [
      { url: '/icon1.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
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
          <main className="main-content">{children}</main>
          <Footer />
          <DynamicWhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}


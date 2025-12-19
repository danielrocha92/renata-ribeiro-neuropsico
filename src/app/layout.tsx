// src/app/layout.tsx
import type { Metadata } from "next";

import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DynamicWhatsAppButton from "@/components/DynamicWhatsAppButton";
import ScrollToTopButton from "@/components/ScrollToTopButton";


export const metadata: Metadata = {
  metadataBase: new URL('https://renataribeiropsico.com.br'),
  title: {
    default: "Renata Ribeiro | Neuropsicóloga e Psicóloga em São Paulo",
    template: "%s | Renata Ribeiro Neuropsicologia"
  },
  description: "Especialista em Neuropsicologia, Reabilitação Cognitiva e Terapia Cognitivo-Comportamental (TCC). Atendimento presencial na Barra Funda (SP) e Online.",
  keywords: ["neuropsicóloga", "psicóloga", "TCC", "avaliação neuropsicológica", "reabilitação cognitiva", "barra funda", "são paulo", "terapia online", "tea", "tdah"],
  authors: [{ name: "Renata Ribeiro" }],
  creator: "Renata Ribeiro",
  publisher: "Renata Ribeiro",
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://renataribeiropsico.com.br',
    title: 'Renata Ribeiro | Neuropsicóloga e Psicóloga',
    description: 'Atendimento clínico especializado em Neuropsicologia e TCC. Agende sua consulta.',
    siteName: 'Renata Ribeiro Neuropsicologia',
    images: [
      {
        url: '/Profile.jpeg', // Assuming profile image works as OG image for now, ideally 1200x630
        width: 800,
        height: 600,
        alt: 'Renata Ribeiro Neuropsicóloga',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
          <ScrollToTopButton />

        </AuthProvider>
      </body>
    </html>
  );
}


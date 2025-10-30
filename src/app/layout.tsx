// src/app/layout.tsx
import type { Metadata } from "next";

import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";



export const metadata: Metadata = {
  title: "Dra. Renata Ribeiro - Neuropsicologia e TCC",
  description: "Psicoterapia Cognitivo Comportamental, Avaliação Neuropsicológica e Reabilitação Cognitiva com foco em evidências científicas e acolhimento humano.",
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


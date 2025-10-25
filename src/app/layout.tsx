// src/app/layout.tsx
import '@/styles/globals.css'; // Atualizado para o novo caminho
import styles from '@/styles/Layout.module.css'; // Atualizado para o novo caminho
import React from 'react';

// Componente Header simples
function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Dra. Renata Ribeiro</div>
      <nav className={styles.nav}>
        {['Home', 'Serviços', 'Sobre', 'Blog', 'Contato'].map((item) => (
          // Usando <a href> diretamente, pois não estamos configurando o next/link
          <a key={item} href={`/${item.toLowerCase()}`} className={styles.link}>
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}

// Componente Footer simples
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contact}>
        Telefone: (XX) XXXX-XXXX | E-mail: contato@renataribeiro.com
      </div>
      © {new Date().getFullYear()} Dra. Renata Ribeiro. Todos os direitos reservados.
    </footer>
  );
}


export const metadata = {
  title: 'Dra. Renata Ribeiro | Neuropsicologia e TCC',
  description: 'Atendimento em Psicoterapia Cognitivo Comportamental, Avaliação Neuropsicológica, Reabilitação Cognitiva / USP. Consultas presenciais e online.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}


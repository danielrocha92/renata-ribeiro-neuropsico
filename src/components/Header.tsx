'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/Header.module.css';
import { Menu, X } from 'lucide-react'; // Ícones para o menu (Apple usa ícones simples)

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para fechar o menu após o clique (melhora a UX)
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/" onClick={handleLinkClick}>Dra. Renata Ribeiro</Link>
      </div>

      {/* Botão de Toggle (Visível apenas no Mobile) */}
      <button 
        className={styles.menuToggle}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        aria-label={isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Navegação - Usa a classe styles.menuOpen para o overlay mobile */}
      <nav id="main-navigation" className={`${styles.nav} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <ul className={styles.navList}>
          <li>
            <Link href="/sobre" onClick={handleLinkClick}>Sobre</Link>
          </li>
          <li>
            <Link href="/servicos" onClick={handleLinkClick}>Serviços</Link>
          </li>
          <li>
            <Link href="/blog" onClick={handleLinkClick}>Blog</Link>
          </li>
          <li>
            <Link href="/contato" onClick={handleLinkClick}>Contato</Link>
          </li>
          <li className={styles.ctaLink}>
            <Link href="/cliente" onClick={handleLinkClick}>Área do Cliente</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}


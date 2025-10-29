'use client';

// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Ícones de menu
import styles from '@/styles/Header.module.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Controla o overflow do body para evitar scroll quando o menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          Renata Ribeiro <span>Neuropsico</span>
        </Link>

        <button 
          className={styles.menuToggle} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}><Link href="/" onClick={() => setIsMenuOpen(false)}>Início</Link></li>
            <li className={styles.navItem}><Link href="/servicos" onClick={() => setIsMenuOpen(false)}>Serviços</Link></li>
            <li className={styles.navItem}><Link href="/sobre" onClick={() => setIsMenuOpen(false)}>Sobre</Link></li>
            <li className={styles.navItem}><Link href="/contato" onClick={() => setIsMenuOpen(false)}>Contato</Link></li>
            <li className={`${styles.navItem} ${styles.ctaLink}`}><Link href="/cliente" onClick={() => setIsMenuOpen(false)}>Área do Cliente</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
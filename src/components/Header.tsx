'use client';

// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { FiMenu, FiX } from 'react-icons/fi'; // Ícones de menu
import styles from '@/styles/Header.module.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) { // Adjust this value as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Controla o overflow do body para evitar scroll quando o menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
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
            <li className={`${styles.navItem} ${pathname === '/' ? styles.activeNavItem : ''}`}><Link href="/" onClick={() => setIsMenuOpen(false)}>Início</Link></li>
            <li className={`${styles.navItem} ${pathname === '/servicos' ? styles.activeNavItem : ''}`}><Link href="/servicos" onClick={() => setIsMenuOpen(false)}>Serviços</Link></li>
            <li className={`${styles.navItem} ${pathname === '/sobre' ? styles.activeNavItem : ''}`}><Link href="/sobre" onClick={() => setIsMenuOpen(false)}>Sobre</Link></li>
            <li className={`${styles.navItem} ${pathname === '/contato' ? styles.activeNavItem : ''}`}><Link href="/contato" onClick={() => setIsMenuOpen(false)}>Contato</Link></li>
            <li className={`${styles.navItem} ${styles.ctaLink} ${pathname === '/cliente' ? styles.activeNavItem : ''}`}><Link href="/cliente" onClick={() => setIsMenuOpen(false)}>Área do Cliente</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
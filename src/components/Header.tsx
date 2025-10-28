// src/components/Header.tsx
import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          Renata Ribeiro <span>Neuropsico</span>
        </Link>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}><Link href="/">Início</Link></li>
          <li className={styles.navItem}><Link href="/servicos">Serviços</Link></li>
          <li className={styles.navItem}><Link href="/sobre">Sobre</Link></li>
          <li className={styles.navItem}><Link href="/contato">Contato</Link></li>
          <li className={styles.navItem}><Link href="/cliente">Área do Cliente</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
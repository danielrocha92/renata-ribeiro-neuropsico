// src/components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { FiMenu, FiX } from 'react-icons/fi'; // Ícones de menu
import styles from '@/styles/Header.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname(); // Get current pathname
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

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
      document.body.style.overflow = ''; // Revert to stylesheet's value
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
            {!loading && user ? (
              <>
                {isAdmin ? (
                  <li className={`${styles.navItem} ${pathname?.startsWith('/admin') ? styles.activeNavItem : ''}`}>
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>Dashboard Admin</Link>
                  </li>
                ) : (
                  <li className={`${styles.navItem} ${pathname?.startsWith('/cliente') ? styles.activeNavItem : ''}`}>
                    <Link href="/cliente" onClick={() => setIsMenuOpen(false)}>Área do Cliente</Link>
                  </li>
                )}
                <li className={styles.navItem}><button onClick={handleLogout} className={styles.logoutButton}>Sair</button></li>
              </>
            ) : (
              <>
                <li className={`${styles.navItem} ${pathname === '/login' ? styles.activeNavItem : ''}`}><Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                <li className={`${styles.navItem} ${styles.ctaLink} ${pathname === '/cadastro' ? styles.activeNavItem : ''}`}><Link href="/cadastro" onClick={() => setIsMenuOpen(false)}>Cadastre-se</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header >
  );
};

export default Header;

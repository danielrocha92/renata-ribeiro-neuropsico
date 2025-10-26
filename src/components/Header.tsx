import Link from 'next/link';
import styles from '@/styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">Dra. Renata Ribeiro</Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/sobre">Sobre</Link>
          </li>
          <li>
            <Link href="/servicos">Serviços</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/contato">Contato</Link>
          </li>
          <li>
            <Link href="/cliente">Área do Cliente</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

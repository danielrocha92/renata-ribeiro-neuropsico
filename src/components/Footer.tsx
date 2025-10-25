import styles from '@/styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div>
        <p>"A jornada para o autoconhecimento e bem-estar começa com um passo."</p>
      </div>
      <ul className={styles.socialLinks}>
        <li>
          <Link href="#" target="_blank" rel="noopener noreferrer">Insta</Link>
        </li>
        <li>
          <Link href="#" target="_blank" rel="noopener noreferrer">Face</Link>
        </li>
        <li>
          <Link href="#" target="_blank" rel="noopener noreferrer">Linkd</Link>
        </li>
      </ul>
      <div className={styles.copyright}>
        <p>&copy; {currentYear} Dra. Renata Ribeiro. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

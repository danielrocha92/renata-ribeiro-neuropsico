// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Footer.module.css';
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiInstagram,
  FiLinkedin,
} from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>Renata Ribeiro | Neuropsicologia</h4>
          <p>CRP SP 06/53721-8</p>
          <p>
            Especialista com foco em neuropsicologia, TCC e Reabilitação Cognitiva
            (HC-FMUSP).
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4>Navegação</h4>
          <ul>
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>
              <Link href="/servicos">Serviços</Link>
            </li>
            <li>
              <Link href="/sobre">Sobre</Link>
            </li>
            <li>
              <Link href="/contato">Contato</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>Contato e Redes Sociais</h4>
          <p>
            <FiMapPin />
            Rua João Cachoeira, 488 - Conj. 510, Itaim Bibi, SP
          </p>
          <p>
            <FiMail />
            <a href="mailto:contato@renataribeiropsico.com.br">
              contato@renataribeiropsico.com.br
            </a>
          </p>
          <p>
            <FiPhone />
            <a href="https://wa.me/5511998765432">(11) 99876-5432</a>
          </p>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/psic.renataribeiro"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Instagram de Renata Ribeiro"
            >
              <FiInstagram size={28} />
            </a>
            <a
              href="https://www.linkedin.com/in/renataribeiropsico"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="LinkedIn de Renata Ribeiro"
            >
              <FiLinkedin size={28} />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} Renata Ribeiro Neuropsicologia. Todos os
        direitos reservados.
      </div>
      <div className={styles.madeBy}>
        Feito por:{' '}
        <a
          href="https://rocha-tech-solutions.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rocha Tech Solutions
        </a>
      </div>
    </footer>
  );
};

export default Footer;
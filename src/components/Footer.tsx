// src/components/Footer.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

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
          <h4>Links Úteis</h4>
          <ul>
            <li>
              <Link href="/politica-de-privacidade">Política de Privacidade</Link>
            </li>
            <li>
              <Link href="/termos-e-condicoes">Termos e Condições</Link>
            </li>
            <li>
              <Link href="/lgpd">LGPD</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>Contato e Redes Sociais</h4>
          <p className={styles.addressContainer}>
            <FiMapPin size={32} />
            <span className={styles.addressText}>
              R. Mário de Andrade, 48 - conjunto 1710 - Barra Funda, São Paulo - SP, 05281-060
            </span>
          </p>
          <p>
            <FiMail size={32} />
            <a href="mailto:contato@renataribeiropsico.com.br">
              contato@renataribeiropsico.com.br
            </a>
          </p>
          <p>
            <FiPhone size={32} />
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
              <FiInstagram size={32} />
            </a>
            <a
              href="https://www.linkedin.com/in/renataribeiropsico"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="LinkedIn de Renata Ribeiro"
            >
              <FiLinkedin size={32} />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        &copy; {currentYear} Renata Ribeiro Neuropsicologia. Todos os
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
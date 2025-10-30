// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Footer.module.css';
import { FiMapPin, FiMail, FiPhone, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4> Renata Ribeiro | Neuropsicologia</h4>
          <p>CRP SP 06/53721-8</p>
          <p>Especialista com foco em Neurociência, TCC e Reabilitação Cognitiva (HC-FMUSP).</p>
          <p>Atendimento presencial e online para adolescentes e adultos.</p>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/psic.renataribeiro"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Instagram da  Renata Ribeiro"
            >
              <FiInstagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/renataribeiropsico"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="LinkedIn da  Renata Ribeiro"
            >
              <FiLinkedin size={24} />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4>Localização e Contato</h4>
          <p><FiMapPin /> Rua João Cachoeira, 488 - Conj. 510, Itaim Bibi, SP</p>
          <p><FiMail /> <a href="mailto:contato@renataribeiropsico.com.br">contato@renataribeiropsico.com.br</a></p>
          <p><FiPhone /> <a href="tel:+5511998765432">(11) 99876-5432</a> (WhatsApp)</p>
        </div>

        <div className={styles.footerSection}>
          <h4>Navegação Rápida</h4>
          <ul>
            <li><Link href="/">Início</Link></li>
            <li><Link href="/servicos">Serviços</Link></li>
            <li><Link href="/sobre">Sobre a </Link></li>
            <li><Link href="/contato">Agendar Consulta</Link></li>
          </ul>
        </div>
      </div>
            <div className={styles.copyright}>
              &copy; {new Date().getFullYear()}
            </div>
            <div className={styles.madeBy}>
              Feito por: <a href="https://rocha-tech-solutions.vercel.app/" target="_blank" rel="noopener noreferrer">Rocha Tech Solutions.</a>  Todos os direitos reservados
              {/* Logo will be inserted here later */}
            </div>
          </footer>
  );
};

export default Footer;
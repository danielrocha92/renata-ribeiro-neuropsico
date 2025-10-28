import Link from 'next/link';

// src/components/Footer.tsx
import React from 'react';
import styles from '@/styles/Footer.module.css';

// Ícones SVG
const IconMap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/></svg>
);
const IconLinkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>Dra. Renata Ribeiro | Neuropsicologia</h4>
          <p>CRP SP 06/53721-8</p>
          <p>Especialista com foco em Neurociência, TCC e Reabilitação Cognitiva (HC-FMUSP).</p>
          <p>Atendimento presencial e online para adolescentes e adultos.</p>
          <div className={styles.socialIcons}>
            <a 
              href="https://www.instagram.com/psic.renataribeiro" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialIcon}
              aria-label="Instagram da Dra. Renata Ribeiro"
            >
              <IconInstagram />
            </a>
            <a 
              href="https://www.linkedin.com/in/renataribeiropsico" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialIcon}
              aria-label="LinkedIn da Dra. Renata Ribeiro"
            >
              <IconLinkedin />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4>Localização e Contato</h4>
          <p><IconMap /> Rua João Cachoeira, 488 - Conj. 510, Itaim Bibi, SP</p>
          <p><IconMail /> <a href="mailto:contato@renataribeiropsico.com.br">contato@renataribeiropsico.com.br</a></p>
          <p><IconPhone /> <a href="tel:+5511998765432">(11) 99876-5432</a> (WhatsApp)</p>
        </div>
        
        <div className={styles.footerSection}>
          <h4>Navegação Rápida</h4>
          <p><Link href="/">Início</Link></p>
          <p><Link href="/servicos">Serviços</Link></p>
          <p><Link href="/sobre">Sobre a Dra.</Link></p>
          <p><Link href="/contato">Agendar Consulta</Link></p>
        </div>
      </div>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} Dra. Renata Ribeiro. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
// src/app/servicos/ServicoCard.tsx
import React from 'react';
import styles from '@/styles/Servicos.module.css';

// Ícones SVG para representar os serviços
const iconMap: { [key: string]: React.ReactNode } = {
  TCC: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit">
      <path d="M12 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2 2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
      <path d="M16 14v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1"/>
      <path d="M18 10h-2M8 10H6"/>
      <path d="M12 18v2a2 2 0 0 0 2 2h2"/>
      <path d="M12 18v2a2 2 0 0 1-2 2H8"/>
    </svg>
  ),
  Neuro: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity">
      <path d="M22 12H18l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  Reabilitacao: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-puzzle">
      <path d="M19.4 15.6a2 2 0 0 0 .4-2.8l-.8-.8c-.3-.3-.6-.6-.9-.9a2 2 0 0 0-2.8.4L13 14c-.3.3-.6.6-.9.9a2 2 0 0 0 .4 2.8l.8.8c.3.3.6.6.9.9a2 2 0 0 0 2.8-.4z"/>
      <path d="M2.5 17.5l2-2.5 1.5 1.5-2 2.5z"/>
      <path d="M17.5 2.5l2.5 2 1.5-1.5-2.5-2z"/>
      <path d="M14.5 9.5l-2 2 1.5 1.5 2-2z"/>
      <path d="M9.5 14.5l-2-2 1.5-1.5 2 2z"/>
      <path d="M5 5l2 2 1.5 1.5-2-2z"/>
    </svg>
  ),
};

interface ServicoCardProps {
  id: 'TCC' | 'Neuro' | 'Reabilitacao';
  titulo: string;
  descricao: string;
  detalhes: string[];
}

const ServicoCard: React.FC<ServicoCardProps> = ({ id, titulo, descricao, detalhes }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>
        {iconMap[id]}
        {titulo}
      </h3>
      <p className={styles.cardDescription}>{descricao}</p>
      
      <ul className={styles.detailsList}>
        {detalhes.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      
      <a href="/contato" className={styles.ctaButtonSmall}>
        Saiba Mais e Agende
      </a>
    </div>
  );
};

export default ServicoCard;
// src/app/page.tsx
'use client';

import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const servicos = [
    'Psicoterapia Cognitivo Comportamental',
    'Avaliação Neuropsicológica',
    'Reabilitação Cognitiva / USP',
    'Apoio Emocional',
    'Consultas Presenciais e Online'
  ];

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Mapeando sua Mente, Transformando sua Vida.
          </h1>
          
          <ul className={styles.servicesList}>
            {servicos.map((servico, index) => (
              <li key={index} className={styles.serviceItem}>
                {servico}
              </li>
            ))}
          </ul>

          <p className={styles.subtitle}>
            Psicoterapia Cognitivo Comportamental, Avaliação Neuropsicológica e Reabilitação Cognitiva com foco em resultados baseados em evidências.
          </p>

          <Link href="/contato">
            <button className={styles.ctaButton}>
              Agende Sua Primeira Consulta
            </button>
          </Link>
        </div>
      </section>

      {/* Outras seções da Home iriam aqui */}
      
    </main>
  );
}


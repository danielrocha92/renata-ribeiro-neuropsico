// src/app/page.tsx
'use client';

import styles from '@/styles/Home.module.css'; // Atualizado para o novo caminho

// Função de exemplo para o clique no botão
const handleCtaClick = () => {
  // Simula a ação de redirecionar para uma página de agendamento ou link externo
  console.log('Redirecionando para a página de contato/agendamento...');
  alert('Redirecionando para a página de agendamento. (Use um link real em produção!)');
};


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

          <button 
            className={styles.ctaButton}
            onClick={handleCtaClick}
          >
            Agende Sua Primeira Consulta Online ou Presencial
          </button>
        </div>
      </section>

      {/* Outras seções da Home iriam aqui */}
      
    </main>
  );
}


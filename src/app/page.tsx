// src/app/page.tsx
'use client';

import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import CardServico from '@/components/CardServico';

// SVG Icon Components
const BrainIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h-3A2.5 2.5 0 0 1 4 4.5v0A2.5 2.5 0 0 1 6.5 2h3Z"/><path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h-3a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 11.5 2h3Z"/><path d="M12 12a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 12 17h0a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 12 12Z"/><path d="M4.5 9.5A2.5 2.5 0 0 1 7 12v0a2.5 2.5 0 0 1-2.5 2.5h-2A2.5 2.5 0 0 1 0 12v0A2.5 2.5 0 0 1 2.5 9.5h2Z"/><path d="M19.5 9.5a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5h-2a2.5 2.5 0 0 1-2.5-2.5v0a2.5 2.5 0 0 1 2.5-2.5h2Z"/><path d="M9.5 16.5A2.5 2.5 0 0 1 12 19v0a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 4 19v0a2.5 2.5 0 0 1 2.5-2.5h3Z"/><path d="M14.5 16.5a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5v0a2.5 2.5 0 0 1 2.5-2.5h3Z"/></svg>;
const ClipboardIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const HeartIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const LaptopIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.28 20H3.72a1 1 0 0 1-.9-1.45L4 16"/></svg>;

export default function Home() {
  const servicos = [
    {
      titulo: 'Psicoterapia Cognitivo-Comportamental',
      descricao: 'Abordagem prática para transformar padrões de pensamento e comportamento, tratando ansiedade, depressão e outros desafios.',
      icone: <BrainIcon />,
      link: '/servicos'
    },
    {
      titulo: 'Avaliação Neuropsicológica',
      descricao: 'Mapeamento detalhado das funções cognitivas para auxiliar no diagnóstico de TDAH, dificuldades de aprendizagem e quadros neurológicos.',
      icone: <ClipboardIcon />,
      link: '/servicos'
    },
    {
      titulo: 'Reabilitação Cognitiva',
      descricao: 'Intervenção para restaurar e otimizar a memória, atenção e outras funções cognitivas comprometidas por lesões ou condições neurológicas.',
      icone: <BrainIcon />,
      link: '/servicos'
    },
    {
      titulo: 'Apoio Emocional',
      descricao: 'Um espaço de escuta e acolhimento para lidar com momentos de estresse, transições de vida, luto e angústias pontuais.',
      icone: <HeartIcon />,
      link: '/servicos'
    },
    {
      titulo: 'Consultas Presenciais e Online',
      descricao: 'Flexibilidade para seu tratamento, com a mesma qualidade e sigilo no formato que melhor se adapta à sua rotina.',
      icone: <LaptopIcon />,
      link: '/contato'
    }
  ];

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Mapeando sua Mente, Transformando sua Vida.
          </h1>
          <p className={styles.subtitle}>
            Neuropsicologia e Psicoterapia com foco em resultados baseados em evidências.
          </p>
          <Link href="/contato">
            <button className={styles.ctaButton}>
              Agende Sua Primeira Consulta
            </button>
          </Link>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <h2 className={styles.sectionTitle}>Nossos Serviços</h2>
        <div className={styles.servicesGrid}>
          {servicos.map((servico, index) => (
            <Link href={servico.link} key={index} className={styles.cardLink}>
              <CardServico
                titulo={servico.titulo}
                descricao={servico.descricao}
                icone={servico.icone}
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}


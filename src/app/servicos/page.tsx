// src/app/servicos/page.tsx
import styles from '@/styles/Servicos.module.css';
import { BrainCircuit, ClipboardList, UserCheck, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'Serviços de Neuropsicologia e Psicoterapia',
  description: 'Ofereço Avaliação Neuropsicológica (TDAH, TEA, Memória), Psicoterapia Online (TCC) e Supervisão Clínica. Atendimento especializado na Barra Funda, SP.',
  alternates: {
    canonical: '/servicos',
  },
};

export default function ServicosPage() {
  return (
    <main className={styles.main}>
      <div className={styles.headerSection}>
        <h1 className={styles.heading}>Serviços Especializados</h1>
        <p className={styles.subHeading}>
          Abordagem baseada na Neuropsicologia e na Terapia Cognitivo-Comportamental (TCC), oferecendo um acompanhamento completo para o seu desenvolvimento cognitivo e emocional.
        </p>
      </div>

      <section className={styles.cardsContainer}>
        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <BrainCircuit size={32} />
          </div>
          <h2>Psicoterapia Online</h2>
          <p>
            Atendimento psicológico individual fundamentado na Terapia Cognitivo-Comportamental (TCC), voltado à compreensão de padrões de pensamento, emoções e comportamentos, ao desenvolvimento de estratégias de enfrentamento e ao acompanhamento de dificuldades emocionais e comportamentais.
          </p>
        </div>

        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <ClipboardList size={32} />
          </div>
          <h2>Avaliação Neuropsicológica</h2>
          <span className={styles.badge}>Presencial</span>
          <p>
            Processo de investigação clínica que busca compreender o funcionamento cognitivo, emocional e comportamental por meio de entrevistas, instrumentos psicológicos e neuropsicológicos, observação clínica e integração de diferentes fontes de informação.
          </p>
          <br />
          <p>
            Pode contribuir para a investigação de dificuldades relacionadas à atenção, memória, funções executivas e outras habilidades cognitivas, além de subsidiar hipóteses diagnósticas e recomendações individualizadas.
          </p>
        </div>

        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <UserCheck size={32} />
          </div>
          <h2>Avaliação Psicológica</h2>
          <p>
            Processo técnico-científico que utiliza métodos e instrumentos psicológicos adequados à demanda para investigar características psicológicas e responder a questões específicas de avaliação, respeitando as diretrizes éticas e técnicas da profissão.
          </p>
        </div>

        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <GraduationCap size={32} />
          </div>
          <h2>Consultoria & Supervisão</h2>
          <p>
            Espaço de discussão técnico-científica para profissionais da Psicologia, com foco no aprimoramento do raciocínio clínico, na análise de casos, na avaliação psicológica e neuropsicológica e na fundamentação das decisões profissionais.
          </p>
        </div>
      </section>

      <div className={styles.ctaSection}>
        <a href="/contato" className={styles.ctaButton}>
          Agendar uma Consulta
        </a>
      </div>
    </main>
  );
}

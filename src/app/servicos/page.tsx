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
            Acompanhamento psicológico baseado na TCC. Um espaço seguro e acolhedor para lidar com ansiedade, depressão, estresse e promover o autoconhecimento e a regulação emocional.
          </p>
        </div>

        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <ClipboardList size={32} />
          </div>
          <h2>Avaliação Neuropsicológica</h2>
          <span className={styles.badge}>Presencial</span>
          <p>
            Investigação clínica aprofundada do funcionamento cognitivo e comportamental. Indicada para diagnóstico e compreensão de TDAH, TEA, dislexia e outras neurodivergências.
          </p>
        </div>

        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <UserCheck size={32} />
          </div>
          <h2>Avaliação Psicológica</h2>
          <p>
            Compreensão de aspectos emocionais e de personalidade através de instrumentos reconhecidos. Auxilia em processos terapêuticos, orientação vocacional e contextos específicos.
          </p>
        </div>

        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <GraduationCap size={32} />
          </div>
          <h2>Consultoria & Supervisão</h2>
          <p>
            Apoio técnico e desenvolvimento clínico para psicólogos e profissionais da saúde. Foco no aprimoramento do raciocínio clínico e colaboração interdisciplinar.
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

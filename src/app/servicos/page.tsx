// src/app/servicos/page.tsx
import styles from '@/styles/Servicos.module.css';

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
      <h1 className={styles.heading}>Nossos Serviços Especializados</h1>
      <p className={styles.subHeading}>
        Com uma abordagem baseada na Neuropsicologia e na Terapia Cognitivo Comportamental (TCC), ofereço um acompanhamento completo para o seu desenvolvimento cognitivo e emocional.
      </p>

      <section className={styles.cardsContainer}>
        <div className={styles.serviceBlock}>
          <h2>Psicoterapia Online</h2>
          <p>Os atendimentos são realizados através do Google Meet, em ambiente confidencial e seguro.</p>
          <div className={styles.expandableContent}>
            <p>A psicoterapia online é um espaço de acolhimento e autoconhecimento, que tem como objetivo promover saúde mental, equilíbrio emocional e desenvolvimento pessoal.</p>
            <p>O trabalho é baseado nas Psicoterapias Cognitivo-Comportamentais de 3ª Geração, que integram técnicas de mindfulness, aceitação e regulação emocional, proporcionando resultados efetivos e adaptados à realidade de cada pessoa.</p>
            <p>Através do acompanhamento psicológico, é possível lidar melhor com <strong>ansiedade, depressão, stress, pânico, baixa autoestima, dificuldades nos relacionamentos</strong>, entre outras demandas emocionais do dia a dia.</p>
          </div>
        </div>

        <div className={styles.serviceBlock}>
          <h2>Avaliação Neuropsicológica <em>(Presencial)</em></h2>
          <p>A avaliação neuropsicológica é um processo clínico-científico que tem como objetivo compreender o funcionamento cognitivo, emocional e comportamental de uma pessoa.</p>
          <div className={styles.expandableContent}>
            <p>Realizada presencialmente, envolve entrevistas, aplicação de testes padronizados e análise integrada dos resultados, permitindo identificar padrões de funcionamento cerebral e possíveis alterações cognitivas.</p>
            <p>Este serviço é indicado para a investigação de neuro divergências, como TDAH, TEA, dislexia, dificuldades de aprendizagem, sequelas neurológicas e outras condições que afetam atenção, memória, linguagem, planejamento e comportamento.</p>
            <p>A devolutiva é feita em linguagem acessível, com orientações práticas e encaminhamentos adequados.</p>
          </div>
        </div>

        <div className={styles.serviceBlock}>
          <h2>Avaliação Psicológica</h2>
          <p>A avaliação psicológica busca compreender aspectos emocionais, comportamentais e de personalidade, auxiliando no autoconhecimento e na tomada de decisões em diferentes contextos.</p>
          <div className={styles.expandableContent}>
            <p>É indicada em situações como processos terapêuticos, orientações vocacionais, acompanhamento clínico, contextos jurídicos, ou demandas específicas que envolvem aspectos emocionais e de comportamento.</p>
            <p>O processo inclui entrevista inicial, aplicação de instrumentos psicológicos reconhecidos pelo Conselho Federal de Psicologia (CFP), e uma devolutiva clara, ética e fundamentada.</p>
          </div>
        </div>

        <div className={styles.serviceBlock}>
          <h2>Colaboração, Consultoria & Supervisão</h2>
          <p>Ofereço consultoria e supervisão clínica para psicólogos e profissionais em formação que desejam aprimorar o raciocínio clínico, o uso de instrumentos psicológicos e a condução de casos.</p>
          <div className={styles.expandableContent}>
            <p>A supervisão é conduzida em um espaço ético e colaborativo, voltado ao desenvolvimento técnico e pessoal do profissional, com foco em <strong>Psicologia Clínica, Avaliação Psicológica e Neuropsicológica</strong>.</p>
            <p>Também realizo colaborações interdisciplinares com médicos, educadores e outros profissionais da saúde, favorecendo uma atuação integrada e centrada no paciente.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

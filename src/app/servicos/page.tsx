// src/app/servicos/page.tsx
import ServicoCard from './ServicoCard';
import styles from '@/styles/Servicos.module.css';

export const metadata = {
  title: 'Serviços de Neuropsicologia e Psicoterapia | Renata Ribeiro Neuropsico',
  description: 'Descubra os serviços especializados de neuropsicologia e psicoterapia de Renata Ribeiro. Avaliação neuropsicológica, TCC e reabilitação cognitiva para seu bem-estar.',
};

// Dados simulados para os serviços (Tom de voz profissional e acolhedor)
const servicosData = [
  {
    id: 'TCC' as const,
    titulo: 'Psicoterapia Cognitivo Comportamental (TCC)',
    descricao: 'A TCC é uma abordagem focada no presente e orientada para a solução de problemas. Trabalhamos para identificar e modificar padrões de pensamento e comportamento que causam sofrimento.',
    detalhes: [
      'Tratamento para Ansiedade, Depressão e Estresse.',
      'Foco em metas práticas e resultados mensuráveis.',
      'Desenvolvimento de habilidades de enfrentamento (coping skills).'
    ]
  },
  {
    id: 'Neuro' as const,
    titulo: 'Avaliação Neuropsicológica',
    descricao: 'Processo investigativo detalhado para mapear o funcionamento cerebral, identificando forças e dificuldades em áreas como atenção, memória, raciocínio e funções executivas.',
    detalhes: [
      'Diagnóstico diferencial (TDAH, dislexia, demências iniciais).',
      'Elaboração de laudo e plano terapêutico individualizado.',
      'Recomendado para crianças, adolescentes e adultos.'
    ]
  },
  {
    id: 'Reabilitacao' as const,
    titulo: 'Reabilitação Cognitiva (Experiência USP)',
    descricao: 'Intervenção personalizada para restaurar ou compensar déficits cognitivos após lesão cerebral, condições neurológicas ou dificuldades de aprendizagem. Baseado em protocolos da USP.',
    detalhes: [
      'Treinamento de memória de trabalho e atenção sustentada.',
      'Estratégias para melhorar o planejamento e a organização (Funções Executivas).',
      'Metodologia comprovada por evidências científicas.'
    ]
  },
  {
    id: 'TCC' as const,
    titulo: 'Apoio Emocional e Acompanhamento',
    descricao: 'Espaço seguro para o processamento de emoções, manejo de crises e desenvolvimento da inteligência emocional. Foco no bem-estar integral e na qualidade de vida.',
    detalhes: [
      'Sessões focadas na escuta ativa e validação.',
      'Orientação para pais e familiares.',
      'Teleconsulta e Atendimento presencial flexível.'
    ]
  },
];


export default function ServicosPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Nossos Serviços Especializados</h1>
      <p className={styles.subHeading}>
        Com uma abordagem baseada na Neurociência e na Terapia Cognitivo Comportamental (TCC), ofereço um acompanhamento completo para o seu desenvolvimento cognitivo e emocional.
      </p>

      <section className={styles.cardsContainer}>
        {servicosData.map((servico) => (
          <ServicoCard 
            key={servico.titulo}
            id={servico.id}
            titulo={servico.titulo}
            descricao={servico.descricao}
            detalhes={servico.detalhes}
          />
        ))}
      </section>
    </main>
  );
}


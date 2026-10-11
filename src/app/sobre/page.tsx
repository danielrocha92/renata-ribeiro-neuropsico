// src/app/sobre/page.tsx
import styles from '@/styles/Sobre.module.css';
import utils from '@/styles/Utils.module.css';
import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Sobre Mim',
  description: 'Saiba mais sobre Renata Ribeiro, especialista em Neuropsicologia pela USP e psicóloga clínica (TCC). Experiência em avaliação, reabilitação cognitiva e terapia integrativa em São Paulo.',
  alternates: {
    canonical: '/sobre',
  },
};

// Dados da Formação
const formacaoData = [
  {
    titulo: 'Neuropsicologia e Reabilitação Cognitiva, Psicologia',
    instituicao: 'Universidade de São Paulo',
    ano: 'abril de 2023 - abril de 2025'
  },
  {
    titulo: 'Bacharelado, Psicologia',
    instituicao: 'Faculdades Metropolitanas Unidas',
    ano: '2015 - 2020'
  },
];

// Dados da Experiência
const experienciaData = [
  {
    cargo: 'Neuropsicóloga',
    empresa: 'Clínica Flora Psicologia',
    periodo: 'novembro de 2023 - Presente',
    descricao: 'Foco na elaboração de relatórios técnicos e intervenções terapêuticas para promover o bem-estar e o desenvolvimento pessoal.'
  },
  {
    cargo: 'Psicóloga clínica',
    empresa: 'Psicóloga Renata C Ribeiro',
    periodo: 'abril de 2021 - Presente',
    descricao: 'Psicóloga clínica comprometida com resultados para qualidade de vida e bem estar dos meus clientes, através da abordagem cognitivo comportamental.'
  },
  {
    cargo: 'Psicólogo clínico',
    empresa: 'Clínica Ame.C',
    periodo: 'agosto de 2021 - novembro de 2022',
    descricao: ''
  },
  {
    cargo: 'Assistente de RH',
    empresa: 'InforMaker',
    periodo: 'fevereiro de 2020 - dezembro de 2020',
    descricao: 'Recrutamento e seleção para vagas internas e externas para diversos cargos e níveis hierárquicos; Alinhamento de perfil com o solicitante da vaga, mapeamento e triagem de currículos; Experiência com as ferramentas de seleção ( Catho, Vagas.com e Linkedin); Divulgação de vagas na plataforma da empresa e outras fontes; Entrevistas individuais e de grupos (presencial e a distância); Utilização das ferramentas Teams, Skype e Google Met; Feedback positivo e negativo aos candidatos; Atividades administrativas da área de seleção.'
  },
  {
    cargo: 'Estagiária Terapeuta',
    empresa: 'CIECS -Clínica Escola de Psicologia da FMU',
    periodo: 'janeiro de 2018 - julho de 2020',
    descricao: 'Atendimento Psicoterápico De Crianças, Adolescentes, Adultos E Idosos: Psicodiagnóstico Infantil E Adulto; Orientação Vocacional; Plantão Psicológico; Aplicação De Testes. (TAT е HTP)'
  },
];


export default function SobrePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Sobre Renata Claudino Ribeiro</h1>

      <section className={styles.profileSection}>
        <div className={styles.photoPlaceholder}>
          <Image
            src="/galeria/DSC06220.jpeg"
            alt="Renata Claudino Ribeiro"
            width={200}
            height={200}
            className={utils.roundImage}
          />
        </div>
        <div className={styles.bio}>
          <h2>Psicóloga Clínica | Terapia Cognitivo-Comportamental e Neuropsicologia</h2>
          <p>
            Psicóloga clínica com sólida experiência em Terapia Cognitivo-Comportamental (TCC) e Neuropsicologia, com foco em avaliação e reabilitação de funções cognitivas, emocionais e comportamentais.
          </p>
          <p>
            Ofereço suporte personalizado e baseado em evidências para promover o bem-estar mental e a qualidade de vida. Atuo com avaliação neuropsicológica detalhada e intervenções terapêuticas para ajudar clientes a desenvolverem maior autoconhecimento e estratégias para lidar com desafios diários.
          </p>
        </div>
      </section>

      <section className={styles.formationSection}>
        <h2 className={styles.sectionTitle}>Experiência Profissional</h2>
        <ul className={styles.formationList}>
          {experienciaData.map((item, index) => (
            <li key={index} className={styles.formationItem}>
              <div className={styles.courseTitle}>{item.cargo}</div>
              <div className={styles.institution}>{item.empresa} ({item.periodo})</div>
              {item.descricao && <p className={`${utils.mt1} ${utils.textMuted} ${utils.preLine}`}>{item.descricao}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.formationSection}>
        <h2 className={styles.sectionTitle}>Formação Acadêmica</h2>
        <ul className={styles.formationList}>
          {formacaoData.map((item, index) => (
            <li key={index} className={styles.formationItem}>
              <div className={styles.courseTitle}>
                {item.titulo}
              </div>
              <div className={styles.institution}>
                {item.instituicao} ({item.ano})
              </div>
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}

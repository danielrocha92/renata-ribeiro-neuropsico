// src/app/sobre/page.tsx
import styles from '@/styles/Sobre.module.css';
import React from 'react';

// Dados da Formação
const formacaoData = [
  { 
    titulo: 'Especialização em Neurociência Aplicada', 
    instituicao: 'Harvard EdX (Certificação)', 
    ano: 2024
  },
  { 
    titulo: 'Reabilitação Cognitiva e Neuropsicologia Clínica', 
    instituicao: 'Universidade de São Paulo (USP)', 
    ano: 2022
  },
  { 
    titulo: 'Psicologia e Terapia Cognitivo Comportamental (TCC)', 
    instituicao: 'Universidade X (Graduação)', 
    ano: 2018
  },
  { 
    titulo: 'Formação em Mindfulness e Redução de Estresse', 
    instituicao: 'Centro de Estudos Y', 
    ano: 2020 
  },
];

export default function SobrePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Dra. Renata Ribeiro: Neurociência e Empatia a Seu Serviço</h1>

      <section className={styles.profileSection}>
        <div className={styles.photoPlaceholder}>
          
        </div>
        <div className={styles.bio}>
          <p>
            Olá! Sou a Dra. Renata Ribeiro, psicóloga e neuropsicóloga apaixonada pela complexidade da mente humana. Minha missão é traduzir o conhecimento da Neurociência em ferramentas práticas para o seu dia a dia, ajudando você a desvendar os mecanismos por trás de suas emoções e comportamentos.
          </p>
          <p>
            Com foco na **Terapia Cognitivo Comportamental (TCC)** e especialização em **Reabilitação Cognitiva pela USP**, eu ofereço um caminho claro e estruturado para lidar com dificuldades como TDAH, ansiedade, dificuldades de memória e estresse. Minha prática é sempre baseada em evidências científicas e um acolhimento genuíno.
          </p>
          <p>
            Acredito que entender como seu cérebro funciona é o primeiro passo para o autodomínio e para uma vida com mais clareza e bem-estar.
          </p>
        </div>
      </section>

      <section className={styles.philosophySection}>
        <h2 className={styles.sectionTitle}>Nossa Filosofia: Mente, Ciência e Ação</h2>
        <blockquote className={styles.philosophyText}>
          "Não basta apenas sentir; precisamos entender o que fazemos e por que fazemos. O acompanhamento eficaz une a profundidade da Neurociência com a ação transformadora da TCC. Juntos, vamos mapear seus padrões, construir novas conexões neurais e criar a vida que você deseja, passo a passo."
        </blockquote>
      </section>
      
      <section className={styles.formationSection}>
        <h2 className={styles.sectionTitle}>Formação e Credenciais</h2>
        <ul className={styles.formationList}>
          {formacaoData.map((item, index) => (
            <li key={index} className={styles.formationItem}>
              <div className={styles.courseTitle}>{item.titulo}</div>
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


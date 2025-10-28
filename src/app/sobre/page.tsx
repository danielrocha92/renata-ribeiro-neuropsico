// src/app/sobre/page.tsx
import styles from '@/styles/Sobre.module.css';
import React from 'react';

// Ícone de Localização (SVG simples)
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin">
        <path d="M12 18s-4 4-4 7c0 2.8 2.2 5 4 5s4-2.2 4-5c0-3-4-7-4-7z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

// Dados da Formação
const formacaoData = [
  { 
    titulo: 'Especialização em Neuropsicologia Clínica', 
    instituicao: 'CEPSIC - Hospital das Clínicas (HC) da Faculdade de Medicina da USP', 
    ano: '2011'
  },
  { 
    titulo: 'Pós-graduação em Psicologia Hospitalar Aplicada à Cardiologia', 
    instituicao: 'Instituto do Coração (INCOR) - FMUSP', 
    ano: '1999'
  },
  { 
    titulo: 'Especialização em Psicodinâmica do Adulto e Adolescente', 
    instituicao: 'Instituto Sedes Sapientiae', 
    ano: 'Não especificado'
  },
  { 
    titulo: 'Bacharelado e Formação em Psicologia', 
    instituicao: 'Universidade de São Paulo (USP)', 
    ano: '1993' 
  },
];

export default function SobrePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Dra. Renata Concilio Ribeiro: Autoridade em Neuropsicologia (USP)</h1>

      <section className={styles.profileSection}>
        <div className={styles.photoPlaceholder}>
          
        </div>
        <div className={styles.bio}>
          <p>
            Com mais de 20 anos de experiência, sou a **Dra. Renata Concilio Ribeiro**, psicóloga, neuropsicóloga e psicanalista. Minha trajetória é marcada pelo rigor acadêmico das principais instituições do país, como o **Hospital das Clínicas (HC) da FMUSP**, onde obtive minha especialização em Neuropsicologia Clínica.
          </p>
          <p>
            Minha prática combina a profundidade da psicanálise com as estratégias focadas e baseadas em evidências da Terapia Cognitivo Comportamental (TCC), oferecendo um atendimento que é ao mesmo tempo acolhedor e altamente eficaz. Atendo **adolescentes e adultos**, focando em diagnósticos precisos e reabilitação cognitiva.
          </p>

          <div className={styles.locationSection}>
            <LocationIcon />
            <div className={styles.locationText}>
                Atendimento presencial em São Paulo, Itaim Bibi: <br/>
                Rua João Cachoeira, 488 - Conjunto 510.
            </div>
          </div>
        </div>
      </section>

      <section className={styles.philosophySection}>
        <h2 className={styles.sectionTitle}>Filosofia: Ciência a Serviço do Bem-Estar</h2>
        <blockquote className={styles.philosophyText}>
          &quot;O cérebro é a nossa ferramenta mais complexa. Meu trabalho é oferecer o mapeamento neuropsicológico necessário para desvendar dificuldades e, em seguida, fornecer as estratégias (sejam elas da TCC ou da Reabilitação Cognitiva) para que o paciente retome o controle de sua vida com autonomia e conhecimento.&quot;
        </blockquote>
      </section>
      
      <section className={styles.formationSection}>
        <h2 className={styles.sectionTitle}>Formação e Credenciais</h2>
        <ul className={styles.formationList}>
          {formacaoData.map((item, index) => (
            <li key={index} className={styles.formationItem}>
              <div className={styles.courseTitle}>
                {item.titulo} 
                {item.instituicao.includes('USP') && 
                  <span style={{ fontSize: '0.8em', marginLeft: '8px', color: '#888' }}>(Referência Nacional)</span>
                }
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
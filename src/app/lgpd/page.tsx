// src/app/lgpd/page.tsx
import styles from '@/styles/LegalPage.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LGPD | Renata Ribeiro | Psicologia e Neuropsicologialogia',
  description:
    'Informações sobre a conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei n.º 13.709/2018).',
};

export default function LgpdPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>LGPD</h1>
          <p className={styles.subtitle}>Lei Geral de Proteção de Dados — Lei n.º 13.709/2018</p>
          <p className={styles.lastUpdated}>Última atualização: abril de 2026</p>
        </header>

        <section className={styles.section}>
          <h2>LGPD — Aviso de Privacidade Simplificado</h2>
          <p>
            Nosso compromisso com a privacidade
          </p>
          <p>
            Este consultório leva a sério a proteção dos seus dados. Nossa arquitetura digital foi desenhada para que este site funcione apenas como ponte de contato, isolando completamente seus dados sensíveis.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Separação de Dados</h2>
          <ul>
            <li><strong>Dados de Contato (Processados por este site):</strong> — Nome, E-mail e WhatsApp. Usados para retornar seu contato.</li>
            <li><strong>Dados Sensíveis (NÃO processados por este site):</strong> — Informações de saúde, histórico clínico e registros de sessões. Estes dados ficam sob guarda exclusiva da psicóloga em prontuário próprio, arquivado de forma segura e offline ou em software médico homologado.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Dados que tratamos</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3>Dados comuns</h3>
              <ul>
                <li>Nome completo</li>
                <li>E-mail</li>
                <li>Telefone / WhatsApp</li>
                <li>Dados de navegação (IP, dispositivo)</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Dados sensíveis</h3>
              <ul>
                <li>Informações de saúde física e mental</li>
                <li>Histórico clínico e psicológico</li>
                <li>Resultados de avaliações neuropsicológicas</li>
              </ul>
              <p className={styles.cardNote}>
                Tratados com sigilo reforçado e conforme o Código de Ética do CFP.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Bases legais utilizadas</h2>
          <div className={styles.table}>
            <div className={styles.tableRow}>
              <span className={styles.tableLabel}>Consentimento</span>
              <span>Comunicações de marketing, cookies analíticos.</span>
            </div>
            <div className={styles.tableRow}>
              <span className={styles.tableLabel}>Contrato</span>
              <span>Prestação dos serviços psicológicos contratados.</span>
            </div>
            <div className={styles.tableRow}>
              <span className={styles.tableLabel}>Obrigação legal</span>
              <span>Retenção de prontuários conforme o CFP.</span>
            </div>
            <div className={styles.tableRow}>
              <span className={styles.tableLabel}>Proteção à saúde</span>
              <span>Tratamento de dados de saúde durante o atendimento clínico.</span>
            </div>
            <div className={styles.tableRow}>
              <span className={styles.tableLabel}>Legítimo interesse</span>
              <span>Segurança e melhoria contínua do site.</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Prazos de Retenção</h2>
          <p>
            Os registros documentais de saúde (prontuários) são mantidos por no mínimo 5 anos, conforme exigência do Conselho Federal de Psicologia (Resolução CFP n.º 01/2009).
          </p>
        </section>

        <section className={styles.section}>
          <h2>Como exercer seus direitos</h2>
          <p>
            Você é o dono dos seus dados. Para solicitar acesso, correção ou exclusão das suas informações de contato da nossa base:
          </p>
          <div className={styles.contactBlock}>
            <p>
              E-mail:{' '}
              <a href="mailto:neuropsirenataribeiro@gmail.com">
                neuropsirenataribeiro@gmail.com
              </a>
            </p>
            <p>Informe no assunto: <em>&quot;Solicitação LGPD – [seu direito]&quot;</em></p>
          </div>
        </section>

         <section className={styles.section}>
          <h2>Prazos de Resposta:</h2>
          <ul>
            <li><strong>Solicitações simples (como confirmar se temos seus dados):</strong> — Retorno imediato (ou no menor tempo operacional possível).</li>
            <li><strong>Solicitações complexas (como relatórios completos de tratamento de dados):</strong> — Até 15 dias úteis, conforme determina a lei.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Encarregada de dados (DPO)</h2>
          <p>
            A responsável pelo tratamento de dados é a própria titular, <strong>Renata C. Ribeiro</strong>, disponível através do canal de contato oficial acima.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Autoridade Nacional de Proteção de Dados (ANPD)</h2>
          <p>
            Caso suas solicitações não sejam atendidas de forma satisfatória, você pode recorrer à{' '}
            <strong>ANPD</strong> pelo portal:{' '}
            <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">
              www.gov.br/anpd
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

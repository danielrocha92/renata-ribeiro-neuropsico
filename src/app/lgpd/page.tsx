// src/app/lgpd/page.tsx
import styles from '@/styles/LegalPage.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LGPD | Renata Ribeiro Neuropsicologia',
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
          <h2>O que é a LGPD?</h2>
          <p>
            A <strong>Lei Geral de Proteção de Dados Pessoais (LGPD)</strong>, Lei Federal n.º
            13.709 de 14 de agosto de 2018, estabelece regras sobre coleta, armazenamento,
            tratamento e compartilhamento de dados pessoais no Brasil, com o objetivo de proteger
            os direitos fundamentais de liberdade e de privacidade.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Nosso compromisso</h2>
          <p>
            <strong>Renata C. Ribeiro</strong> (CRP SP 06/195299) está comprometida com a
            conformidade à LGPD em todas as etapas de coleta e tratamento de dados pessoais,
            respeitando os princípios de:
          </p>
          <ul>
            <li><strong>Finalidade</strong> — dados coletados para propósitos específicos e legítimos.</li>
            <li><strong>Adequação</strong> — uso compatível com as finalidades informadas.</li>
            <li><strong>Necessidade</strong> — coleta limitada ao mínimo necessário.</li>
            <li><strong>Transparência</strong> — informações claras sobre o tratamento.</li>
            <li><strong>Segurança</strong> — medidas técnicas para proteção dos dados.</li>
            <li><strong>Não discriminação</strong> — proibição de tratamento para fins ilícitos.</li>
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
          <h2>Seus direitos como titular</h2>
          <p>
            De acordo com o Art. 18 da LGPD, você possui os seguintes direitos em relação aos seus
            dados pessoais:
          </p>
          <ul>
            <li>Confirmação da existência de tratamento.</li>
            <li>Acesso aos dados.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.</li>
            <li>Portabilidade dos dados a outro fornecedor de serviço.</li>
            <li>Eliminação dos dados tratados com consentimento.</li>
            <li>Informação sobre o compartilhamento com terceiros.</li>
            <li>Revogação do consentimento a qualquer momento.</li>
            <li>Oposição a tratamento realizado em descumprimento da LGPD.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Como exercer seus direitos</h2>
          <p>
            Para exercer qualquer direito previsto na LGPD, entre em contato pelo canal abaixo.
            Respondemos em até <strong>15 dias úteis</strong>:
          </p>
          <div className={styles.contactBlock}>
            <p>
              📧{' '}
              <a href="mailto:contato@renataribeiropsico.com.br">
                contato@renataribeiropsico.com.br
              </a>
            </p>
            <p>Informe no assunto: <em>&quot;Solicitação LGPD – [seu direito]&quot;</em></p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Encarregado de dados (DPO)</h2>
          <p>
            O encarregado pelo tratamento de dados pessoais é a própria titular do consultório:{' '}
            <strong>Renata C. Ribeiro</strong>, que pode ser contactada pelo e-mail acima.
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

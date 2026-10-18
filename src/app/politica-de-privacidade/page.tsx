// src/app/politica-de-privacidade/page.tsx
import styles from '@/styles/LegalPage.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Renata Ribeiro | Psicologia e Neuropsicologialogia',
  description:
    'Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD.',
};

export default function PoliticaDePrivacidadePage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Política de Privacidade</h1>
          <p className={styles.lastUpdated}>Última atualização: abril de 2026</p>
        </header>

        <section className={styles.section}>
          <h2>1. Quem somos</h2>
          <p>
            Este site institucional é mantido por <strong>Renata Claudino Ribeiro</strong>, psicóloga e neuropsicóloga inscrita no CRP SP 06/165147, com atuação em psicoterapia online e avaliação neuropsicológica presencial em São Paulo – SP.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Quais dados o site coleta</h2>
          <p>Para garantir a segurança e o limite de atuação da plataforma, separamos a coleta de dados da seguinte forma:</p>
          <ul>
            <li>
              <strong>Dados captados pelo site:</strong> Apenas informações de contato fornecidas voluntariamente no formulário (nome, e-mail e telefone/WhatsApp) e dados básicos de navegação (endereço IP, dispositivo e páginas acessadas).
            </li>
            <li>
              <strong>Dados clínicos (Sensíveis):</strong> Nenhuma informação de saúde, prontuário ou histórico clínico transita ou é armazenada na infraestrutura deste site. Esses dados são tratados exclusivamente pela profissional durante as sessões e guardados em sistema de gestão clínica apartado e seguro.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Como usamos os dados do site</h2>
          <ul>
            <li>Responder solicitações de contato e realizar o agendamento prévio das consultas.</li>
            <li>Garantir a segurança da infraestrutura do site e melhorar a experiência de navegação.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Base legal para o tratamento</h2>
          <p>
            O tratamento dos dados segue a Lei Geral de Proteção de Dados (Lei n.º 13.709/2018):
          </p>
          <ul>
            <li>
              <strong>Consentimento</strong> — Para análise de navegação (cookies) e envio de comunicações.
            </li>
            <li>
              <strong>Diligências pré-contratuais e Contrato:</strong> — Para viabilizar o agendamento e a prestação dos serviços psicológicos.
            </li>
            <li>
              <strong>Legítimo interesse:</strong> — Para a segurança da aplicação.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Compartilhamento de dados</h2>
          <p>
            Seus dados <strong>não são vendidos</strong> a terceiros. O compartilhamento ocorre apenas com prestadores de infraestrutura tecnológica estritamente necessários para o funcionamento do site (como serviços de hospedagem e banco de dados em nuvem, que operam sob protocolos de segurança criptografados) e plataformas de comunicação (como WhatsApp, Google Meet ou Zoom) utilizadas diretamente pela profissional para viabilizar os atendimentos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Armazenamento e segurança</h2>
          <p>
            Os dados de contato do site são mantidos em servidores com criptografia padrão da indústria. Já os dados clínicos e registros documentais (gerados após o início do atendimento e armazenados fora deste site) são retidos pela profissional pelo prazo mínimo de 5 (cinco) anos, em estrito cumprimento ao Art. 18 da Resolução CFP n.º 01/2009.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Seus direitos</h2>
          <p>Conforme a LGPD, você pode solicitar a qualquer momento: confirmação, acesso, correção, anonimização, bloqueio ou eliminação dos seus dados, bem como a revogação do consentimento. Entre em contato pelo e-mail:{' '}
            <a href="mailto:neuropsirenataribeiro@gmail.com">
              neuropsirenataribeiro@gmail.com
            </a>.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Cookies</h2>
          <p>
            Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para entender o tráfego. Você pode gerenciá-los ou bloqueá-los nas configurações do seu navegador.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Alterações nesta política</h2>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos a leitura
            regular. Alterações relevantes serão comunicadas de forma destacada no site.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Contato</h2>
          <p>
            Dúvidas ou solicitações relacionadas a esta política podem ser enviadas para:{' '}
            <a href="mailto:neuropsirenataribeiro@gmail.com">
              neuropsirenataribeiro@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

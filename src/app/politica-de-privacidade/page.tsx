// src/app/politica-de-privacidade/page.tsx
import styles from '@/styles/LegalPage.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Renata Ribeiro Neuropsicologia',
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
            Este site é mantido por <strong>Renata C. Ribeiro</strong>, psicóloga e neuropsicóloga
            inscrita no CRP SP 06/195299, com atuação em psicoterapia online e avaliação
            neuropsicológica presencial em São Paulo – SP.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Quais dados coletamos</h2>
          <p>Podemos coletar as seguintes categorias de dados pessoais:</p>
          <ul>
            <li>
              <strong>Dados de identificação:</strong> nome completo, e-mail e telefone, fornecidos
              voluntariamente pelo formulário de contato ou agendamento.
            </li>
            <li>
              <strong>Dados de navegação:</strong> endereço IP, tipo de dispositivo, páginas
              visitadas e tempo de permanência, coletados automaticamente por ferramentas de análise
              (ex.: Google Analytics).
            </li>
            <li>
              <strong>Dados clínicos:</strong> informações de saúde compartilhadas durante o
              atendimento, tratadas com sigilo e guardiadas conforme o Código de Ética do CFP.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Como usamos seus dados</h2>
          <ul>
            <li>Responder solicitações de contato e agendamento de consultas.</li>
            <li>Enviar confirmações, lembretes e comunicações relacionadas ao atendimento.</li>
            <li>Melhorar a experiência de navegação no site.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Base legal para o tratamento</h2>
          <p>
            O tratamento dos seus dados é realizado com base nas seguintes hipóteses previstas na
            Lei Geral de Proteção de Dados (Lei n.º 13.709/2018):
          </p>
          <ul>
            <li>
              <strong>Consentimento</strong> — para envio de comunicações e análise de navegação.
            </li>
            <li>
              <strong>Execução de contrato</strong> — para prestação dos serviços psicológicos.
            </li>
            <li>
              <strong>Cumprimento de obrigação legal</strong> — para atender determinações do CFP e
              legislação aplicável.
            </li>
            <li>
              <strong>Legítimo interesse</strong> — para segurança e melhoria do site.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Compartilhamento de dados</h2>
          <p>
            Seus dados <strong>não são vendidos</strong> a terceiros. Podemos compartilhá-los
            apenas com:
          </p>
          <ul>
            <li>Prestadores de serviço tecnológico (hospedagem, e-mail, videoconferência) sob
              obrigação de confidencialidade.</li>
            <li>Autoridades públicas, quando exigido por lei ou ordem judicial.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Armazenamento e segurança</h2>
          <p>
            Os dados são armazenados em servidores seguros com criptografia. Dados clínicos são
            mantidos pelo período mínimo exigido pelo CFP (20 anos a partir do encerramento do
            atendimento ou, para crianças, até 10 anos após a maioridade).
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Seus direitos</h2>
          <p>Nos termos da LGPD, você tem direito a:</p>
          <ul>
            <li>Confirmar a existência de tratamento dos seus dados.</li>
            <li>Acessar os dados que possuímos sobre você.</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
            <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários.</li>
            <li>Revogar o consentimento a qualquer momento.</li>
          </ul>
          <p>
            Para exercer seus direitos, entre em contato pelo e-mail:{' '}
            <a href="mailto:contato@renataribeiropsico.com.br">
              contato@renataribeiropsico.com.br
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Cookies</h2>
          <p>
            Utilizamos cookies para melhorar a experiência de navegação e analisar o tráfego do
            site. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar
            algumas funcionalidades.
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
            <a href="mailto:contato@renataribeiropsico.com.br">
              contato@renataribeiropsico.com.br
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

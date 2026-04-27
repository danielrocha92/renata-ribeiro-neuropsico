// src/app/termos-e-condicoes/page.tsx
import styles from '@/styles/LegalPage.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos e Condições | Renata Ribeiro Neuropsicologia',
  description:
    'Leia os Termos e Condições de uso dos serviços oferecidos por Renata C. Ribeiro – Psicóloga & Neuropsicóloga.',
};

export default function TermosECondicoesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Termos e Condições</h1>
          <p className={styles.lastUpdated}>Última atualização: abril de 2026</p>
        </header>

        <section className={styles.section}>
          <h2>1. Aceitação dos termos</h2>
          <p>
            Ao acessar e utilizar este site ou contratar os serviços de <strong>Renata C.
            Ribeiro</strong> (CRP SP 06/195299), você declara ter lido, compreendido e concordado
            com os presentes Termos e Condições. Caso não concorde, pedimos que não utilize os
            serviços.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Serviços oferecidos</h2>
          <p>Os serviços disponibilizados incluem:</p>
          <ul>
            <li>Psicoterapia online (via plataforma de videoconferência segura).</li>
            <li>Avaliação neuropsicológica presencial em São Paulo – SP.</li>
            <li>Avaliação psicológica.</li>
            <li>Consultoria, colaboração e supervisão clínica para profissionais.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Agendamento e cancelamento</h2>
          <ul>
            <li>
              O agendamento de sessões é realizado mediante contato prévio e confirmação formal.
            </li>
            <li>
              Cancelamentos devem ser realizados com antecedência mínima de <strong>24 horas</strong>.
              Cancelamentos tardios ou ausências sem aviso prévio poderão ser cobrados integralmente.
            </li>
            <li>
              Em casos de emergência devidamente justificada, a profissional analisará a situação
              individualmente.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Pagamento</h2>
          <ul>
            <li>Os honorários são informados no momento do agendamento.</li>
            <li>O pagamento deve ser efetuado conforme combinado previamente.</li>
            <li>
              Não é emitido reembolso por sessões realizadas, salvo acordo específico entre as
              partes.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Sigilo profissional</h2>
          <p>
            Todas as informações compartilhadas durante os atendimentos são protegidas pelo sigilo
            profissional, conforme o Código de Ética Profissional do Psicólogo (Resolução CFP n.º
            10/2005) e a legislação vigente. O sigilo poderá ser quebrado somente nas hipóteses
            legalmente previstas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Uso do site</h2>
          <p>É vedado ao usuário:</p>
          <ul>
            <li>Utilizar o site para fins ilícitos ou contrários a estes Termos.</li>
            <li>Reproduzir, distribuir ou modificar conteúdos sem autorização expressa.</li>
            <li>Tentar acessar áreas restritas sem credenciais autorizadas.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Propriedade intelectual</h2>
          <p>
            Todo o conteúdo deste site — textos, imagens, logotipos e materiais educativos — é de
            propriedade de Renata C. Ribeiro ou de seus licenciadores, protegido pela legislação de
            direitos autorais. A reprodução sem autorização é proibida.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Limitação de responsabilidade</h2>
          <p>
            O conteúdo informativo deste site tem caráter educacional e não substitui consulta
            psicológica ou neuropsicológica individual. A profissional não se responsabiliza pelo
            uso indevido das informações disponibilizadas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Alterações nos termos</h2>
          <p>
            Estes Termos podem ser atualizados a qualquer momento. O uso continuado do site após
            eventuais alterações implica a aceitação das novas condições.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Foro</h2>
          <p>
            Fica eleito o foro da Comarca de São Paulo – SP para dirimir quaisquer conflitos
            decorrentes destes Termos, com renúncia a qualquer outro, por mais privilegiado que
            seja.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Contato</h2>
          <p>
            Dúvidas sobre estes Termos:{' '}
            <a href="mailto:contato@renataribeiropsico.com.br">
              contato@renataribeiropsico.com.br
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

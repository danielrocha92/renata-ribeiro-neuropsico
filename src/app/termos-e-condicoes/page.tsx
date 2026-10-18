// src/app/termos-e-condicoes/page.tsx
import styles from '@/styles/LegalPage.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos e Condições | Renata Ribeiro | Psicologia e Neuropsicologialogia',
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
            Ao utilizar este site para solicitar contato ou agendamento com <strong>Renata Claudino Ribeiro</strong> (CRP SP 06/165147), você concorda com estes Termos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. O papel deste site</h2>
          <p>Este site atua exclusivamente como um portal institucional e canal de agendamento prévio. Ele não é uma plataforma de telemedicina e não substitui os canais oficiais de sessão (plataformas de videoconferência).</p>
        </section>

        <section className={styles.section}>
          <h2>3. Serviços oferecidos</h2>
          <ul>
            <li>
              Psicoterapia online (realizada via plataforma de videoconferência segura externa ao site).
            </li>
            <li>
              Avaliação neuropsicológica presencial em São Paulo – SP.
            </li>
            <li>
              Consultoria e supervisão clínica.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Agendamento, Cancelamentos e No-Show</h2>
          <ul>
            <li>O preenchimento do formulário no site é uma solicitação de contato, não garantindo a reserva imediata do horário. A confirmação ocorre mediante retorno direto da profissional.</li>
            <li>Cancelamentos ou reagendamentos devem ser informados com antecedência mínima de 24 horas. Sessões canceladas fora deste prazo ou ausências sem aviso prévio (no-show) são passíveis de cobrança integral, conforme contrato terapêutico estabelecido no início do acompanhamento.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Sigilo e Ética</h2>
          <p>
            Todo o processo terapêutico é protegido por rigoroso sigilo, conforme o Código de Ética Profissional do Psicólogo. Nenhuma informação conversada em sessão é registrada na base de dados deste site.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Propriedade Intelectual</h2>
          <p>Textos, identidade visual e materiais deste site pertencem a Renata C. Ribeiro e estão protegidos por direitos autorais.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Foro</h2>
          <p>
            Elege-se o foro da Comarca de São Paulo – SP para eventuais questões jurídicas relacionadas ao uso deste portal institucional.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Alterações nos termos</h2>
          <p>
            Estes Termos podem ser atualizados a qualquer momento. O uso continuado do site após
            eventuais alterações implica a aceitação das novas condições.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Contato</h2>
          <p>
            Dúvidas sobre estes Termos:{' '}
            <a href="mailto:neuropsirenataribeiro@gmail.com">
              neuropsirenataribeiro@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

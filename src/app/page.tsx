import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import CardServico from '@/components/CardServico';

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.textBlock}>
            <h1 className={styles.headline}>
              Desvendando o potencial da mente humana.
            </h1>
            <p className={styles.subheadline}>
              Avaliação e reabilitação neuropsicológica para todas as idades, focada em uma vida mais plena e consciente.
            </p>
            <Link href="/contato" className={styles.ctaButton}>
              Agendar Consulta
            </Link>
          </div>
          <div className={styles.imagePlaceholder}>
            <span>Imagem da profissional</span>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <h2 className={styles.servicesTitle}>Serviços em Destaque</h2>
        <div className={styles.servicesGrid}>
          <CardServico
            icone="🧠"
            titulo="Avaliação Neuropsicológica"
            descricao="Investigação detalhada das funções cognitivas, como memória, atenção e raciocínio, para identificar forças e fraquezas."
          />
          <CardServico
            icone="💪"
            titulo="Reabilitação Cognitiva"
            descricao="Programas personalizados para otimizar e restaurar funções cognitivas, melhorando a qualidade de vida e a autonomia."
          />
          <CardServico
            icone="❤️"
            titulo="Acompanhamento Psicológico"
            descricao="Psicoterapia e suporte emocional para lidar com desafios, transtornos e promover o bem-estar mental."
          />
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <h2 className={styles.aboutTitle}>Conheça a Dra. Renata Ribeiro</h2>
            <p className={styles.aboutDescription}>
              Com uma paixão pela neurociência e um profundo compromisso com o bem-estar de seus pacientes, a Dra. Renata dedica-se a oferecer diagnósticos precisos e tratamentos eficazes, utilizando abordagens baseadas em evidências para promover a saúde cognitiva e emocional.
            </p>
            <Link href="/sobre" className={styles.secondaryButton}>
              Saiba Mais
            </Link>
          </div>
          <div className={styles.aboutImagePlaceholder}>
            <span>Foto da Dra. Renata</span>
          </div>
        </div>
      </section>
    </main>
  );
}

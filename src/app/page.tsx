import Link from 'next/link';
import styles from '@/styles/Home.module.css';

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
      {/* Outras seções da Home page virão aqui */}
    </main>
  );
}

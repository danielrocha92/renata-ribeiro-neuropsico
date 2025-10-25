import styles from '../styles/CardServico.module.css';

export default function CardServico({ titulo, descricao, icone }: { titulo: string, descricao: string, icone: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.icone}>{icone}</div>
      <h3 className={styles.titulo}>{titulo}</h3>
      <p className={styles.descricao}>{descricao}</p>
    </div>
  );
}

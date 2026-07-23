'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/GoogleReviews.module.css';
import { Star, ExternalLink } from 'lucide-react';
import { getRelativeTime } from '@/lib/getRelativeTime';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Review {
  author_name: string;
  rating: number;
  /** Unix timestamp em segundos — getRelativeTime() calcula o "há X meses/anos" automaticamente */
  time: number;
  text: string;
}

// ─── Helper para converter data para unix timestamp (segundos) ────────────────
function ts(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

// ─── Avaliações reais do Google Maps (coletadas em abril/2026) ────────────────
// Datas estimadas com base no texto exibido pelo Google ("há X meses/anos").
// O getRelativeTime() recalcula automaticamente a partir de agora — nunca fica desatualizado.
const REVIEWS: Review[] = [
  {
    author_name: 'Lorena Queiroz',
    rating: 5,
    time: ts('2025-09-20'), // "há 7 meses" a partir de abr/2026
    text: 'Excelente profissional. Sempre muito cuidadosa e responsável com seus casos e estudos. Super recomendo!',
  },
  {
    author_name: 'Elvira Melo',
    rating: 5,
    time: ts('2025-09-22'),
    text: 'Excelente profissional! Sempre dedicada com seus casos de avaliação Neuropsicológica de adultos! Recomendo.',
  },
  {
    author_name: 'Jéssica Santos',
    rating: 5,
    time: ts('2025-09-25'),
    text: 'Profissional excelente. Além de ser super acolhedora e atenciosa, é extremamente ética, competente e comprometida.',
  },
  {
    author_name: 'Fabiana Saraiva',
    rating: 5,
    time: ts('2025-09-27'),
    text: 'Conheço a Renata há muitos anos, profissional excelente, responsável e dedicada.',
  },
  {
    author_name: 'Carlos Araujo',
    rating: 5,
    time: ts('2024-04-15'), // "há 2 anos" a partir de abr/2026
    text: 'Profissional extremamente competente e atenciosa. Recomendo muito!',
  },
  {
    author_name: 'Lorena Antunes',
    rating: 5,
    time: ts('2024-04-10'),
    text: 'Excelente profissional.',
  },
  {
    author_name: 'Marcos Henrique',
    rating: 5,
    time: ts('2024-03-20'),
    text: 'Excelente profissional, atenciosa e muito competente no que faz.',
  },
  {
    author_name: 'Camila Tullio',
    rating: 5,
    time: ts('2024-03-10'),
    text: 'Renata é excelente, comprometida e tem me ajudado muito.',
  },
  {
    author_name: 'Débora Matos',
    rating: 5,
    time: ts('2024-02-28'),
    text: 'Profissional excelente! Super indico.',
  },
  {
    author_name: 'Beatriz Belarmino',
    rating: 5,
    time: ts('2024-02-15'),
    text: 'A melhor psicóloga que existe!',
  },
];

// ─── Google Logo ──────────────────────────────────────────────────────────────
const GoogleLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

// ─── Paleta de cores para avatares ────────────────────────────────────────────
const AVATAR_COLORS = [
  '#8e24aa', '#1565c0', '#ef6c00', '#00897b',
  '#c62828', '#283593', '#558b2f', '#4e342e',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Card de avaliação ────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const initial = review.author_name.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(review.author_name);

  // Calculado apenas no cliente para evitar hydration mismatch:
  // o servidor renderiza string vazia; após montar, o cliente atualiza com o valor real.
  const [relativeTime, setRelativeTime] = useState('');
  useEffect(() => {
    setRelativeTime(getRelativeTime(review.time));
  }, [review.time]);

  const MAX_CHARS = 150;
  const isLong = review.text.length > MAX_CHARS;

  return (
    <div className={styles.card}>
      {/* Cabeçalho do usuário */}
      <div className={styles.userInfo}>
        <div
          className={styles.avatar}
          style={{ backgroundColor: avatarColor }}
          aria-hidden="true"
        >
          {initial}
        </div>
        <div className={styles.meta}>
          <span className={styles.userName}>{review.author_name}</span>
          {/* O atributo dateTime usa o ISO real; o texto visível é calculado dinamicamente */}
          <time
            className={styles.timeAgo}
            dateTime={new Date(review.time * 1000).toISOString()}
            title={new Date(review.time * 1000).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          >
            {relativeTime}
          </time>
        </div>
      </div>

      {/* Estrelas */}
      <div className={styles.stars} aria-label={`${review.rating} de 5 estrelas`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < review.rating ? '#fbbc04' : 'none'}
            color={i < review.rating ? '#fbbc04' : '#dadce0'}
            strokeWidth={1.5}
          />
        ))}
      </div>

      {/* Texto */}
      {review.text && (
        <p className={styles.reviewText}>
          {isLong && !expanded
            ? `${review.text.slice(0, MAX_CHARS)}…`
            : review.text}
          {isLong && (
            <button
              className={styles.expandBtn}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? ' menos' : ' mais'}
            </button>
          )}
        </p>
      )}

      {/* Rodapé Google */}
      <div className={styles.reviewFooter}>
        <GoogleLogo />
        <span className={styles.footerLabel}>Google</span>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
const GoogleReviews: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  // Show only 4 reviews by default
  const displayedReviews = showAll ? REVIEWS : REVIEWS.slice(0, 4);

  return (
    <section className={styles.container} aria-label="Avaliações no Google">
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>O que dizem nossos pacientes</h2>

        <div className={styles.ratingBadge}>
          <div className={styles.ratingScore}>5,0</div>
          <div className={styles.ratingInfo}>
            <div className={styles.stars} aria-label="5 de 5 estrelas">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={17} fill="#fbbc04" color="#fbbc04" strokeWidth={1.5} />
              ))}
            </div>
            <div className={styles.ratingMeta}>
              <span>15 avaliações</span>
              <span className={styles.separator}>·</span>
              <GoogleLogo />
              <span>Google</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de cards */}
      <div className={styles.grid}>
        {displayedReviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>

      {/* Botão Ver Mais e Link externo */}
      <div className={styles.linkContainer}>
        {!showAll && REVIEWS.length > 4 && (
          <button
            onClick={() => setShowAll(true)}
            className={styles.viewMoreBtn}
          >
            Ver mais avaliações
          </button>
        )}

        <a
          href="https://www.google.com/maps/place/Renata+C+Ribeiro+%E2%80%93+Psic%C3%B3loga+%26+Neuropsic%C3%B3loga/@-23.5308753,-46.6589169,17z"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label="Ver todas as avaliações no Google Maps"
        >
          Ver todas as avaliações no Google
          <ExternalLink size={13} className={styles.linkIcon} />
        </a>
      </div>
    </section>
  );
};

export default GoogleReviews;

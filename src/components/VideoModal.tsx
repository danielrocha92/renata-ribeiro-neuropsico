// src/components/VideoModal.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, X } from 'lucide-react';
import styles from '@/styles/VideoModal.module.css';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface VideoItem {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  /** URL da thumbnail (opcional — usa gradiente se omitido) */
  thumbnail?: string;
}

interface VideoModalProps {
  /** Mantido para retrocompatibilidade — vídeo principal */
  videoUrl?: string;
  /** Lista de vídeos (se fornecida, substitui videoUrl) */
  videos?: VideoItem[];
}

// ─── Vídeos padrão ────────────────────────────────────────────────────────────
const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'linkedin-1',
    title: 'Saúde Mental e Bem-estar',
    description: 'Dicas e reflexões sobre saúde mental e neuropsicologia.',
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:activity:7029232180379693056',
  },
];

// ─── Card de vídeo ─────────────────────────────────────────────────────────────
function VideoCard({
  video,
  onPlay,
}: {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
}) {
  return (
    <div className={styles.videoCard}>
      <button
        className={styles.thumbnail}
        onClick={() => onPlay(video)}
        aria-label={`Reproduzir: ${video.title}`}
        style={video.thumbnail ? { backgroundImage: `url(${video.thumbnail})` } : undefined}
      >
        <span className={styles.playButton} aria-hidden="true">
          <Play size={36} fill="white" color="white" />
        </span>
      </button>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{video.title}</h3>
        <p className={styles.cardDescription}>{video.description}</p>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({
  video,
  onClose,
}: {
  video: VideoItem;
  onClose: () => void;
}) {
  // Fechar com Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    // Trava o scroll do body enquanto modal está aberto
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Reproduzindo: ${video.title}`}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Botão fechar */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar vídeo">
          <X size={22} />
        </button>

        {/* Player com proporção 16:9 */}
        <div className={styles.videoAspectRatioBox}>
          <iframe
            src={`${video.embedUrl}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        <p className={styles.modalCaption}>{video.title}</p>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function VideoModal({ videoUrl, videos }: VideoModalProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Monta a lista final: props.videos > DEFAULT + videoUrl legado
  const videoList: VideoItem[] = videos ?? (
    videoUrl
      ? [{ ...DEFAULT_VIDEOS[0], embedUrl: videoUrl }]
      : DEFAULT_VIDEOS
  );

  const handleClose = useCallback(() => setActiveVideo(null), []);

  return (
    <>
      <section id="conteudo-videos" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Conteúdo e Vídeos</h2>
          <p className={styles.sectionSubtitle}>
            Reflexões sobre saúde mental, neuropsicologia e bem-estar.
          </p>
        </div>

        <div className={styles.grid}>
          {videoList.map((v) => (
            <VideoCard key={v.id} video={v} onPlay={setActiveVideo} />
          ))}
        </div>
      </section>

      {activeVideo && <Modal video={activeVideo} onClose={handleClose} />}
    </>
  );
}

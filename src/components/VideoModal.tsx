// src/components/VideoModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/VideoModal.module.css';

interface VideoModalProps {
  videoUrl: string;
}

export default function VideoModal({ videoUrl }: VideoModalProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setModalOpen(false);
  };

  useEffect(() => {
    const iframeElement = iframeRef.current;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setModalOpen(false);
      }
    };

    if (isModalOpen && iframeElement) {
      try {
        iframeElement.requestFullscreen();
      } catch (error) {
        console.error("Fullscreen request failed: ", error);
        // Fallback for browsers that don't support it or if the request is denied
        setModalOpen(true);
      }
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen]);

  return (
    <>
      <section id="video-modal-section" className={styles.videoModalSection}>
        <h2 className={styles.sectionTitle}>Conteúdo e Vídeos</h2>
        <p className={styles.sectionSubtitle}>
          Assista a um vídeo com dicas e reflexões sobre saúde mental e neuropsicologia.
        </p>
        <div onClick={openModal} className={styles.thumbnail}>
          <div className={styles.playButton}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className={styles.videoModal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeBtn} onClick={closeModal}>&times;</span>
            <div className={styles.videoAspectRatioBox}>
              <iframe
                ref={iframeRef}
                width="100%"
                height="100%"
                src={videoUrl}
                title="LinkedIn Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

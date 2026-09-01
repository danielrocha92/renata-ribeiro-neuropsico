// src/components/Galeria.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Galeria.module.css';

const images = [
  '200D8E41-A07D-43C0-AE63-B54E1A557059.jpg',
  '72EA3807-C817-46FA-905A-72E73719AA1A.jpg',
  'DSC06216.jpeg',
  'DSC06220.jpeg',
  'DSC06222.jpeg',
  'DSC06235.jpeg',
  'DSC06248.jpeg',
  'DSC06249.jpeg',
  'DSC06252-2.jpeg',
  'DSC06256.jpeg',
  'DSC06260-3.jpeg',
  'DSC06260.jpeg',
  'DSC06264.jpeg',
  'DSC06267.jpeg',
  'DSC06272-2.jpeg',
  'DSC06280.jpeg',
  'DSC06293.jpeg',
  'DSC06308.jpeg',
  'EB0B8C61-A6A2-40A7-8A5E-229471933A78.jpg'
];

const videos = [
  'VID_20260727215952062.mp4',
  'VID_20260727220905101.mp4',
  'VID_20260727221024928.mp4'
];

export default function Galeria() {
  return (
    <section id="espaco" className={styles.galeriaSection}>
      <h2 className={styles.title}>O Nosso Espaço</h2>
      <p className={styles.subtitle}>
        Um ambiente planejado com muito carinho para oferecer conforto, segurança e acolhimento em cada atendimento. Sinta-se em casa.
      </p>
      
      <div className={styles.grid}>
        {videos.map((video, idx) => (
          <div key={`vid-${idx}`} className={`${styles.item} ${styles.videoItem}`}>
            <video 
              className={styles.video} 
              src={`/galeria/${video}`} 
              controls 
              preload="metadata"
            >
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
        ))}
        
        {images.map((img, idx) => (
          <div key={`img-${idx}`} className={styles.item}>
            <Image
              src={`/galeria/${img}`}
              alt={`Foto do Espaço ${idx + 1}`}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

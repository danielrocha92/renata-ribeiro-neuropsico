// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import utils from '@/styles/Utils.module.css';
import VideoModal from '@/components/VideoModal';

// --- Ícones SVG para a seção de serviços ---
const OnlineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.serviceIcon}><path d="M12 2a5 5 0 0 0-5 5c0 1.84.96 3.52 2.45 4.4a5.99 5.99 0 0 1-2.42 4.54C4.59 18.29 3 20.5 3 22h18c0-1.5-1.59-3.71-4.03-5.06a5.99 5.99 0 0 1-2.42-4.54C16.04 10.52 17 8.84 17 7a5 5 0 0 0-5-5z" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.serviceIcon}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h-3A2.5 2.5 0 0 1 4 4.5v0A2.5 2.5 0 0 1 6.5 2h3Z" /><path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h-3a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 11.5 2h3Z" /><path d="M12 12a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 12 17h0a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 12 12Z" /><path d="M4.5 9.5A2.5 2.5 0 0 1 7 12v0a2.5 2.5 0 0 1-2.5 2.5h-2A2.5 2.5 0 0 1 0 12v0A2.5 2.5 0 0 1 2.5 9.5h2Z" /><path d="M19.5 9.5a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5h-2a2.5 2.5 0 0 1-2.5-2.5v0a2.5 2.5 0 0 1 2.5-2.5h2Z" /><path d="M9.5 16.5A2.5 2.5 0 0 1 12 19v0a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 4 19v0a2.5 2.5 0 0 1 2.5-2.5h3Z" /><path d="M14.5 16.5a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5v0a2.5 2.5 0 0 1 2.5-2.5h3Z" /></svg>
);
const PsychologyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.serviceIcon}><path d="M12 2a5 5 0 0 0-5 5c0 1.84.96 3.52 2.45 4.4a5.99 5.99 0 0 1-2.42 4.54C4.59 18.29 3 20.5 3 22h18c0-1.5-1.59-3.71-4.03-5.06a5.99 5.99 0 0 1-2.42-4.54C16.04 10.52 17 8.84 17 7a5 5 0 0 0-5-5z" /></svg>
);
const CollaborationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.serviceIcon}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export default function Home() {
  // Efeito de fade-in ao rolar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(`.${styles.fadeIn}`);
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  const servicos = [
    {
      icon: <OnlineIcon />,
      title: 'Psicoterapia Online',
      description: 'Os atendimentos são realizados através do Google Meet, em ambiente confidencial e seguro.',
    },
    {
      icon: <BrainIcon />,
      title: 'Avaliação Neuropsicológica Presencial',
      description: 'A avaliação neuropsicológica é um processo clínico-científico que tem como objetivo compreender o funcionamento cognitivo, emocional e comportamental de uma pessoa.',
    },
    {
      icon: <PsychologyIcon />,
      title: 'Avaliação Psicológica',
      description: 'A avaliação psicológica busca compreender aspectos emocionais, comportamentais e de personalidade, auxiliando no autoconhecimento e na tomada de decisões em diferentes contextos.',
    },
    {
      icon: <CollaborationIcon />,
      title: 'Colaboração, Consultoria & Supervisão',
      description: 'Ofereço consultoria e supervisão clínica para psicólogos e profissionais em formação que desejam aprimorar o raciocínio clínico, o uso de instrumentos psicológicos e a condução de casos.',
    },
  ];

  return (
    <main className={styles.main}>
      {/* --- Hero Section --- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} ${styles.fadeIn}`}>
            Cuidar da mente é o primeiro passo para uma vida plena.
          </h1>
          <p className={`${styles.subtitle} ${styles.fadeIn}`}>
            Ofereço um atendimento psicológico e neuropsicológico ético e personalizado, focado em suas necessidades e bem-estar.
          </p>
          <Link href="/contato" passHref>
            <button className={`${styles.ctaButton} ${styles.fadeIn}`}>
              Agende uma Conversa
            </button>
          </Link>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="sobre" className={`${styles.aboutSection} ${styles.fadeIn}`}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutImage}>
            <Image
              src="/Profile.jpeg"
              alt="Renata Ribeiro, Neuropsicóloga"
              width={300}
              height={300}
              className={styles.profilePic}
            />
          </div>
          <div className={styles.aboutText}>
            <h2>Sobre Mim</h2>
            <p>
              Olá, sou Renata Ribeiro, psicóloga e neuropsicóloga. Ofereço um atendimento integrativo e humanizado, combinando psicoterapia e avaliação neuropsicológica para promover o autoconhecimento e o bem-estar.
            </p>
            <p>
              Meu objetivo é criar um ambiente seguro e acolhedor, onde você possa explorar suas emoções e conquistar uma vida mais equilibrada e feliz.
            </p>
            <span>Renata C. Ribeiro - Psicóloga e Neuropsicóloga | CRP 06/195299</span>
          </div>
        </div>
      </section>

      {/* --- Services Section --- */}
      <section id="servicos" className={styles.servicesSection}>
        <h2 className={`${styles.sectionTitle} ${styles.fadeIn}`}>Serviços</h2>
        <div className={`${styles.servicesGrid} ${styles.fadeIn}`}>
          {servicos.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              {service.icon}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Video Modal Section --- */}
      <VideoModal videoUrl="https://www.linkedin.com/embed/feed/update/urn:li:activity:7029232180379693056?autoplay=1" />

      {/* --- Location Section --- */}
      <section id="localizacao" className={`${styles.locationSection} ${styles.fadeIn}`}>
        <h2 className={styles.sectionTitle}>Onde me encontrar</h2>
        <p className={styles.sectionSubtitle}>Atendimento presencial em São Paulo, SP.</p>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.289087109116!2d-46.6637878!3d-23.5308703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef93c48e13f65%3A0x463f20561ff49c33!2sRenata%20C%20Ribeiro%20%E2%80%93%20Psic%C3%B3loga%20%26%20Neuropsic%C3%B3loga!5e0!3m2!1spt-BR!2sbr!4v1707693900000!5m2!1spt-BR!2sbr"
            width="100%"
            height="400"
            className={utils.noBorder}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* --- Calendar Section --- */}
      <section id="agenda" className={`${styles.calendarSection} ${styles.fadeIn}`}>
        <h2 className={styles.sectionTitle}>Agende sua Consulta</h2>
        <p className={styles.sectionSubtitle}>
          Veja os horários disponíveis e agende sua consulta diretamente pelo calendário.
        </p>
        <div className={styles.calendarContainer}>
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FSao_Paulo&bgcolor=%23ffffff&showTitle=0&showNav=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&src=YOUR_CALENDAR_ID&color=%238a63d2"
            className={utils.noBorder}
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
        <p className={styles.calendarHint}>
          Clique nos eventos para mais detalhes ou para agendar sua consulta.
        </p>
      </section>
    </main>
  );
}
// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import utils from '@/styles/Utils.module.css';
import InstagramEmbed from '@/components/InstagramEmbed';
import GoogleReviews from '@/components/GoogleReviews';
import FAQ from '@/components/FAQ';

import { Video, Brain, ClipboardList, Users } from 'lucide-react';

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
      icon: <Video className={styles.serviceIcon} size={48} strokeWidth={1.5} />,
      title: 'Psicoterapia Online',
      description: 'Os atendimentos são realizados através do Google Meet, em ambiente confidencial e seguro.',
    },
    {
      icon: <Brain className={styles.serviceIcon} size={48} strokeWidth={1.5} />,
      title: 'Avaliação Neuropsicológica Presencial',
      description: 'A avaliação neuropsicológica é um processo clínico-científico que tem como objetivo compreender o funcionamento cognitivo, emocional e comportamental de uma pessoa.',
    },
    {
      icon: <ClipboardList className={styles.serviceIcon} size={48} strokeWidth={1.5} />,
      title: 'Avaliação Psicológica',
      description: 'A avaliação psicológica busca compreender aspectos emocionais, comportamentais e de personalidade, auxiliando no autoconhecimento e na tomada de decisões em diferentes contextos.',
    },
    {
      icon: <Users className={styles.serviceIcon} size={48} strokeWidth={1.5} />,
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

      {/* --- Conteúdo e Vídeos Section --- */}
      <InstagramEmbed />

      {/* --- Google Reviews Section --- */}
      <GoogleReviews />

      {/* --- FAQ Section --- */}
      <FAQ />

      {/* --- Location Section --- */}
      <section id="localizacao" className={`${styles.locationSection} ${styles.fadeIn}`}>
        <h2 className={styles.sectionTitle}>Onde me encontrar</h2>
        <p className={styles.sectionSubtitle}>R. Mário de Andrade, 48 - conjunto 1710 - Barra Funda, São Paulo - SP, 05281-060</p>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7316.090491854834!2d-46.658917!3d-23.530875!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef93c48e13f65%3A0x463f20561ff49c33!2sRenata%20C%20Ribeiro%20%E2%80%93%20Psic%C3%B3loga%20%26%20Neuropsic%C3%B3loga!5e0!3m2!1spt-BR!2sbr!4v1769612419142!5m2!1spt-BR!2sbr"
            width="100%"
            height="400"
            className={utils.noBorder}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

    </main>
  );
}
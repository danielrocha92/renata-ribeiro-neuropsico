'use client';

import React from 'react';
import RequestAppointment from '@/components/RequestAppointment';
import styles from '@/styles/Contato.module.css';

const ContatoPage: React.FC = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Agende sua Consulta</h1>
        <p className={styles.subtitle}>
          Preencha o formulário abaixo para solicitar seu horário. Entraremos em contato em breve para confirmar.
        </p>
        <RequestAppointment />
      </div>
    </main>
  );
};

export default ContatoPage;
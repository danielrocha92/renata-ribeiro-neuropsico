'use client';

import React from 'react';
import styles from '@/styles/Contato.module.css';

const ContatoPage: React.FC = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Entre em Contato</h1>
          <p className={styles.subtitle}>
            Preencha o formulário abaixo para enviar uma mensagem.
          </p>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Mensagem</label>
              <textarea id="message" name="message" rows={5} required></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>Enviar</button>
          </form>
        </div>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.072832242412!2d-46.65686388533719!3d-23.56407238468107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59a6b6a6a6a7%3A0x7d7b3b3b3b3b3b3b!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </main>
  );
};

export default ContatoPage;
'use client';

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import styles from '@/styles/Contato.module.css';
import utils from '@/styles/Utils.module.css';

const ContatoPage: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);

    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      console.error("EmailJS environment variables are missing.");
      setError(true);
      setLoading(false);
      return;
    }

    if (form.current) {
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          form.current,
          {
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
          }
        )
        .then(
          () => {
            setSuccess(true);
            setLoading(false);
            if (form.current) form.current.reset();
          },
          (error) => {
            console.error('FAILED...', error.text);
            setError(true);
            setLoading(false);
          },
        );
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Entre em Contato</h1>
          <p className={styles.subtitle}>
            Preencha o formulário abaixo para enviar uma mensagem.
          </p>
          <form className={styles.form} ref={form} onSubmit={sendEmail}>
            <div className={styles.formGroup}>
              <label htmlFor="user_name">Nome</label>
              <input type="text" id="user_name" name="user_name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="user_email">Email</label>
              <input type="email" id="user_email" name="user_email" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Mensagem</label>
              <textarea id="message" name="message" rows={5} required></textarea>
            </div>
            <button
              type="submit"
              className={`${styles.submitButton} ${loading ? utils.buttonDisabled : ''}`}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
            {success && <p className={styles.successMessage}>Mensagem enviada com sucesso!</p>}
            {error && <p className={styles.errorMessage}>Ocorreu um erro ao enviar a mensagem. Tente novamente.</p>}
          </form>
        </div>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.072832242412!2d-46.65686388533719!3d-23.56407238468107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59a6b6a6a6a7%3A0x7d7b3b3b3b3b3b3b!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            className={utils.noBorder}
            allowFullScreen={false}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </main>
  );
};

export default ContatoPage;
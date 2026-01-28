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
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7316.090491854834!2d-46.658917!3d-23.530875!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef93c48e13f65%3A0x463f20561ff49c33!2sRenata%20C%20Ribeiro%20%E2%80%93%20Psic%C3%B3loga%20%26%20Neuropsic%C3%B3loga!5e0!3m2!1spt-BR!2sbr!4v1769612419142!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            className={utils.noBorder}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </main>
  );
};

export default ContatoPage;
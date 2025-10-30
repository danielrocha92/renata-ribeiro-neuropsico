'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from '@/styles/Contato.module.css';

const RequestAppointment: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!db) {
      setError("O serviço de agendamento não está disponível. Tente novamente mais tarde.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        name,
        email,
        phone,

        message,

        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      setError("Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.confirmationMessage}>
        <h2>Obrigado!</h2>
        <p>Sua solicitação de agendamento foi enviada com sucesso. Entraremos em contato em breve para confirmar.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="name">Nome Completo</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="phone">Telefone (WhatsApp)</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>





      <div className={styles.inputGroup}>
        <label htmlFor="message">Mensagem (Opcional)</label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      <button type="submit" className={styles.button} disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Solicitar Agendamento'}
      </button>
    </form>
  );
};

export default RequestAppointment;
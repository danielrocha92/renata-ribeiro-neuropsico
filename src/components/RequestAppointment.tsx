'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './RequestAppointment.module.css';

import { useAuth } from '@/contexts/AuthContext';

const RequestAppointment: React.FC = () => {
  const { user } = useAuth(); // Get user from Auth context
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

    if (!user) {
      setError("Você precisa estar logado para solicitar um agendamento.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        patientName: user.displayName,
        patientEmail: user.email,
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
        <label htmlFor="message">Mensagem (Opcional)</label>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '0 0 8px 0' }}>
          Se desejar, descreva brevemente o motivo da consulta ou seus horários de preferência.
        </p>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      <button type="submit" className={styles.button} disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Confirmar Solicitação'}
      </button>
    </form>
  );
};

export default RequestAppointment;
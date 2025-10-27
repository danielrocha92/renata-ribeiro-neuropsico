'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const RequestAppointment: React.FC = () => {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [psychologistId, setPsychologistId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Find the psychologist to assign the appointment to
  useEffect(() => {
    const findPsychologist = async () => {
      if (!db) return;
      const q = query(collection(db, "users"), where("userType", "==", "psicologo"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Assign to the first psychologist found
        setPsychologistId(querySnapshot.docs[0].id);
      } else {
        setError("Nenhum psicólogo encontrado para agendar.");
      }
    };
    findPsychologist();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !psychologistId || !date || !time) {
      setError("Por favor, preencha a data e a hora.");
      return;
    }
    if (!db) {
        setError("Banco de dados indisponível.");
        return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const appointmentDateTime = new Date(`${date}T${time}`);

      await addDoc(collection(db, "appointments"), {
        patientId: user.uid,
        psychologistId: psychologistId,
        date: appointmentDateTime,
        title: title || "Sessão solicitada",
        status: 'Pendente',
        createdAt: serverTimestamp(),
      });

      setMessage("Sua solicitação de agendamento foi enviada com sucesso!");
      setDate('');
      setTime('');
      setTitle('');
    } catch (err) {
      console.error("Error requesting appointment: ", err);
      setError("Ocorreu um erro ao enviar sua solicitação.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      <h3>Solicitar Novo Agendamento</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <input 
        type="date" 
        value={date} 
        onChange={e => setDate(e.target.value)} 
        required 
      />
      <input 
        type="time" 
        value={time} 
        onChange={e => setTime(e.target.value)} 
        required 
      />
      <input 
        type="text"
        placeholder="Motivo da consulta (opcional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button type="submit" disabled={submitting || !psychologistId}>
        {submitting ? 'Enviando...' : 'Enviar Solicitação'}
      </button>
    </form>
  );
};

export default RequestAppointment;

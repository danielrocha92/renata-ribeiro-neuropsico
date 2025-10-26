'use client';

import React from 'react';
import styles from '../../styles/Cliente.module.css';
import PrivateRoute from '../../components/PrivateRoute';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Mock Data - Replace with Firestore data later
const mockAppointments = [
  { id: 1, date: '2025-11-15T14:00:00', type: 'Sessão de Terapia Cognitivo-Comportamental', status: 'Confirmado' },
  { id: 2, date: '2025-11-22T14:00:00', type: 'Sessão de Terapia Cognitivo-Comportamental', status: 'Confirmado' },
  { id: 3, date: '2025-10-29T10:00:00', type: 'Avaliação Neuropsicológica', status: 'Realizada' },
];

const mockDocuments = [
  { id: 1, name: 'Relatório de Avaliação Inicial.pdf', date: '2025-10-30', url: '#' },
  { id: 2, name: 'Exercícios de Reabilitação Cognitiva - Semana 1.pdf', date: '2025-11-05', url: '#' },
];

const ClientePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  const upcomingAppointments = mockAppointments.filter(a => new Date(a.date) > new Date());
  const pastAppointments = mockAppointments.filter(a => new Date(a.date) <= new Date());

  return (
    <PrivateRoute>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Bem-vindo(a), {user?.displayName || 'Cliente'}!</h1>
            <p className={styles.subtitle}>Este é o seu portal seguro de acompanhamento.</p>
          </div>
          <div className={styles.userActions}>
             <p className={styles.userEmail}>{user?.email}</p>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Sair
            </button>
          </div>
        </header>

        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Próximos Agendamentos</h2>
            <div className={styles.cardList}>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(app => (
                  <div key={app.id} className={styles.card}>
                    <h4>{app.type}</h4>
                    <p>Data: {new Date(app.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                    <p>Horário: {new Date(app.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                    <span className={`${styles.status} ${styles.statusConfirmed}`}>{app.status}</span>
                  </div>
                ))
              ) : (
                <p>Nenhum agendamento futuro.</p>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Documentos e Materiais</h2>
            <div className={styles.cardList}>
              {mockDocuments.length > 0 ? (
                mockDocuments.map(doc => (
                  <div key={doc.id} className={`${styles.card} ${styles.documentCard}`}>
                    <h4>{doc.name}</h4>
                    <p>Enviado em: {new Date(doc.date).toLocaleDateString('pt-BR')}</p>
                    <a href={doc.url} download className={styles.downloadButton}>Baixar</a>
                  </div>
                ))
              ) : (
                <p>Nenhum documento compartilhado.</p>
              )}
            </div>
          </section>
          
          <section className={styles.section}>
            <h2>Histórico de Sessões</h2>
            <div className={styles.cardList}>
              {pastAppointments.length > 0 ? (
                pastAppointments.map(app => (
                  <div key={app.id} className={`${styles.card} ${styles.pastCard}`}>
                    <h4>{app.type}</h4>
                    <p>Data: {new Date(app.date).toLocaleDateString('pt-BR')}</p>
                    <span className={`${styles.status} ${styles.statusCompleted}`}>{app.status}</span>
                  </div>
                ))
              ) : (
                <p>Nenhuma sessão no histórico.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </PrivateRoute>
  );
};

export default ClientePage;
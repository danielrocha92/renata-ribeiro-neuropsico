'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles/Cliente.module.css';
import PrivateRoute from '../../components/PrivateRoute';
import RequestAppointment from '../../components/RequestAppointment'; // Import the new component
import { useAuth } from '../../contexts/AuthContext';
import { auth, db } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

// Define interfaces for our data
interface Appointment {
  id: string;
  date: Timestamp;
  title: string;
  status: string;
}

interface Document {
  id: string;
  fileName: string;
  fileURL: string;
  uploadedAt: Timestamp;
}

const ClientePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch appointments
        const appQuery = query(collection(db, "appointments"), where("patientId", "==", user.uid));
        const appSnapshot = await getDocs(appQuery);
        const appList = appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
        setAppointments(appList);

        // Fetch documents
        const docQuery = query(collection(db, "documents"), where("patientId", "==", user.uid));
        const docSnapshot = await getDocs(docQuery);
        const docList = docSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
        setDocuments(docList);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  const upcomingAppointments = appointments.filter(a => a.date.toDate() > new Date());
  const pastAppointments = appointments.filter(a => a.date.toDate() <= new Date());

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
          {loading ? <p>Carregando seus dados...</p> : (
            <>
              <section className={styles.section}>
                <h2>Próximos Agendamentos</h2>
                <div className={styles.cardList}>
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map(app => (
                      <div key={app.id} className={styles.card}>
                        <h4>{app.title}</h4>
                        <p>Data: {app.date.toDate().toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                        <p>Horário: {app.date.toDate().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
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
                  {documents.length > 0 ? (
                    documents.map(doc => (
                      <div key={doc.id} className={`${styles.card} ${styles.documentCard}`}>
                        <h4>{doc.fileName}</h4>
                        <p>Enviado em: {doc.uploadedAt.toDate().toLocaleDateString('pt-BR')}</p>
                        <a href={doc.fileURL} target="_blank" rel="noopener noreferrer" className={styles.downloadButton}>Ver/Baixar</a>
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
                        <h4>{app.title}</h4>
                        <p>Data: {app.date.toDate().toLocaleDateString('pt-BR')}</p>
                        <span className={`${styles.status} ${styles.statusCompleted}`}>{app.status}</span>
                      </div>
                    ))
                  ) : (
                    <p>Nenhuma sessão no histórico.</p>
                  )}
                </div>
              </section>

              <section className={styles.section}>
                <RequestAppointment />
              </section>
            </>
          )}
        </main>
      </div>
    </PrivateRoute>
  );
};

export default ClientePage;
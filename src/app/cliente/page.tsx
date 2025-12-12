'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles/Cliente.module.css';
import PrivateRoute from '../../components/PrivateRoute';
import BookingCalendar from '@/components/BookingCalendar';
import { useAuth } from '../../contexts/AuthContext';
import { auth, db } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';

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
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkCalendarConnection = async () => {
      if (!user || !db) return;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().googleRefreshToken) {
        setIsCalendarConnected(true);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        if (!db) return;
        // Fetch appointments
        const appQuery = query(collection(db, "appointments"), where("patientId", "==", user.uid));
        const appSnapshot = await getDocs(appQuery);
        const apps = appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
        setAppointments(apps);

        // Fetch documents
        const docQuery = query(collection(db, "documents"), where("patientId", "==", user.uid));
        const docSnapshot = await getDocs(docQuery);
        const docs = docSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
        setDocuments(docs);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCalendarConnection();
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleConnectCalendar = () => {
    if (!user) return;
    const redirectUrl = `/api/auth/google/redirect?userId=${user.uid}`;
    // Use window.location.href instead of router.push to force a full page navigation.
    // This avoids CORS errors because the browser handles the redirect directly,
    // rather than initiating a fetch request from client-side code.
    window.location.href = redirectUrl;
  };

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.welcomeMessage}>
            <h1>Bem-vindo(a) à sua área, {user?.displayName || 'Cliente'}!</h1>
            <p>Aqui você pode gerenciar seus agendamentos e documentos.</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
        </header>

        {loading ? (
          <p className={styles.loading}>Carregando dados...</p>
        ) : (
          <div className={styles.mainContent}>
            <div className={styles.leftColumn}>
              <section className={styles.section}>
                <h2>Google Calendar</h2>
                {isCalendarConnected ? (
                  <p>Seu Google Calendar está conectado.</p>
                ) : (
                  <button onClick={handleConnectCalendar} className={styles.connectButton}>
                    Conectar Google Calendar
                  </button>
                )}
              </section>

              <section className={styles.section}>
                <h2>Meus Agendamentos</h2>
                {appointments.length > 0 ? (
                  <ul className={styles.appointmentList}>
                    {appointments.map(app => (
                      <li key={app.id} className={styles.appointmentItem}>
                        <div className={styles.appointmentDetails}>
                          <span>{app.title}</span>
                          <span>{new Date(app.date.seconds * 1000).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <span className={`${styles.status} ${styles[app.status.toLowerCase()]}`}>{app.status}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noData}>Nenhum agendamento encontrado.</p>
                )}
              </section>

              <section className={styles.section}>
                <h2>Meus Documentos</h2>
                {documents.length > 0 ? (
                  <ul className={styles.documentList}>
                    {documents.map(doc => (
                      <li key={doc.id} className={styles.documentItem}>
                        <a href={doc.fileURL} target="_blank" rel="noopener noreferrer">{doc.fileName}</a>
                        <span>Enviado em: {new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString('pt-BR')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noData}>Nenhum documento encontrado.</p>
                )}
              </section>
            </div>

            <div className={styles.rightColumn}>
              <section className={styles.requestSection}>
                <h2>Agende sua Consulta</h2>
                <BookingCalendar />
              </section>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default ClientePage;

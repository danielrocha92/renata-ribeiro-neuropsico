'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles/Cliente.module.css';
import PrivateRoute from '../../components/PrivateRoute';
import RequestAppointment from '../../components/RequestAppointment'; // Import the new component
import { useAuth } from '../../contexts/AuthContext';
import { auth, db } from '../../lib/firebase'; // db aqui pode ser 'Firestore | null'
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
    // Esta verificação inicial é ótima, evita rodar a função desnecessariamente
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      // --- CORREÇÃO APLICADA ---
      // Adicionamos esta verificação de 'db' *dentro* da função async.
      // O TypeScript precisa saber que 'db' não é nulo no momento
      // exato em que é usado pela função `collection()`.
      if (!db) {
        console.error("Conexão com o Firestore (db) ainda não está pronta.");
        setLoading(false); // Para o loading
        return; // Sai da função para evitar o erro
      }
      
      // A partir daqui, o TypeScript sabe que 'db' é válido (não-nulo)
      try {
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

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Área do Cliente</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
        </header>

        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <>
            <section className={styles.section}>
              <h2>Meus Agendamentos</h2>
              {appointments.length > 0 ? (
                <ul className={styles.appointmentList}>
                  {appointments.map(app => (
                    <li key={app.id} className={styles.appointmentItem}>
                      <span>{app.title}</span>
                      <span>{new Date(app.date.seconds * 1000).toLocaleDateString()}</span>
                      <span className={`${styles.status} ${styles[app.status.toLowerCase()]}`}>{app.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum agendamento encontrado.</p>
              )}
            </section>

            <section className={styles.section}>
              <h2>Meus Documentos</h2>
              {documents.length > 0 ? (
                <ul className={styles.documentList}>
                  {documents.map(doc => (
                    <li key={doc.id} className={styles.documentItem}>
                      <a href={doc.fileURL} target="_blank" rel="noopener noreferrer">{doc.fileName}</a>
                      <span>{new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum documento encontrado.</p>
              )}
            </section>

            <RequestAppointment />

          </>
        )}
      </div>
    </PrivateRoute>
  );
};

export default ClientePage;
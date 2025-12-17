'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles/Cliente.module.css';
import PrivateRoute from '../../components/PrivateRoute';
import BookingCalendar from '@/components/BookingCalendar';
import { useAuth } from '../../contexts/AuthContext';
import { auth, db } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  Video,
  FileText,
  CreditCard,
  MessageCircle,
  BookOpen,
  Calendar,
  LogOut,
  HelpCircle
} from 'lucide-react';

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
    window.location.href = redirectUrl;
  };

  const handleCancelAppointment = async (appId: string) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;
    try {
      if (!db) return;
      await updateDoc(doc(db, "appointments", appId), {
        status: "cancelled"
      });
      // Update local state
      setAppointments(prev => prev.map(app =>
        app.id === appId ? { ...app, status: "cancelled" } : app
      ));
      alert("Agendamento cancelado com sucesso.");
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      alert("Erro ao cancelar agendamento.");
    }
  };

  const dashboardCards = [
    {
      title: "Teleterapia",
      icon: <Video className={styles.cardIcon} size={32} />,
      description: "Acesse sua sessão online segura.",
      action: () => router.push('/cliente/teleterapia'),
      active: true
    },
    {
      title: "Conteúdo Exclusivo",
      icon: <BookOpen className={styles.cardIcon} size={32} />,
      description: "Artigos, vídeos e exercícios para você.",
      action: () => router.push('/cliente/conteudo'),
      active: true
    },
    {
      title: "Prontuário e Histórico",
      icon: <FileText className={styles.cardIcon} size={32} />,
      description: "Resumo dos seus atendimentos.",
      action: () => router.push('/cliente/historico'),
      active: true
    },
    {
      title: "Financeiro",
      icon: <CreditCard className={styles.cardIcon} size={32} />,
      description: "Histórico de pagamentos e notas.",
      action: () => router.push('/cliente/financeiro'),
      active: true
    },
    {
      title: "Fale com o Profissional",
      icon: <MessageCircle className={styles.cardIcon} size={32} />,
      description: "Canal seguro de comunicação.",
      action: () => router.push('/cliente/chat'),
      active: true
    },
    {
      title: "Guia de Uso",
      icon: <HelpCircle className={styles.cardIcon} size={32} color="#FBC02D" />,
      description: "Aprenda como usar a plataforma.",
      action: () => router.push('/cliente/ajuda'),
      active: true
    }
  ];

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.welcomeMessage}>
            <h1>Área do Cliente</h1>
            <p>Olá, {user?.displayName || 'Cliente'}. Bem-vindo(a) ao seu espaço de saúde e bem-estar.</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton} title="Sair">
            <LogOut size={20} /> Sair
          </button>
        </header>

        {loading ? (
          <p className={styles.loading}>Carregando sua área...</p>
        ) : (
          <>
            {/* Quick Actions / Features Grid */}
            <div className={styles.dashboardGrid}>
              {dashboardCards.map((card, index) => (
                <div key={index} className={styles.card} onClick={card.action}>
                  {card.icon}
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>{card.description}</p>
                </div>
              ))}
            </div>

            <div className={styles.mainContent}>
              <div className={styles.leftColumn}>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2>Meus Agendamentos</h2>
                    <Calendar size={20} color="#666" />
                  </div>

                  {appointments.length > 0 ? (
                    <ul className={styles.appointmentList}>
                      {appointments.map(app => (
                        <li key={app.id} className={styles.appointmentItem}>
                          <div className={styles.appointmentDetails}>
                            <span>{app.title}</span>
                            <span>{new Date(app.date.seconds * 1000).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div>
                            <span className={`${styles.status} ${styles[app.status.toLowerCase()]}`}>{app.status}</span>
                            {app.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancelAppointment(app.id)}
                                className={styles.cancelButton}
                                title="Cancelar Agendamento"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.noData}>Você não possui agendamentos futuros.</p>
                  )}
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2>Meus Documentos</h2>
                    <FileText size={20} color="#666" />
                  </div>
                  {documents.length > 0 ? (
                    <ul className={styles.documentList}>
                      {documents.map(doc => (
                        <li key={doc.id} className={styles.documentItem}>
                          <a href={doc.fileURL} target="_blank" rel="noopener noreferrer">{doc.fileName}</a>
                          <span>{new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString('pt-BR')}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.noData}>Nenhum documento compartilhado ainda.</p>
                  )}
                </section>

                <section className={styles.section}>
                  <h2>Configurações</h2>
                  {!isCalendarConnected ? (
                    <div className={styles.settingItem}>
                      <p>Sincronize seus agendamentos com o Google Calendar.</p>
                      <button onClick={handleConnectCalendar} className={styles.connectButton}>
                        Conectar Google Calendar
                      </button>
                    </div>
                  ) : (
                    <p className={styles.successMessage}>✓ Google Calendar conectado.</p>
                  )}
                </section>
              </div>

              <div className={styles.rightColumn}>
                <section className={styles.requestSection}>
                  <h2>Agende Nova Sessão</h2>
                  <BookingCalendar />
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </PrivateRoute>
  );
};

export default ClientePage;

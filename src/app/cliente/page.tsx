'use client';

import React, { useState } from 'react';
import styles from '../../styles/Cliente.module.css';
import PrivateRoute from '../../components/PrivateRoute';
import BookingCalendar from '@/components/BookingCalendar';
import DashboardCard from '@/components/DashboardCard';
import { useAuth } from '../../contexts/AuthContext';
import { auth, db } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import {
  Video,
  FileText,
  CreditCard,
  MessageCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';

const ClientePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0);

  // Listen for pending appointments from Admin
  React.useEffect(() => {
    if (!user) return;

    // We want appointments where patientId is current user, status is pending, and createdBy is 'admin' (or just count all pending if we want)
    // The requirement says "se o paciente solicitar a consulta, deve chegar para o admin e vice e versa"
    // So for the Client, we want to know about requests created by Admin.

    // Assuming we will add 'createdBy' field. For now, we can check basic pending status.
    // If createdBy is missing (legacy), maybe don't show or assume one way.
    // Let's assume we will add createdBy field.

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", user.uid),
      where("status", "==", "pending"),
      where("createdBy", "==", "admin")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingAppointmentsCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [user]);


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
      active: true,
      notificationCount: pendingAppointmentsCount // Show badge here? Or on Teletherapy?
      // User said "crie uma notificação no card quando houver alguma interação."
      // Usually "Prontuário e Histórico" or "Resumo" makes sense for appointments,
      // but maybe "Teleterapia" if it's about the session.
      // Let's put it on "Prontuário e Histórico" as it handles records/appointments usually.
      // Actually, looking at the code, BookingCalendar is right there on the page.
      // But let's stick to the card.
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

        </header>

        {loading ? (
          <p className={styles.loading}>Carregando sua área...</p>
        ) : (
          <>
            {/* Quick Actions / Features Grid */}
            <div className={styles.dashboardGrid}>
              {dashboardCards.map((card, index) => (
                <DashboardCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  onClick={card.action}
                  variant={card.title === "Guia de Uso" ? "highlight" : "default"}
                  notificationCount={card.title === "Prontuário e Histórico" ? pendingAppointmentsCount : 0}
                />
              ))}
            </div>

            <div className={styles.mainContent}>
              <section className={styles.requestSection} style={{ width: '100%' }}>
                <h2>Agende Nova Sessão</h2>
                <BookingCalendar />
              </section>
            </div>
          </>
        )}
      </div>
    </PrivateRoute>
  );
};

export default ClientePage;

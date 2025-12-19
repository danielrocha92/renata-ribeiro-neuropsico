'use client';

import React, { useState } from 'react';
import styles from '@/styles/Cliente.module.css';
import utils from '@/styles/Utils.module.css';
import PrivateRoute from '@/components/PrivateRoute';
import BookingCalendar from '@/components/BookingCalendar';
import DashboardGrid, { DashboardItem } from '@/components/DashboardGrid';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
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


  const dashboardItems: DashboardItem[] = [
    {
      title: "Teleterapia",
      icon: <Video size={48} />,
      description: "Acesse sua sessão online segura.",
      variant: "highlight",
      onClick: () => router.push('/cliente/teleterapia')
    },
    {
      title: "Conteúdo Exclusivo",
      icon: <BookOpen size={48} />,
      description: "Artigos, vídeos e exercícios para você.",
      onClick: () => router.push('/cliente/conteudo')
    },
    {
      title: "Prontuário e Histórico",
      icon: <FileText size={48} />,
      description: "Resumo dos seus atendimentos.",
      onClick: () => router.push('/cliente/historico'),
      notificationCount: pendingAppointmentsCount
    },
    {
      title: "Financeiro",
      icon: <CreditCard size={48} />,
      description: "Histórico de pagamentos e notas.",
      onClick: () => router.push('/cliente/financeiro')
    },
    {
      title: "Fale com o Profissional",
      icon: <MessageCircle size={48} />,
      description: "Canal seguro de comunicação.",
      onClick: () => router.push('/cliente/chat')
    },
    {
      title: "Guia de Uso",
      icon: <HelpCircle size={48} color="#FBC02D" />,
      description: "Aprenda como usar a plataforma.",
      onClick: () => router.push('/cliente/ajuda')
    }
  ];

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Área do Cliente</h1>
          <p>Olá, {user?.displayName || 'Cliente'}. Bem-vindo(a) ao seu espaço de saúde e bem-estar.</p>
        </header>

        {loading ? (
          <p className={styles.loading}>Carregando sua área...</p>
        ) : (
          <>
            {/* Quick Actions / Features Grid */}
            <DashboardGrid items={dashboardItems} />

            <div className={styles.mainContent}>
              <section className={`${styles.requestSection} ${utils.w100}`}>
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

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
import { useDashboardNotifications } from '@/hooks/useDashboardNotifications';
import {
  Video,
  FileText,
  CreditCard,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

const ClientePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { appointments: pendingAppointmentsCount, messages: unreadMessagesCount, documents: unreadDocumentsCount } = useDashboardNotifications(user?.uid, 'client');
  const { events: calendarEvents } = useCalendarEvents({ userId: user?.uid, role: 'client' });

  const nextAppointments = calendarEvents
    .filter(e => e.type === 'appointment' && e.patientId === user?.uid && e.start > new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const upcomingAppointment = nextAppointments.length > 0 ? nextAppointments[0] : null;


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
      notificationCount: pendingAppointmentsCount + unreadDocumentsCount // Check both? Or just documents? Usually documents are here. Consultas are in calendar. But 'pendingAppointmentsCount' was here for 'Prontuário'? Actually user used it there. Let's keep pending appointments here but maybe it fits better in Calendar/Financeiro?
      // The previous code had `notificationCount: pendingAppointmentsCount` on "Prontuário e Histórico". But pending appointments are usually about future sessions.
      // However, I will stick to adding unreadDocumentsCount here as well.
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
      onClick: () => router.push('/cliente/chat'),
      notificationCount: unreadMessagesCount
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
            {/* Upcoming Appointment Alert */}
            {upcomingAppointment && (
              <div
                className={`${styles.nextAppointmentCard} ${utils.cursorPointer}`}
                onClick={() => router.push('/cliente/historico')}
                role="button"
                tabIndex={0}
              >
                <div className={styles.appointmentIcon}>
                  <Calendar size={36} />
                </div>
                <div>
                  <h3>Lembrete de Consulta</h3>
                  <p>
                    Você tem uma consulta agendada para: <strong>{upcomingAppointment.start.toLocaleString('pt-BR')}</strong>
                  </p>
                  {upcomingAppointment.status === 'pending' && <p className={styles.pendingText}>Aguardando confirmação.</p>}
                </div>
              </div>
            )}

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

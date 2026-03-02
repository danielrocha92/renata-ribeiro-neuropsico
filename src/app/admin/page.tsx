'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Admin.module.css';
import { BookOpen, CreditCard, MessageCircle, FileText, CalendarCheck, Video } from 'lucide-react';
import AdminCalendar from '@/components/AdminCalendar';
import DashboardGrid, { DashboardItem } from '@/components/DashboardGrid';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardNotifications } from '@/hooks/useDashboardNotifications';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

const AdminDashboardPage = () => {
  const router = useRouter();
  const { user } = useAuth(); // Need to ensure useAuth is imported or available (it wasn't imported in original file but usually needed)
  // Actually original file didn't import useAuth. Let's add it.
  const { appointments: pendingAppointmentsCount, messages: unreadMessagesCount } = useDashboardNotifications(user?.uid, 'admin');
  const { events: calendarEvents } = useCalendarEvents({ userId: user?.uid, role: 'admin' });

  const nextAppointments = calendarEvents
    .filter(e => e.type === 'appointment' && e.start > new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const upcomingAppointment = nextAppointments.length > 0 ? nextAppointments[0] : null;

  const dashboardItems: DashboardItem[] = [
    {
      title: "Sessão de Teleterapia",
      description: "Acesse a sala de vídeo.",
      icon: <Video size={48} />,
      variant: "highlight",
      onClick: () => router.push('/admin/teleterapia')
    },
    {
      title: "Conteúdos Didáticos",
      description: "Publique artigos e vídeos.",
      icon: <BookOpen size={48} />,
      onClick: () => router.push('/admin/conteudo')
    },
    {
      title: "Prontuário e Histórico",
      description: "Gerencie documentos e histórico.",
      icon: <FileText size={48} />,
      onClick: () => router.push('/admin/prontuarios')
    },
    {
      title: "Financeiro",
      description: "Emita cobranças e recibos.",
      icon: <CreditCard size={48} />,
      onClick: () => router.push('/admin/financeiro')
    },
    {
      title: "Atendimento Online",
      description: "Responda mensagens dos pacientes.",
      icon: <MessageCircle size={48} />,
      onClick: () => router.push('/admin/chat'),
      notificationCount: unreadMessagesCount
    },
    {
      title: "Resumo dos Atendimentos",
      description: "Visualize seus agendamentos.",
      icon: <CalendarCheck size={48} />,
      onClick: () => router.push('/admin/atendimentos'),
      notificationCount: pendingAppointmentsCount
    },
    {
      title: "Manual do Administrador",
      description: "Tutorial de uso para Admins.",
      icon: <BookOpen size={48} color="#FBC02D" />,
      onClick: () => router.push('/admin/ajuda')
    }
  ];

  return (
    <AdminPrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Dashboard Administrativo</h1>
          <p>Gerencie sua clínica e atenda seus pacientes.</p>
        </header>

        {/* Upcoming Appointment Alert */}
        {upcomingAppointment && (
          <div
            className={`${styles.card} ${styles.upcomingAppointmentCard}`}
            onClick={() => router.push('/admin/atendimentos')}
            role="button"
            tabIndex={0}
          >
            <div className={styles.upcomingAppointmentIcon}>
              <CalendarCheck size={36} color="white" />
            </div>
            <div>
              <h3 className={styles.upcomingAppointmentTitle}>Próxima Consulta Agendada</h3>
              <p className={styles.upcomingAppointmentText}>
                Você tem um agendamento com <strong>{upcomingAppointment.patientName || 'Paciente'}</strong> dia: <strong>{upcomingAppointment.start.toLocaleString('pt-BR')}</strong>
              </p>
              {upcomingAppointment.status === 'pending' && <span className={styles.upcomingAppointmentBadge}>Aguardando confirmação</span>}
            </div>
          </div>
        )}

        <DashboardGrid items={dashboardItems} />


        <section className={styles.calendarSection}>
          <AdminCalendar />
        </section>

      </div>
    </AdminPrivateRoute>
  );
};

export default AdminDashboardPage;
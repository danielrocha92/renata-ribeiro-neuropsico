'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Admin.module.css';
import { BookOpen, CreditCard, MessageCircle, FileText, CalendarCheck, Video } from 'lucide-react';
import AdminCalendar from '@/components/AdminCalendar';
import DashboardGrid, { DashboardItem } from '@/components/DashboardGrid';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const AdminDashboardPage = () => {
  const router = useRouter();
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = React.useState(0);

  React.useEffect(() => {
    // Listen for appointments created by client with status pending
    // Assuming 'createdBy' field exists now.
    // If not, we might count all pending? But let's stick to the plan: pending + createdBy client.

    // Note: We need to import db, collection, query, where, onSnapshot
    // We'll add imports in a separate step or assume they are added if I utilize multi_replace properly?
    // I can't add imports with this tool call if they are at the top.
    // I will use replace_file_content for the whole file or logic blocks.
    // The previous tool call for ClientPage used multiple steps.
    // Here I will replace the component body and separate step for imports.

    const q = query(
      collection(db, "appointments"),
      where("status", "==", "pending"),
      where("createdBy", "==", "client")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingAppointmentsCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

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
      onClick: () => router.push('/admin/chat')
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

        <DashboardGrid items={dashboardItems} />


        <section className={styles.calendarSection}>
          <AdminCalendar />
        </section>

      </div>
    </AdminPrivateRoute>
  );
};

export default AdminDashboardPage;
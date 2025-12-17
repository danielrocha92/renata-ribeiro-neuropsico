'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Admin.module.css';
import { BookOpen, CreditCard, MessageCircle, FileText, CalendarCheck, Video } from 'lucide-react';
import AdminCalendar from '@/components/AdminCalendar';
import DashboardCard from '@/components/DashboardCard';

const AdminDashboardPage = () => {
  const router = useRouter();
  return (
    <AdminPrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Dashboard Administrativo</h1>
          <p>Gerencie sua clínica e atenda seus pacientes.</p>
        </header>

        <div className={styles.grid}>
          <DashboardCard
            title="Prontuário e Histórico"
            description="Gerencie documentos e histórico."
            icon={<FileText size={48} />}
            onClick={() => router.push('/admin/prontuarios')}
          />
          <DashboardCard
            title="Resumo dos Atendimentos"
            description="Visualize seus agendamentos."
            icon={<CalendarCheck size={48} />}
            onClick={() => router.push('/admin/atendimentos')}
          />
          <DashboardCard
            title="Conteúdos Didáticos"
            description="Publique artigos e vídeos."
            icon={<BookOpen size={48} />}
            onClick={() => router.push('/admin/conteudo')}
          />
          <DashboardCard
            title="Financeiro"
            description="Emita cobranças e recibos."
            icon={<CreditCard size={48} />}
            onClick={() => router.push('/admin/financeiro')}
          />
          <DashboardCard
            title="Atendimento Online"
            description="Responda mensagens dos pacientes."
            icon={<MessageCircle size={48} />}
            onClick={() => router.push('/admin/chat')}
          />
          <DashboardCard
            title="Sessão de Teleterapia"
            description="Acesse a sala de vídeo."
            icon={<Video size={48} />}
            variant="highlight"
            onClick={() => router.push('/admin/teleterapia')}
          />
          <DashboardCard
            title="Manual do Sistema"
            description="Tutorial de uso para Admins."
            icon={<BookOpen size={48} />}
            onClick={() => router.push('/admin/ajuda')}
          />
        </div>

        <section className={styles.calendarSection}>
          <AdminCalendar />
        </section>

      </div>
    </AdminPrivateRoute>
  );
};

export default AdminDashboardPage;
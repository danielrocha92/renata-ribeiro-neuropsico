'use client';

import React from 'react';
import Link from 'next/link';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Admin.module.css';
import { BookOpen, CreditCard, MessageCircle } from 'lucide-react';
import AdminCalendar from '@/components/AdminCalendar';

const AdminDashboardPage = () => {
  return (
    <AdminPrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Dashboard Administrativo</h1>
          <p>Gerencie sua clínica e atenda seus pacientes.</p>
        </header>

        <div className={styles.grid}>

          {/* Agenda card removed, calendar is now embedded below */}

          <Link href="/admin/conteudo" className={styles.navLink}>
            <div className={styles.navCard} style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
              <BookOpen size={48} color="#6A7EBD" style={{ marginBottom: '1rem' }} />
              <h3>Conteúdos Didáticos</h3>
              <p>Publique artigos e vídeos.</p>
            </div>
          </Link>

          <Link href="/admin/financeiro" className={styles.navLink}>
            <div className={styles.navCard} style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
              <CreditCard size={48} color="#6A7EBD" style={{ marginBottom: '1rem' }} />
              <h3>Financeiro</h3>
              <p>Emita cobranças e recibos.</p>
            </div>
          </Link>

          <Link href="/admin/chat" className={styles.navLink}>
            <div className={styles.navCard} style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
              <MessageCircle size={48} color="#6A7EBD" style={{ marginBottom: '1rem' }} />
              <h3>Atendimento Online</h3>
              <p>Responda mensagens dos pacientes.</p>
            </div>
          </Link>

          <Link href="/admin/ajuda" className={styles.navLink}>
            <div className={styles.navCard} style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', backgroundColor: '#fff9c4', border: '1px solid #fbc02d' }}>
              <BookOpen size={48} color="#fbc02d" style={{ marginBottom: '1rem' }} />
              <h3>Manual do Sistema</h3>
              <p>Tutorial de uso para Admins.</p>
            </div>
          </Link>

        </div>

        <section style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
          <AdminCalendar />
        </section>

      </div>
    </AdminPrivateRoute>
  );
};

export default AdminDashboardPage;
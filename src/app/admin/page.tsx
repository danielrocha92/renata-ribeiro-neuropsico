'use client';

import React from 'react';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Admin.module.css';

const AdminDashboardPage = () => {
  return (
    <AdminPrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Dashboard</h1>
        </header>
        <div className={styles.content}>
          <p>Bem-vinda ao seu dashboard!</p>
          {/* Resumo dos agendamentos e outras informações serão adicionados aqui */}
        </div>
      </div>
    </AdminPrivateRoute>
  );
};

export default AdminDashboardPage;
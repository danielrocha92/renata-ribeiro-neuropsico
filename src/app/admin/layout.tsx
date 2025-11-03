'use client';

import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import styles from '@/styles/AdminLayout.module.css';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

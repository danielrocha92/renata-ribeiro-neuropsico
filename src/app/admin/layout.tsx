'use client';

import React from 'react';

import styles from '@/styles/AdminLayout.module.css';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

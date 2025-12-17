'use client';

import React from 'react';

import styles from '@/styles/AdminLayout.module.css';

import Breadcrumbs from '@/components/Breadcrumbs';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <main className={styles.mainContent}>
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumbs />
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

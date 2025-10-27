'use client';

import React from 'react';
import AdminPrivateRoute from '../../components/AdminPrivateRoute';
import PatientDocuments from '../../components/PatientDocuments';
import AppointmentsManager from '../../components/AppointmentsManager';
import VerificationManager from '../../components/VerificationManager'; // Import the new component
import styles from '../../styles/Admin.module.css';

const AdminPage: React.FC = () => {
  return (
    <AdminPrivateRoute>
      <div className={styles.dashboard}>
        <h1 className={styles.title}>Dashboard do Psicólogo</h1>
        <div className={styles.grid}>
          <div className={`${styles.section} ${styles.fullWidth}`}>
            <h2 className={styles.sectionTitle}>Aprovações Pendentes</h2>
            <VerificationManager />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Documentos e Materiais</h2>
            <PatientDocuments />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Agenda e Agendamentos</h2>
            <AppointmentsManager />
          </div>
        </div>
      </div>
    </AdminPrivateRoute>
  );
};

export default AdminPage;

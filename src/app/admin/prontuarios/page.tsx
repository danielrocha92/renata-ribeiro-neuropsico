'use client';

import React from 'react';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Admin.module.css';
import PatientDocuments from '@/components/PatientDocuments';
import Link from 'next/link';

const AdminProntuariosPage = () => {
    return (
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerNav}>
                        <Link href="/admin" className={styles.backLink}>
                            ← Voltar
                        </Link>
                        <h1>Prontuário e Histórico</h1>
                    </div>
                    <p>Gerencie documentos e histórico dos pacientes.</p>
                </header>

                <section className={styles.content}>
                    <PatientDocuments />
                </section>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminProntuariosPage;

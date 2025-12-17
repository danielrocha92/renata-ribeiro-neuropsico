'use client';

import React from 'react';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Admin.module.css';
import AppointmentsManager from '@/components/AppointmentsManager';
import Link from 'next/link';

const AdminAtendimentosPage = () => {
    return (
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerNav}>
                        <Link href="/admin" className={styles.backLink}>
                            ← Voltar
                        </Link>
                        <h1>Resumo dos Atendimentos</h1>
                    </div>
                    <p>Visualize e gerencie todos os agendamentos.</p>
                </header>

                <section className={styles.content}>
                    <AppointmentsManager />
                </section>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminAtendimentosPage;

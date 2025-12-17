'use client';

import React from 'react';
import styles from '@/styles/ClienteLayout.module.css';
// Assuming Client shares some styles or use a new module
import Breadcrumbs from '@/components/Breadcrumbs';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="client-layout">
            <div className={styles.container}>
                <Breadcrumbs />
                {children}
            </div>
        </div>
    );
};

export default ClientLayout;

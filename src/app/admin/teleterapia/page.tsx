'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore'; // Not used
// import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Teleterapia.module.css';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import { Video, ArrowLeft, MessageCircle } from 'lucide-react';
// import WherebyComponent from '@/components/WherebyComponent'; // Not used anymore



const AdminTeleterapiaPage: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();

    const platforms = [
        {
            name: 'Google Meet',
            url: 'https://meet.google.com/',
            icon: <Video size={32} />,
            styleClass: styles.meetIcon
        },
        {
            name: 'Zoom',
            url: 'https://zoom.us/start/videomeeting', // Direct link to start meeting if logged in, or main page
            icon: <Video size={32} />, // Zoom uses video icon too, or we can find another one
            styleClass: styles.zoomIcon
        },
        {
            name: 'WhatsApp Web',
            url: 'https://web.whatsapp.com/',
            icon: <MessageCircle size={32} />,
            styleClass: styles.whatsappIcon
        },
        {
            name: 'Whereby (Sala Fixa)',
            url: 'https://whereby.com/renata-ribeiro-neuropsico?displayName=Renata%20Ribeiro',
            icon: <Video size={32} />,
            styleClass: styles.wherebyIcon
        }
    ];

    return (
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <button onClick={() => router.back()} className={styles.backButton}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Sala de Atendimento</h1>
                            <p>Escolha a plataforma para iniciar o atendimento.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.contentWrapper}>
                    <div className={styles.optionsGrid}>
                        {platforms.map(platform => (
                            <a
                                key={platform.name}
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.optionCard}
                            >
                                <div className={`${styles.optionIcon} ${platform.styleClass}`}>
                                    {platform.icon}
                                </div>
                                <span className={styles.optionTitle}>{platform.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminTeleterapiaPage;

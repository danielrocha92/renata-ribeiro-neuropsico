'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore'; // Not used
// import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Teleterapia.module.css'; // Import the new specific styles
import PrivateRoute from '@/components/PrivateRoute';
import { Video, ArrowLeft, MessageCircle } from 'lucide-react';
// import WherebyComponent from '@/components/WherebyComponent'; // Not used anymore



const TeleterapiaPage: React.FC = () => {
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
            url: 'https://zoom.us/join', // Client likely wants to JOIN
            icon: <Video size={32} />,
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
            url: `https://whereby.com/renata-ribeiro-neuropsico?displayName=${encodeURIComponent(user?.displayName || 'Paciente')}`,
            icon: <Video size={32} />,
            styleClass: styles.wherebyIcon
        }
    ];

    return (
        <PrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <button onClick={() => router.back()} className={styles.backButton}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Teleterapia</h1>
                            <p>Acesse a plataforma combinada para sua sessão.</p>
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

                    <div className={styles.recommendationsSection}>
                        <h3>Recomendações</h3>
                        <ul className={styles.recommendationsList}>
                            <li>Confirme com a profissional qual plataforma será utilizada.</li>
                            <li>Escolha um local silencioso e iluminado.</li>
                            <li>Teste sua conexão e bateria antes de iniciar.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default TeleterapiaPage;

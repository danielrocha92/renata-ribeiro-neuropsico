'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Cliente.module.css';
import PrivateRoute from '@/components/PrivateRoute';
import { ArrowLeft, BookOpen, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';

interface Content {
    id: string;
    title: string;
    type: string;
    description: string;
    url?: string;
    locked: boolean;
}

const ConteudoPage: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContents = async () => {
            if (!db) return;
            setLoading(true);
            try {
                // Fetch all active content
                // In a real scenario, you might filter by user subscription level or tags
                const q = query(collection(db, "contents"));
                const querySnapshot = await getDocs(q);
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
                setContents(items);
            } catch (error) {
                console.error("Erro ao buscar conteúdos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContents();
    }, []);

    const handleAccessContent = (item: Content) => {
        if (item.locked) {
            alert("Este conteúdo é exclusivo. Entre em contato para saber como acessar.");
            return;
        }
        if (item.url) {
            window.open(item.url, '_blank');
        } else {
            alert("Conteúdo em manutenção.");
        }
    };

    return (
        <PrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Conteúdo Exclusivo</h1>
                            <p>Materiais de apoio para seu desenvolvimento.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainContent}>
                    {loading ? (
                        <p className={styles.loading}>Carregando materiais...</p>
                    ) : contents.length > 0 ? (
                        <div className={styles.dashboardGrid}>
                            {contents.map((item) => (
                                <div
                                    key={item.id}
                                    className={`${styles.card} ${item.locked ? styles.lockedContent : ''}`}
                                    onClick={() => handleAccessContent(item)}
                                >
                                    {item.locked && (
                                        <div className={styles.lockedBadge}>
                                            <Lock size={12} /> Exclusivo
                                        </div>
                                    )}
                                    <BookOpen className={styles.cardIcon} size={32} />
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>{item.type}</span>
                                    <p className={styles.cardDescription}>{item.description}</p>
                                    <button className={styles.actionButton} disabled={item.locked} style={{ marginTop: '1rem', opacity: item.locked ? 0.5 : 1 }}>
                                        {item.locked ? 'Bloqueado' : 'Acessar'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noData} style={{ textAlign: 'center' }}>Nenhum conteúdo disponível no momento.</p>
                    )}
                </div>
            </div>
        </PrivateRoute>
    );
};

export default ConteudoPage;

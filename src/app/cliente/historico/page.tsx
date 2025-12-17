'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Cliente.module.css';
import PrivateRoute from '@/components/PrivateRoute';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';

interface Appointment {
    id: string;
    date: Timestamp;
    title: string;
    status: string;
    notes?: string;
}

const HistoricoPage: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user || !db) return;
            setLoading(true);
            try {
                const now = new Date();
                const q = query(
                    collection(db, "appointments"),
                    where("patientId", "==", user.uid),
                    where("date", "<", Timestamp.fromDate(now)), // Past appointments
                    orderBy("date", "desc")
                );

                const querySnapshot = await getDocs(q);
                const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
                setHistory(apps);
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    return (
        <PrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Prontuário e Histórico</h1>
                            <p>Registro de suas consultas anteriores.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainContent}>
                    <div className={styles.section}>
                        {loading ? (
                            <p>Carregando histórico...</p>
                        ) : history.length > 0 ? (
                            <ul className={styles.appointmentList}>
                                {history.map(app => (
                                    <li key={app.id} className={styles.appointmentItem}>
                                        <div className={styles.appointmentDetails}>
                                            <span style={{ fontSize: '1.1rem', color: '#333' }}>{app.title}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                                                <Calendar size={14} color="#888" />
                                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                                    {new Date(app.date.seconds * 1000).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {app.notes && (
                                                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555', fontStyle: 'italic', borderLeft: '3px solid #ddd', paddingLeft: '0.5rem' }}>
                                                    "{app.notes}"
                                                </p>
                                            )}
                                        </div>
                                        <span className={`${styles.status} ${styles[app.status.toLowerCase()]}`}>{app.status}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                <p>Nenhum histórico de atendimento encontrado.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default HistoricoPage;

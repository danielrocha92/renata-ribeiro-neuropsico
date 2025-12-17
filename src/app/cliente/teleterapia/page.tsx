'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Cliente.module.css';
import PrivateRoute from '@/components/PrivateRoute';
import { Video, ArrowLeft, Calendar } from 'lucide-react';

interface Appointment {
    id: string;
    date: Timestamp;
    title: string;
    status: string;
    meetLink?: string; // Assuming we might store this field
}

const TeleterapiaPage: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNextAppointment = async () => {
            if (!user || !db) return;
            setLoading(true);
            try {
                const now = new Date();
                const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000); // Look back 2 hours to find ongoing sessions
                const q = query(
                    collection(db, "appointments"),
                    where("patientId", "==", user.uid),
                    where("date", ">=", Timestamp.fromDate(twoHoursAgo)),
                    orderBy("date", "asc"),
                    limit(1)
                );

                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setNextAppointment({ id: doc.id, ...doc.data() } as Appointment);
                } else {
                    setNextAppointment(null);
                }
            } catch (error) {
                console.error("Erro ao buscar próxima consulta:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNextAppointment();
    }, [user]);

    return (
        <PrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => router.back()} className={styles.backButton} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Teleterapia</h1>
                            <p>Sua sala de atendimento online segura.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainContent} style={{ maxWidth: '800px', margin: '0 auto', display: 'block' }}>
                    <div className={styles.section} style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                        {loading ? (
                            <p>Carregando...</p>
                        ) : nextAppointment ? (
                            <>
                                <div style={{ marginBottom: '2rem' }}>
                                    <Video size={64} color="#6A7EBD" style={{ marginBottom: '1rem' }} />
                                    <h2>Sua próxima sessão</h2>
                                    <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
                                        {nextAppointment.title}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#555', fontSize: '1.1rem' }}>
                                        <Calendar size={20} />
                                        <span>
                                            {new Date(nextAppointment.date.seconds * 1000).toLocaleDateString('pt-BR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                    {/* Assuming connection to Google Meet logic or similar */}
                                    <a
                                        href={nextAppointment.meetLink || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.videoButton}
                                        style={{
                                            opacity: nextAppointment.meetLink ? 1 : 0.5,
                                            pointerEvents: nextAppointment.meetLink ? 'auto' : 'none',
                                            fontSize: '1.1rem',
                                            padding: '1rem 2rem'
                                        }}
                                    >
                                        <Video size={20} />
                                        {nextAppointment.meetLink ? "Entrar na Videochamada" : "Link disponível 10 min antes"}
                                    </a>
                                    {!nextAppointment.meetLink && (
                                        <p style={{ fontSize: '0.9rem', color: '#888' }}>
                                            O link será liberado pelo profissional próximo ao horário.
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Video size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
                                <h3>Nenhuma sessão agendada</h3>
                                <p>Você não possui atendimentos online agendados para os próximos dias.</p>
                                <button
                                    onClick={() => router.push('/cliente')}
                                    className={styles.actionButton}
                                    style={{ marginTop: '1rem' }}
                                >
                                    Voltar para o Início
                                </button>
                            </>
                        )}
                    </div>

                    <div className={styles.section} style={{ marginTop: '2rem' }}>
                        <h3>Recomendações para Teleterapia</h3>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8', color: '#555' }}>
                            <li>Escolha um local silencioso e com boa iluminação.</li>
                            <li>Verifique sua conexão com a internet antes de começar.</li>
                            <li>Utilize fones de ouvido para garantir privacidade e melhor qualidade de áudio.</li>
                            <li>Tenha papel e caneta à mão se desejar fazer anotações.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default TeleterapiaPage;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Teleterapia.module.css'; // Import the new specific styles
import PrivateRoute from '@/components/PrivateRoute';
import { Video, ArrowLeft, Calendar } from 'lucide-react';
import WherebyComponent from '@/components/WherebyComponent';

interface Appointment {
    id: string;
    date: Timestamp;
    title: string;
    status: string;
    meetLink?: string;
    meetingId?: string;
}

const TeleterapiaPage: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [inCall, setInCall] = useState(false);

    // CONFIGURATION: Replace this URL with your actual Whereby room URL (e.g. https://whereby.com/your-room-name)
    // You can also get this from a database setting in the future.
    const wherebyRoomUrl = "https://whereby.com/neuropsico-renata-ribeiro";

    useEffect(() => {
        const fetchNextAppointment = async () => {
            if (!user || !db) return;
            setLoading(true);
            try {
                const now = new Date();
                const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
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
                    <div className={styles.headerContent}>
                        <button onClick={() => router.back()} className={styles.backButton}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Teleterapia</h1>
                            <p>Sua sala de atendimento online segura.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.contentWrapper}>
                    <div className={styles.section}>
                        {loading ? (
                            <p>Carregando...</p>
                        ) : nextAppointment ? (
                            <>
                                {inCall ? (
                                    <WherebyComponent roomUrl={wherebyRoomUrl} />
                                ) : (
                                    <>
                                        <div className={styles.infoContainer}>
                                            <Video size={64} color="#6A7EBD" className={styles.videoIcon} />
                                            <h2>Sua próxima sessão</h2>
                                            <p className={styles.appointmentTitle}>
                                                {nextAppointment.title}
                                            </p>
                                            <div className={styles.dateContainer}>
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

                                        <div className={styles.actionContainer}>
                                            <button
                                                onClick={() => setInCall(true)}
                                                className={styles.startButton}
                                            >
                                                <Video size={20} />
                                                Entrar na Sala Virtual
                                            </button>
                                            <p className={styles.helperText}>
                                                Clique acima para entrar na sala da consulta.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Video size={48} color="#ccc" className={styles.emptyStateIcon} />
                                <h3>Nenhuma sessão agendada</h3>
                                <p>Você não possui atendimentos online agendados para os próximos dias.</p>
                                <button
                                    onClick={() => router.push('/cliente')}
                                    className={styles.homeButton}
                                >
                                    Voltar para o Início
                                </button>
                            </>
                        )}
                    </div>

                    <div className={styles.recommendationsSection}>
                        <h3>Recomendações para Teleterapia</h3>
                        <ul className={styles.recommendationsList}>
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

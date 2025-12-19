'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Teleterapia.module.css';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import { Video, ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import WherebyComponent from '@/components/WherebyComponent';

interface Appointment {
    id: string;
    date: Timestamp;
    title: string;
    status: string;
    patientName?: string;
}

const AdminTeleterapiaPage: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [inCall, setInCall] = useState(false);

    // Using the same room URL as the client side
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
                    where("date", ">=", Timestamp.fromDate(twoHoursAgo)),
                    orderBy("date", "asc"),
                    limit(1)
                );

                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const appointmentData = doc.data();

                    // Optional: Fetch patient details if needed
                    let patientName = "Paciente";
                    // if (appointmentData.patientId) { ... }

                    setNextAppointment({ id: doc.id, ...appointmentData, patientName } as Appointment);
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
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <button onClick={() => router.back()} className={styles.backButton}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Sala de Atendimento (Admin)</h1>
                            <p>Realize suas sessões de teleterapia.</p>
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
                                    <>
                                        <div className={styles.alertInfoBox}>
                                            <span>
                                                <strong>Nota:</strong> Você está acessando a sala como Administrador. Se necessário, faça login no Whereby.
                                            </span>
                                            <button
                                                onClick={() => window.open(wherebyRoomUrl, '_blank')}
                                                className={styles.alertActionBtn}
                                            >
                                                <ExternalLink size={14} />
                                                Abrir em Nova Aba
                                            </button>
                                        </div>
                                        <WherebyComponent roomUrl={wherebyRoomUrl} />
                                        <button
                                            onClick={() => setInCall(false)}
                                            className={styles.exitButton}
                                        >
                                            Sair da Sala
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.infoContainer}>
                                            <Video size={64} color="#6A7EBD" className={styles.videoIcon} />
                                            <h2>Próximo Atendimento</h2>
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
                                                Entrar na Sala (Whereby)
                                            </button>
                                            <p className={styles.helperText}>
                                                Ao clicar, você entrará na sala da consulta.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Video size={48} color="#ccc" className={styles.emptyStateIcon} />
                                <h3>Nenhuma sessão agendada em breve</h3>
                                <p>Não há atendimentos online agendados para os próximos horários.</p>
                                <button
                                    onClick={() => router.push('/admin')}
                                    className={styles.homeButton}
                                >
                                    Voltar ao Dashboard
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminTeleterapiaPage;

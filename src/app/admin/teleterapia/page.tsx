'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Teleterapia.module.css'; // Reusing the same styles
import AdminPrivateRoute from '@/components/AdminPrivateRoute'; // Using AdminPrivateRoute
import { Video, ArrowLeft, Calendar, User } from 'lucide-react';
import JitsiMeetComponent from '@/components/JitsiMeetComponent';

interface Appointment {
    id: string;
    date: Timestamp;
    title: string;
    status: string;
    meetLink?: string;
    meetingId?: string;
    patientName?: string; // Additional field for admin view
}

const AdminTeleterapiaPage: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [inCall, setInCall] = useState(false);
    const [meetingId, setMeetingId] = useState<string>('');

    useEffect(() => {
        const fetchNextAppointment = async () => {
            if (!user || !db) return;
            setLoading(true);
            try {
                const now = new Date();
                const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
                // Admin query: find appointments where psychologistId is current user (or just any upcoming relevant appointment)
                // Assuming admin is the psychologist. If system spans multiple psychologists, filter by user.uid
                // For "Renata Ribeiro", she sees all or her own. Let's filter by date first.

                const q = query(
                    collection(db, "appointments"),
                    // Removed patientId filter to find ANY next appointment
                    where("date", ">=", Timestamp.fromDate(twoHoursAgo)),
                    orderBy("date", "asc"),
                    limit(1)
                );

                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const appointmentData = doc.data();

                    // Fetch patient name if possible (optional enhancement)
                    let patientName = "Paciente";
                    if (appointmentData.patientId) {
                        // We could fetch user data here, but for now let's use what's available or generic
                    }

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
                                    <JitsiMeetComponent
                                        roomName={meetingId}
                                        userName={user?.displayName || "Psicóloga"}
                                        onEnd={() => setInCall(false)}
                                    />
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
                                                onClick={() => {
                                                    setMeetingId(`RRNeuropsico-${nextAppointment.id}`);
                                                    setInCall(true);
                                                }}
                                                className={styles.startButton}
                                            >
                                                <Video size={20} />
                                                Iniciar Sessão (Como Anfitrião)
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

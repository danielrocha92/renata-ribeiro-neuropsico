'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Cliente.module.css';
import utils from '@/styles/Utils.module.css';
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
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !db) return;
            setLoading(true);
            try {
                const now = new Date();

                // Fetch Appointments
                const appQuery = query(
                    collection(db, "appointments"),
                    where("patientId", "==", user.uid),
                    where("date", "<", Timestamp.fromDate(now)),
                    orderBy("date", "desc")
                );

                const appSnapshot = await getDocs(appQuery);
                const apps = appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
                setHistory(apps);

                // Fetch Documents
                const docQuery = query(
                    collection(db, "documents"),
                    where("patientId", "==", user.uid)
                );

                const docSnapshot = await getDocs(docQuery);
                const docs = docSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as any))
                    .sort((a, b) => {
                        const dateA = a.uploadedAt?.seconds || 0;
                        const dateB = b.uploadedAt?.seconds || 0;
                        return dateB - dateA;
                    });
                setDocuments(docs);

                // Mark unread documents as read
                docs.forEach(async (docData) => {
                    if (docData.read === false) {
                        await import('firebase/firestore').then(({ updateDoc, doc }) => {
                            updateDoc(doc(db, 'documents', docData.id), { read: true });
                        });
                    }
                });

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    return (
        <PrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={utils.flexRow}>
                        <button onClick={() => router.back()} className={utils.iconButtonSecondary}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Prontuário e Histórico</h1>
                            <p>Registro de suas consultas e documentos.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainContent}>
                    {/* Documents Section */}
                    {documents.length > 0 && (
                        <div className={`${styles.section} ${utils.mb2}`}>
                            <h2 className={styles.sectionTitle}>Documentos Compartilhados</h2>
                            <ul className={styles.appointmentList}>
                                {documents.map(doc => (
                                    <li key={doc.id} className={styles.appointmentItem}>
                                        <div className={styles.appointmentDetails}>
                                            <span className={utils.textMedium}>
                                                {doc.type === 'file' ? '📄' : '🔗'} {doc.fileName || 'Documento sem nome'}
                                            </span>
                                            <div className={`${utils.flexRow} ${utils.mt05}`}>
                                                <Calendar size={14} color="#888" />
                                                <span className={utils.textMuted}>
                                                    {doc.uploadedAt ? new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString() : 'Data desconhecida'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            {doc.type === 'file' ? (
                                                <a
                                                    href={doc.fileData}
                                                    download={doc.fileName}
                                                    className={utils.btnOutlinePrimary}
                                                >
                                                    Baixar
                                                </a>
                                            ) : (
                                                <a
                                                    href={doc.externalLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={utils.btnOutlinePrimary}
                                                >
                                                    Acessar
                                                </a>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Appointments Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Histórico de Consultas</h2>
                        {loading ? (
                            <p>Carregando histórico...</p>
                        ) : history.length > 0 ? (
                            <ul className={styles.appointmentList}>
                                {history.map(app => (
                                    <li key={app.id} className={styles.appointmentItem}>
                                        <div className={styles.appointmentDetails}>
                                            <span className={utils.textMedium}>{app.title}</span>
                                            <div className={`${utils.flexRow} ${utils.mt05}`}>
                                                <Calendar size={14} color="#888" />
                                                <span className={utils.textMuted}>
                                                    {new Date(app.date.seconds * 1000).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {app.notes && (
                                                <p className={utils.quoteBlock}>
                                                    "{app.notes}"
                                                </p>
                                            )}
                                        </div>
                                        <span className={`${styles.status} ${styles[app.status.toLowerCase()]}`}>{app.status}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className={`${utils.textCenter} ${utils.p2} ${utils.textMuted}`}>
                                <FileText size={48} className={`${utils.opacity30} ${utils.mb1}`} />
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

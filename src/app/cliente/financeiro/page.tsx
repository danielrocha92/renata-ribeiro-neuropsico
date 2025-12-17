'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Cliente.module.css';
import PrivateRoute from '@/components/PrivateRoute';
import { ArrowLeft, CreditCard, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where, orderBy, Timestamp } from 'firebase/firestore';

interface Invoice {
    id: string;
    date: Timestamp;
    title: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    method?: string;
    dueDate?: Timestamp;
    paymentLink?: string;
}

const FinanceiroPage: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [payments, setPayments] = useState<Invoice[]>([]);
    const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinanceData = async () => {
            if (!user || !db) return;
            setLoading(true);
            try {
                // Fetch Payments (Paid history)
                const paidQuery = query(
                    collection(db, "invoices"),
                    where("patientId", "==", user.uid),
                    where("status", "==", "paid"),
                    orderBy("date", "desc")
                );
                const paidSnap = await getDocs(paidQuery);
                setPayments(paidSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice)));

                // Fetch Pending (Open invoices)
                const pendingQuery = query(
                    collection(db, "invoices"),
                    where("patientId", "==", user.uid),
                    where("status", "in", ["pending", "overdue"]),
                    orderBy("dueDate", "asc")
                );
                const pendingSnap = await getDocs(pendingQuery);
                setPendingInvoices(pendingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice)));

            } catch (error) {
                console.error("Erro ao buscar dados financeiros:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, [user]);

    const handlePay = (invoice: Invoice) => {
        if (invoice.paymentLink) {
            window.open(invoice.paymentLink, '_blank');
        } else {
            alert("Link de pagamento não disponível. Entre em contato com o suporte.");
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
                            <h1>Financeiro</h1>
                            <p>Gestão de pagamentos e notas fiscais.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainContent}>
                    <div className={styles.leftColumn} style={{ width: '100%' }}>

                        {loading ? (
                            <p className={styles.loading}>Carregando financeiro...</p>
                        ) : (
                            <>
                                {pendingInvoices.length > 0 && (
                                    <section className={styles.section} style={{ marginBottom: '2rem', border: '1px solid #e57373' }}>
                                        <h2>Pagamentos Pendentes</h2>
                                        <ul className={styles.appointmentList}>
                                            {pendingInvoices.map(inv => (
                                                <li key={inv.id} className={styles.appointmentItem}>
                                                    <div className={styles.appointmentDetails}>
                                                        <span>{inv.title || inv.description}</span>
                                                        <span style={{ color: '#d32f2f' }}>
                                                            Vencimento: {inv.dueDate ? new Date(inv.dueDate.seconds * 1000).toLocaleDateString() : 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <span style={{ fontWeight: 'bold' }}>R$ {inv.amount.toFixed(2)}</span>
                                                        <button
                                                            onClick={() => handlePay(inv)}
                                                            className={styles.actionButton}
                                                        >
                                                            Pagar Agora
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                <section className={styles.section}>
                                    <h2>Histórico de Pagamentos</h2>
                                    {payments.length > 0 ? (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                                <thead>
                                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                                        <th style={{ padding: '1rem', color: '#555' }}>Data</th>
                                                        <th style={{ padding: '1rem', color: '#555' }}>Descrição</th>
                                                        <th style={{ padding: '1rem', color: '#555' }}>Valor</th>
                                                        <th style={{ padding: '1rem', color: '#555' }}>Status</th>
                                                        <th style={{ padding: '1rem', color: '#555' }}>Recibo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payments.map(pay => (
                                                        <tr key={pay.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                            <td style={{ padding: '1rem', color: '#666' }}>
                                                                {pay.date ? new Date(pay.date.seconds * 1000).toLocaleDateString() : '-'}
                                                            </td>
                                                            <td style={{ padding: '1rem', fontWeight: 500 }}>{pay.description}</td>
                                                            <td style={{ padding: '1rem', color: '#333' }}>R$ {pay.amount.toFixed(2)}</td>
                                                            <td style={{ padding: '1rem' }}>
                                                                <span className={`${styles.status} ${styles.confirmed}`} style={{ fontSize: '0.75rem' }}>{pay.status}</span>
                                                            </td>
                                                            <td style={{ padding: '1rem' }}>
                                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6A7EBD' }}>
                                                                    <Download size={18} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className={styles.noData}>Nenhum pagamento registrado.</p>
                                    )}
                                </section>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default FinanceiroPage;

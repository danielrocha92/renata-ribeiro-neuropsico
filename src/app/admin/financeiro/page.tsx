'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/Admin.module.css';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, getDocs, where, Timestamp, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Check, Clock, Plus, Trash2 } from 'lucide-react';

interface Invoice {
    id: string;
    patientId: string;
    patientName?: string;
    amount: number;
    description: string;
    status: 'pending' | 'paid' | 'overdue';
    dueDate: Timestamp;
    paymentLink?: string; // New optional field
}

interface User {
    uid: string;
    displayName: string;
    email: string;
    role?: string;
}

const AdminFinanceiroPage = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        patientId: '',
        description: '',
        amount: '',
        status: 'pending',
        dueDate: '',
        paymentLink: '' // New state field
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Users for dropdown
            const usersQuery = query(collection(db, 'users'));
            const usersSnap = await getDocs(usersQuery);
            setUsers(usersSnap.docs.map(d => ({ uid: d.id, ...d.data() } as User)));

            // Fetch Invoices
            const invQuery = query(collection(db, 'invoices'), orderBy('dueDate', 'desc'));
            const invSnap = await getDocs(invQuery);
            setInvoices(invSnap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.patientId) return alert('Selecione um paciente');

        try {
            await addDoc(collection(db, 'invoices'), {
                patientId: formData.patientId,
                description: formData.description,
                amount: parseFloat(formData.amount),
                status: formData.status,
                dueDate: Timestamp.fromDate(new Date(formData.dueDate)),
                paymentLink: formData.paymentLink, // Save link
                date: Timestamp.now()
            });
            alert('Cobrança gerada com sucesso!');
            setFormData({ patientId: '', description: '', amount: '', status: 'pending', dueDate: '', paymentLink: '' });
            fetchData();
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert('Erro ao criar cobrança.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este registro?')) return;
        try {
            await deleteDoc(doc(db, 'invoices', id));
            setInvoices(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'invoices', id), {
                status: newStatus
            });
            // Optimistic update
            setInvoices(prev => prev.map(inv =>
                inv.id === id ? { ...inv, status: newStatus as any } : inv
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Erro ao atualizar status");
        }
    };

    const getPatientName = (uid: string) => {
        const u = users.find(u => u.uid === uid);
        return u ? (u.displayName || u.email) : uid;
    };

    return (
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Financeiro</h1>
                </header>

                <div className={styles.grid}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Nova Cobrança / Registro</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Paciente</label>
                                <select
                                    className={styles.select}
                                    required
                                    value={formData.patientId}
                                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    {users.map(u => (
                                        <option key={u.uid} value={u.uid}>{u.displayName || u.email}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Descrição</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    required
                                    placeholder="Ex: Sessão Terapia 15/12"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Valor (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className={styles.input}
                                    required
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Vencimento</label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    required
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Link de Pagamento (Opcional)</label>
                                <input
                                    type="url"
                                    className={styles.input}
                                    placeholder="https://pagamento.exemplo.com/..."
                                    value={formData.paymentLink}
                                    onChange={e => setFormData({ ...formData, paymentLink: e.target.value })}
                                />
                                <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                                    Cole aqui o link do Mercado Pago, Stripe, etc.
                                </small>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Status Inicial</label>
                                <select
                                    className={styles.select}
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="pending">Pendente</option>
                                    <option value="paid">Pago</option>
                                    <option value="overdue">Atrasado</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.button}>
                                <Plus size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                Gerar Cobrança
                            </button>
                        </form>
                    </div>

                    <div className={styles.section} style={{ gridColumn: 'span 2' }}>
                        <h2 className={styles.sectionTitle}>Registros Financeiros</h2>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Data Venc.</th>
                                        <th>Paciente</th>
                                        <th>Descrição</th>
                                        <th>Valor</th>
                                        <th>Link</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map(inv => (
                                        <tr key={inv.id}>
                                            <td>{inv.dueDate ? new Date(inv.dueDate.seconds * 1000).toLocaleDateString() : '-'}</td>
                                            <td>{getPatientName(inv.patientId)}</td>
                                            <td>{inv.description}</td>
                                            <td>R$ {inv.amount.toFixed(2)}</td>
                                            <td>
                                                {inv.paymentLink ? (
                                                    <a href={inv.paymentLink} target="_blank" rel="noopener noreferrer" style={{ color: '#6A7EBD' }}>
                                                        Link 🔗
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td>
                                                <select
                                                    value={inv.status}
                                                    onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                                                    className={styles.select}
                                                    style={{
                                                        padding: '5px',
                                                        fontSize: '0.9rem',
                                                        borderColor: inv.status === 'paid' ? 'green' : inv.status === 'overdue' ? 'red' : '#ccc',
                                                        color: inv.status === 'paid' ? 'green' : inv.status === 'overdue' ? 'red' : '#e65100'
                                                    }}
                                                >
                                                    <option value="pending">Pendente</option>
                                                    <option value="paid">Pago</option>
                                                    <option value="overdue">Atrasado</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(inv.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e57373' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminFinanceiroPage;

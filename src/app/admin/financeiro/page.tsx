'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/Admin.module.css';
import utils from '@/styles/Utils.module.css';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, getDocs, where, Timestamp, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Check, Clock, Plus, Trash2, Mail } from 'lucide-react';
import SearchableUserSelect from '@/components/SearchableUserSelect';
import { sendNotificationEmail } from '@/lib/notifications';

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
    displayName?: string;
    name?: string;
    email: string;
    role?: string;
}

interface AppointmentLite {
    id: string;
    patientId: string;
    patientName?: string;
    title: string;
    start: Timestamp | any;
    status: string;
}

const AdminFinanceiroPage = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [appointments, setAppointments] = useState<AppointmentLite[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState('');

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

            // Fetch Appointments
            const appQuery = query(collection(db, 'appointments'), orderBy('start', 'desc'));
            const appSnap = await getDocs(appQuery);
            setAppointments(appSnap.docs.map(d => ({ id: d.id, ...d.data() } as AppointmentLite)));
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
            const parsedAmount = parseFloat(formData.amount.replace(/\./g, '').replace(',', '.'));
            if (isNaN(parsedAmount)) {
                alert('Preencha um valor válido.');
                return;
            }

            await addDoc(collection(db, 'invoices'), {
                patientId: formData.patientId,
                patientName: users.find(u => u.uid === formData.patientId)?.displayName || appointments.find(a => a.patientId === formData.patientId)?.patientName || 'Cliente Externo',
                description: formData.description,
                amount: parsedAmount,
                status: formData.status,
                dueDate: Timestamp.fromDate(new Date(formData.dueDate)),
                paymentLink: formData.paymentLink, // Save link
                date: Timestamp.now()
            });
            alert('Cobrança gerada com sucesso!');
            setFormData({ patientId: '', description: '', amount: '', status: 'pending', dueDate: '', paymentLink: '' });
            setSelectedAppointmentId('');
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

    const getPatientName = (uid: string, inv: Invoice) => {
        const u = users.find(user => user.uid === uid);
        return u ? (u.displayName || u.name || u.email) : (inv.patientName || 'Cliente Externo');
    };

    const handleGenerateReceipt = async (inv: Invoice) => {
        const user = users.find(u => u.uid === inv.patientId);

        // Send Email if there is an email
        if (user && user.email) {
            try {
                await sendNotificationEmail(user.email, 'payment_receipt', {
                    patientName: user.displayName || user.name || 'Paciente',
                    previewText: `O recibo oficial da sua consulta (${inv.description}) será emitido através do sistema Receita Saúde.`,
                    title: `Receita Saúde: ${inv.description}`
                });
                alert("Confirmação com aviso do Receita Saúde enviada por email ao paciente com sucesso!");
            } catch (err) {
                console.error("Erro ao enviar email:", err);
                alert("Houve um erro ao enviar o aviso para o paciente.");
            }
        } else {
            alert("Não é possível enviar notificação! (Usuário não possui email cadastrado ou é externo)");
        }
    };

    const handleAppointmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const apptId = e.target.value;
        setSelectedAppointmentId(apptId);
        if (!apptId) return;

        const appt = appointments.find(a => a.id === apptId);
        if (appt) {
            let apptDate = '';
            if (appt.start && typeof appt.start.toDate === 'function') {
                apptDate = appt.start.toDate().toISOString().split('T')[0];
            } else if (appt.start) {
                apptDate = new Date(appt.start.seconds ? appt.start.seconds * 1000 : appt.start).toISOString().split('T')[0];
            }

            // Find matching user by name or ID if possible
            let matchingUser = users.find(u => u.uid === appt.patientId);
            let finalPatientId = appt.patientId || '';

            // If patientId from appointment doesn't map to a real user uid in the dropdown,
            // we will try to find a user by name as fallback, or just insert it as a string
            // However SearchableUserSelect uses value matching `id`. If no ID matches, it returns placeholder.
            // Let's ensure patientId is preserved so the select component finds the right user.

            setFormData({
                ...formData,
                patientId: matchingUser ? matchingUser.uid : finalPatientId,
                description: appt.title || 'Consulta'
                // A data de vencimento não é preenchida automaticamente a pedido do usuário
            });
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Extract only digits
        if (!value) {
            setFormData({ ...formData, amount: '' });
            return;
        }
        const numericValue = parseInt(value, 10) / 100;
        const formattedValue = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numericValue);
        setFormData({ ...formData, amount: formattedValue });
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
                                <label className={styles.label}>Importar de Agendamento</label>
                                <select
                                    className={styles.select}
                                    value={selectedAppointmentId}
                                    onChange={handleAppointmentSelect}
                                >
                                    <option value="">-- Buscar nos agendamentos (Opcional) --</option>
                                    {appointments.map(a => {
                                        let dateStr = 'Data inválida';
                                        if (a.start && typeof a.start.toDate === 'function') {
                                            dateStr = a.start.toDate().toLocaleDateString('pt-BR');
                                        } else if (a.start) {
                                            dateStr = new Date(a.start.seconds ? a.start.seconds * 1000 : a.start).toLocaleDateString('pt-BR');
                                        }
                                        return (
                                            <option key={a.id} value={a.id}>
                                                {dateStr} - {a.patientName || 'Paciente'}
                                            </option>
                                        );
                                    })}
                                </select>
                                <small className={`${utils.textMuted} ${utils.block} ${utils.mt05}`}>
                                    Selecione um agendamento para preencher os dados automaticamente
                                </small>
                            </div>
                            <hr className={styles.hrDivider} />

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Paciente</label>
                                <SearchableUserSelect
                                    users={
                                        // Merge actual users with the selected patientId if it's an external patient not in users list
                                        [...users.map(u => ({ id: u.uid, displayName: u.displayName || u.name, email: u.email })),
                                        ...(formData.patientId && !users.find(u => u.uid === formData.patientId)
                                            ? [{
                                                id: formData.patientId,
                                                displayName: appointments.find(a => a.patientId === formData.patientId)?.patientName || 'Cliente Externo'
                                            }]
                                            : [])]
                                    }
                                    value={formData.patientId}
                                    onChange={(value) => setFormData({ ...formData, patientId: value })}
                                    placeholder="Selecione o paciente..."
                                />
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
                                    type="text"
                                    inputMode="decimal"
                                    className={styles.input}
                                    required
                                    placeholder="Ex: 150,00"
                                    value={formData.amount}
                                    onChange={handleAmountChange}
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
                                <small className={`${utils.textMuted} ${utils.block} ${utils.mt05}`}>
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
                                <Plus size={18} className={`${utils.verticalAlignMiddle} ${utils.mr05}`} />
                                Gerar Cobrança
                            </button>
                        </form>
                    </div>

                    <div className={`${styles.section} ${utils.span2}`}>
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
                                            <td>{getPatientName(inv.patientId, inv)}</td>
                                            <td>{inv.description}</td>
                                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.amount)}</td>
                                            <td>
                                                {inv.paymentLink ? (
                                                    <a href={inv.paymentLink} target="_blank" rel="noopener noreferrer" className={utils.textPrimary}>
                                                        Link 🔗
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td>
                                                <select
                                                    value={inv.status}
                                                    onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                                                    className={`${styles.select} ${styles.statusSelect} ${styles['status' + (inv.status.charAt(0).toUpperCase() + inv.status.slice(1))]}`}
                                                >
                                                    <option value="pending">Pendente</option>
                                                    <option value="paid">Pago</option>
                                                    <option value="overdue">Atrasado</option>
                                                </select>
                                            </td>
                                            <td className={styles.actionButtonsCell}>
                                                {inv.status === 'paid' && (
                                                    <button
                                                        onClick={() => handleGenerateReceipt(inv)}
                                                        className={styles.receiptButton}
                                                        title="Enviar Aviso 'Receita Saúde'"
                                                    >
                                                        <Mail size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(inv.id)}
                                                    className={utils.iconButtonDanger}
                                                    title="Excluir"
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

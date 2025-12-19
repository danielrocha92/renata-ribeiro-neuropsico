'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/AppointmentsManager.module.css';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, onSnapshot, documentId } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface Appointment {
  id: string;
  patientId: string;
  date: Timestamp;
  title: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado' | 'Realizada';
  patientName?: string; // This will be populated
}

const AppointmentsManager: React.FC = () => {
  const { user } = useAuth(); // This is the psychologist
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Esta verificação protege a primeira query (const q)
    if (!user || !db) return;

    const q = query(collection(db, "appointments"), where("psychologistId", "==", user.uid));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      setLoading(true);

      // --- CORREÇÃO APLICADA ---
      // Adicionamos a mesma verificação *dentro* do callback do onSnapshot.
      // Isso garante ao TypeScript que 'db' não é nulo no momento
      // de executar a query 'usersQuery'.
      if (!db) {
        console.error("Firestore (db) não está disponível no callback do snapshot.");
        setError("Falha na conexão com o banco de dados.");
        setLoading(false);
        return;
      }

      try {
        const appointmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));

        // Get unique patient IDs

        const patientIds = [...new Set(appointmentsData.map(app => app.patientId).filter(pid => pid && pid !== "external"))];

        if (patientIds.length > 0) {
          // Fetch patient names (agora seguro)
          const usersQuery = query(collection(db, "users"), where(documentId(), "in", patientIds));
          const usersSnapshot = await getDocs(usersQuery);
          const userNames = Object.fromEntries(usersSnapshot.docs.map(doc => [doc.id, doc.data().name]));

          // Add patient names to appointments, falling back to existing data if not found
          const finalAppointments = appointmentsData.map(app => ({
            ...app,
            patientName: userNames[app.patientId] || app.patientName || 'Paciente Externo/Não Identificado'
          }));
          setAppointments(finalAppointments);
        } else {
          // If no linked patients, just use the data we have
          setAppointments(appointmentsData.map(app => ({
            ...app,
            patientName: app.patientName || 'Paciente Externo'
          })));
        }

      } catch (err) {
        setError("Falha ao buscar dados dos pacientes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      setError("Erro na escuta em tempo real: " + err.message);
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    if (!db) return;
    const appointmentRef = doc(db, "appointments", id);
    try {
      await updateDoc(appointmentRef, { status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  if (loading) return <p>Carregando agendamentos...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Gerenciar Agendamentos</h3>
      {appointments.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Data</th>
                <th>Título</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <tr key={app.id}>
                  <td>{app.patientName || 'Carregando...'}</td>
                  <td>
                    {app.date && app.date.seconds
                      ? new Date(app.date.seconds * 1000).toLocaleString()
                      : 'Data não definida'}
                  </td>
                  <td>{app.title}</td>
                  <td className={styles[`status${app.status}`] || ''}>{app.status}</td>
                  <td>
                    <select
                      className={styles.select}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as Appointment['status'])}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Confirmado">Confirmado</option>
                      <option value="Cancelado">Cancelado</option>
                      <option value="Realizada">Realizada</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentsManager;
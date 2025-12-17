'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/AppointmentModal.module.css';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSave: (data: any) => void;
  onDelete: (id: string) => void;
  onConfirm: (id: string) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, event, onSave, onDelete, onConfirm }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [externalName, setExternalName] = useState('');
  const [isExternal, setIsExternal] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load users when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          // Import db inside useEffect or at top level if not circular.
          // Assuming db is imported from firebase lib.
          // Note: We need to import db in this file.
          const { db } = await import('@/lib/firebase');
          const { collection, getDocs, query, where } = await import('firebase/firestore');

          const usersCol = collection(db, 'users');
          // Start simplified: fetch all users. Ideally filter by role or pagination in production.
          const userSnapshot = await getDocs(usersCol);
          const userList = userSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUsers(userList);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (event) {
      // If editing an existing event
      if (event.patientId && event.patientId !== 'external') {
        setIsExternal(false);
        setSelectedUserId(event.patientId);
        setExternalName('');
      } else {
        // Either new or external
        if (event.title && event.id) { // Existing external appt
          setIsExternal(true);
          setExternalName(event.title);
          setSelectedUserId('');
        } else {
          // New blank event
          setIsExternal(false);
          setSelectedUserId('');
          setExternalName('');
        }
      }
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSave = () => {
    let patientData: any = {};

    if (isExternal) {
      if (!externalName.trim()) {
        alert("Digite o nome do paciente externo.");
        return;
      }
      patientData = {
        title: externalName,
        patientId: 'external', // Flag for external
        patientName: externalName
      };
    } else {
      if (!selectedUserId) {
        alert("Selecione um paciente cadastrado.");
        return;
      }
      const user = users.find(u => u.id === selectedUserId);
      patientData = {
        title: user?.displayName || user?.name || 'Paciente',
        patientId: user?.id,
        patientName: user?.displayName || user?.name || 'Paciente'
      };
    }

    onSave({ ...event, ...patientData });
  };

  const handleDelete = () => {
    if (event.id) {
      if (confirm("Tem certeza que deseja excluir este agendamento?")) {
        onDelete(event.id);
      }
    }
  };

  const handleConfirm = () => {
    if (event.id) {
      onConfirm(event.id);
    }
  };

  const isNewEvent = event.type === 'new';
  const isPending = event.status === 'pending';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{isNewEvent ? 'Novo Agendamento' : 'Editar Agendamento'}</h2>

        <div className={styles.field}>
          <label>Tipo de Paciente:</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                checked={!isExternal}
                onChange={() => setIsExternal(false)}
              />
              Cadastrado na Plataforma
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                checked={isExternal}
                onChange={() => setIsExternal(true)}
              />
              Cliente Externo
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label>Paciente:</label>
          {isExternal ? (
            <input
              type="text"
              value={externalName}
              onChange={(e) => setExternalName(e.target.value)}
              placeholder="Nome do paciente externo"
              className={styles.input} // Ensure styles exist or use inline
            />
          ) : (
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className={styles.select} // Ensure styles exist
              disabled={loadingUsers}
            >
              <option value="">Selecione um paciente...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.displayName || u.name || u.email || 'Sem Nome'}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={styles.field}>
          <label>Início:</label>
          <p>{event.start.toLocaleString()}</p>
        </div>

        <div className={styles.field}>
          <label>Fim:</label>
          <p>{event.end.toLocaleString()}</p>
        </div>

        {!isNewEvent && (
          <div className={styles.field}>
            <label>Status:</label>
            <p>{event.status === 'pending' ? 'Aguardando Confirmação' : 'Confirmado'}</p>
          </div>
        )}

        <div className={styles.buttons}>
          <button onClick={handleSave} className={styles.saveButton}>Salvar</button>
          {isPending && (
            <button onClick={handleConfirm} className={styles.confirmButton}>Confirmar</button>
          )}
          {!isNewEvent && (
            <button onClick={handleDelete} className={styles.deleteButton}>Excluir</button>
          )}
          <button onClick={onClose} className={styles.closeButton}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;

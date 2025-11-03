'use client';

import React, { useState, useEffect } from 'react';
import styles from './AppointmentModal.module.css';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any; 
  onSave: (data: any) => void;
  onDelete: (id: string) => void;
  onConfirm: (id: string) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, event, onSave, onDelete, onConfirm }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (event && event.title) {
      setTitle(event.title);
    } else {
      setTitle('');
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSave = () => {
    onSave({ ...event, title });
  };

  const handleDelete = () => {
    if (event.id) {
      onDelete(event.id);
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
          <label>Paciente:</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome do paciente"
          />
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
            <button onClick={handleConfirm} className={styles.confirmButton}>Confirmar Agendamento</button>
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

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from '@/styles/Admin.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import AppointmentModal from '@/components/AppointmentModal';
import { useRouter } from 'next/navigation';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  type: 'availability' | 'appointment';
  status?: 'confirmed' | 'pending';
  patientId?: string;
}

const DisponibilidadePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const fetchEvents = useCallback(async () => {
    if (!user || !db) return;

    const availabilityCol = collection(db, 'availability');
    const availQuery = query(availabilityCol, where('psychologistId', '==', user.uid));
    const availSnapshot = await getDocs(availQuery);
    const fetchedAvail = availSnapshot.docs.map(doc => ({
      id: doc.id,
      title: 'Disponível',
      start: (doc.data().start as Timestamp).toDate(),
      end: (doc.data().end as Timestamp).toDate(),
      type: 'availability' as const,
    }));

    const appointmentsCol = collection(db, 'appointments');
    const apptQuery = query(appointmentsCol, where('psychologistId', '==', user.uid));
    const apptSnapshot = await getDocs(apptQuery);
    const fetchedAppts = apptSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().patientName || 'Agendado',
      start: (doc.data().start as Timestamp).toDate(),
      end: (doc.data().end as Timestamp).toDate(),
      type: 'appointment' as const,
      status: doc.data().status,
      patientId: doc.data().patientId,
    }));

    setEvents([...fetchedAvail, ...fetchedAppts]);
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Check for overlapping events
    const overlapping = events.find(event => 
      (start < event.end && end > event.start)
    );

    if (overlapping) {
      alert('Este horário já está ocupado.');
      return;
    }

    setSelectedEvent({ start, end, type: 'new' });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSave = async (eventData: any) => {
    if (!user || !db) return;

    const { id, title, start, end, type } = eventData;

    if (type === 'new') { // Create new appointment
      const newAppointment = {
        psychologistId: user.uid,
        patientName: title,
        start,
        end,
        status: 'pending', // New appointments are pending
      };
      await addDoc(collection(db, 'appointments'), newAppointment);
    } else if (id && type === 'appointment') { // Update existing appointment
      const eventRef = doc(db, 'appointments', id);
      await updateDoc(eventRef, { patientName: title, start, end });
    }
    fetchEvents();
    closeModal();
  };

  const handleConfirm = async (id: string) => {
    if (!db) return;
    const eventRef = doc(db, 'appointments', id);
    await updateDoc(eventRef, { status: 'confirmed' });
    fetchEvents();
    closeModal();
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, 'appointments', id));
    fetchEvents();
    closeModal();
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#e0e0e0'; // Default for availability
    if (event.type === 'appointment') {
      if (event.status === 'confirmed') {
        backgroundColor = '#4caf50'; // Green for confirmed
      } else {
        backgroundColor = '#3174ad'; // Blue for pending
      }
    }
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  const handleGoogleCalendarSync = () => {
    router.push('/api/auth/google/redirect');
  };

  return (
    <AdminPrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Gerenciar Agendamentos</h1>
          <p>Clique em um horário para agendar ou em um agendamento para editar/excluir.</p>
          <button onClick={handleGoogleCalendarSync} className={styles.googleButton}>
            Vincular com Google Agenda
          </button>
        </header>
        <div className={styles.content} style={{ height: '70vh' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.WEEK}
            views={[Views.WEEK, Views.DAY, Views.MONTH]}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            culture='pt-BR'
            messages={{
              next: "Próximo",
              previous: "Anterior",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              // ... other messages
            }}
          />
        </div>
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          event={selectedEvent}
          onSave={handleSave}
          onDelete={handleDelete}
          onConfirm={handleConfirm}
        />
      </div>
    </AdminPrivateRoute>
  );
};

export default DisponibilidadePage;
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Admin.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import AppointmentModal from '@/components/AppointmentModal';
import UnifiedCalendar, { CalendarEvent } from '@/components/UnifiedCalendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DisponibilidadePage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const fetchEvents = useCallback(async () => {
    if (!user || !db) return;

    const availabilityCol = collection(db, 'availability');
    const availQuery = query(availabilityCol, where('psychologistId', '==', user.uid));
    const availSnapshot = await getDocs(availQuery);
    // @ts-ignore
    const fetchedAvail: CalendarEvent[] = availSnapshot.docs.map(doc => {
      const data = doc.data();
      const start = data.start instanceof Timestamp ? data.start.toDate() : null;
      const end = data.end instanceof Timestamp ? data.end.toDate() : null;
      if (!start || !end) return null;

      return {
        id: doc.id,
        title: 'Disponível',
        start,
        end,
        type: 'availability' as const,
      };
    }).filter(e => e !== null);

    const appointmentsCol = collection(db, 'appointments');
    const apptQuery = query(appointmentsCol, where('psychologistId', '==', user.uid));
    const apptSnapshot = await getDocs(apptQuery);
    // @ts-ignore
    const fetchedAppts: CalendarEvent[] = apptSnapshot.docs.map(doc => {
      const data = doc.data();
      const start = data.start instanceof Timestamp ? data.start.toDate() : null;
      const end = data.end instanceof Timestamp ? data.end.toDate() : null;
      if (!start || !end) return null;

      return {
        id: doc.id,
        title: doc.data().patientName || 'Agendado',
        start,
        end,
        type: 'appointment' as const,
        status: doc.data().status,
        patientId: doc.data().patientId,
      };
    }).filter(e => e !== null);

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

    const { id, title, start, end, type, patientId, patientName } = eventData;

    try {
      if (type === 'new') { // Create new appointment
        const newAppointment = {
          psychologistId: user.uid,
          patientName: patientName || title, // Use correct name
          patientId: patientId, // Save patient ID (or 'external')
          start,
          end,
          status: 'confirmed', // Admin appointments are confirmed by default
          createdAt: serverTimestamp() // Add creation time
        };

        await addDoc(collection(db, 'appointments'), newAppointment);
      } else if (id && type === 'appointment') { // Update existing appointment
        const eventRef = doc(db, 'appointments', id);
        // Allow updating patient info too
        await updateDoc(eventRef, {
          patientName: patientName || title,
          patientId: patientId,
          start,
          end
        });
      }
      fetchEvents();
      closeModal();
    } catch (err) {
      console.error("Error saving appointment:", err);
      alert("Erro ao salvar agendamento.");
    }
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
    let backgroundColor = '#3174ad';
    if (event.type === 'appointment') {
      if (event.status === 'confirmed') {
        backgroundColor = '#D95C41'; // Brand Primary
      } else {
        backgroundColor = '#726FB2'; // Brand Secondary (Pending)
      }
    }

    // Availability styling
    if (event.type === 'availability') {
      backgroundColor = '#3174ad';
    }

    const style = {
      backgroundColor
    };
    return { style, className: styles.calendarEvent };
  };

  const handleGoogleCalendarSync = () => {
    if (!user) return;
    const redirectUrl = `/api/auth/google/redirect?userId=${user.uid}`;
    window.location.href = redirectUrl;
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
        <div className={styles.calendarContainer}>
          <UnifiedCalendar
            events={events}
            selectable={true} // Admin can select slots
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
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
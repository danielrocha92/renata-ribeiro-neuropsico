'use client';

import React, { useState, useEffect } from 'react';
import UnifiedCalendar, { CalendarEvent } from './UnifiedCalendar'; // Import generic component
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './BookingCalendar.module.css';

import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp, serverTimestamp } from 'firebase/firestore';
import CustomModal from './CustomModal';

// ...

const BookingCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type: 'alert' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    message: '',
    type: 'alert'
  });

  // ... useEffect fetchData ...

  const handleCloseModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const showAlert = (message: string, title?: string) => {
    setModal({
      isOpen: true,
      title,
      message,
      type: 'alert'
    });
  };

  const executeBooking = async (event: CalendarEvent) => {
    try {
      if (!db || !user) return;

      // 1. Create new appointment
      const appointmentTitle = `Consulta com ${user.displayName}`;
      const appointmentsCol = collection(db, 'appointments');
      await addDoc(appointmentsCol, {
        patientId: user.uid,
        patientName: user.displayName,
        psychologistId: event.psychologistId,
        title: appointmentTitle,
        date: event.start,
        start: event.start,
        end: event.end,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });

      // 2. Delete the availability slot
      if (event.id) {
        const availabilityDocRef = doc(db, 'availability', event.id);
        await deleteDoc(availabilityDocRef);
      }

      // 3. Update local state
      setEvents(prev => prev.filter(s => s.id !== event.id).concat([{
        id: 'temp_new_appt', // Temporary ID
        title: 'Indisponível',
        start: event.start,
        end: event.end,
        // @ts-ignore
        type: 'appointment'
      }]));

      showAlert("Consulta agendada com sucesso!", "Sucesso");

      // 4. Create Google Calendar event
      try {
        const response = await fetch('/api/create-calendar-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            appointment: {
              title: appointmentTitle,
              start: event.start.toISOString(),
              end: event.end.toISOString(),
            },
          }),
        });
        if (!response.ok) {
          // Log error but probably don't need to alert user again if internal booking worked
          console.error("Calendar API Error");
        }
      } catch (calendarError) {
        console.error("Erro ao criar evento no Google Calendar: ", calendarError);
      }

    } catch (error) {
      console.error("Erro ao agendar consulta: ", error);
      showAlert("Não foi possível completar o agendamento. Tente novamente.", "Erro");
    }
  };

  const handleSelectSlot = (slot: any) => {
    // slot here is actually an event in this logic
    const event = slot as CalendarEvent;

    if (event.type === 'appointment') {
      return;
    }

    if (!user || !db) {
      showAlert("Você precisa estar logado para agendar.", "Atenção");
      return;
    }

    setModal({
      isOpen: true,
      title: "Confirmar Agendamento",
      message: `Você gostaria de agendar uma consulta para ${event.start.toLocaleString('pt-BR')}?`,
      type: 'confirm',
      onConfirm: () => executeBooking(event)
    });
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    if (event.type === 'appointment') {
      return {
        style: {
          backgroundColor: '#e0e0e0', // Gray for unavailable/busy
          opacity: 0.8,
          color: '#666',
          border: '1px solid #ccc',
          display: 'block',
          cursor: 'not-allowed',
          boxShadow: 'none'
        }
      };
    }
    return {
      style: {
        backgroundColor: '#726FB2', // Brand Secondary (Purple/Blue) for Available
        color: 'white',
        border: 'none',
        display: 'block',
        cursor: 'pointer'
      }
    };
  };

  return (
    <div style={{ height: '70vh' }}>
      <UnifiedCalendar
        events={events}
        selectable={false}
        onSelectEvent={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
      />
      <CustomModal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        confirmText="Sim, agendar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default BookingCalendar;

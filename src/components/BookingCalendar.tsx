'use client';

import React, { useState, useEffect } from 'react';
import UnifiedCalendar, { CalendarEvent } from './UnifiedCalendar'; // Import generic component
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from '@/styles/BookingCalendar.module.css';

import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp, serverTimestamp, onSnapshot } from 'firebase/firestore';
import CustomModal from './CustomModal';

// ...

const BookingCalendar = () => {
  const { user } = useAuth();
  const [availEvents, setAvailEvents] = useState<CalendarEvent[]>([]);
  const [apptEvents, setApptEvents] = useState<CalendarEvent[]>([]);
  const events = [...availEvents, ...apptEvents];
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

  useEffect(() => {
    if (!db) return;

    // 1. Listen to Availability
    const availCol = collection(db, 'availability');
    const unsubAvail = onSnapshot(availCol, (snapshot) => {
      const list: CalendarEvent[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.start && data.end) {
          list.push({
            id: doc.id,
            title: 'Disponível',
            start: data.start instanceof Timestamp ? data.start.toDate() : new Date(data.start),
            end: data.end instanceof Timestamp ? data.end.toDate() : new Date(data.end),
            type: 'availability',
            psychologistId: data.psychologistId
          } as CalendarEvent);
        }
      });
      setAvailEvents(list);
    }, (error) => {
      console.error("Availability listener error:", error);
    });

    // 2. Listen to Appointments
    const apptCol = collection(db, 'appointments');
    const unsubAppt = onSnapshot(apptCol, (snapshot) => {
      const list: CalendarEvent[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.start && data.end) {
          list.push({
            id: doc.id,
            title: 'Indisponível', // Masked
            start: data.start instanceof Timestamp ? data.start.toDate() : new Date(data.start),
            end: data.end instanceof Timestamp ? data.end.toDate() : new Date(data.end),
            type: 'appointment',
            psychologistId: data.psychologistId
          } as CalendarEvent);
        }
      });
      setApptEvents(list);
    }, (error) => {
      console.error("Appointments listener error:", error);
    });

    return () => {
      unsubAvail();
      unsubAppt();
    };
  }, [user]);

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
        className: styles.eventUnavailable
      };
    }
    return {
      className: styles.eventAvailable
    };
  };

  return (
    <div>
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

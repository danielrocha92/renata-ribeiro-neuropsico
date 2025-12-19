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
          const isMyAppointment = user && data.patientId === user.uid;

          let title = 'Indisponível';
          let type: 'appointment' = 'appointment';

          if (isMyAppointment) {
            title = data.status === 'pending'
              ? (data.createdBy === 'admin' ? 'Solicitação de Consulta (Clique para confirmar)' : 'Aguardando Confirmação')
              : 'Minha Consulta';
          }

          list.push({
            id: doc.id,
            title,
            start: data.start instanceof Timestamp ? data.start.toDate() : new Date(data.start),
            end: data.end instanceof Timestamp ? data.end.toDate() : new Date(data.end),
            type,
            psychologistId: data.psychologistId,
            status: data.status,
            patientId: data.patientId,
            createdBy: data.createdBy
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
        status: 'pending',
        createdBy: 'client',
        createdAt: serverTimestamp(),
      });

      // 2. Delete the availability slot
      if (event.id) {
        const availabilityDocRef = doc(db, 'availability', event.id);
        await deleteDoc(availabilityDocRef);
      }

      showAlert("Solicitação enviada! Aguarde a confirmação da profissional.", "Solicitação Enviada");

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

  const handleSelectSlot = async (slot: any) => {
    // slot here is actually an event in this logic
    const event = slot as CalendarEvent;

    if (!user || !db) {
      showAlert("Você precisa estar logado para agendar.", "Atenção");
      return;
    }

    if (event.type === 'appointment') {
      // If it's my appointment and pending/admin created, allow confirm
      if (event.patientId === user.uid && event.status === 'pending' && event.createdBy === 'admin') {
        setModal({
          isOpen: true,
          title: "Confirmar Solicitação",
          message: `Deseja confirmar o agendamento proposto para ${event.start.toLocaleString('pt-BR')}?`,
          type: 'confirm',
          onConfirm: async () => {
            const eventRef = doc(db, 'appointments', event.id!);
            await import('firebase/firestore').then(({ updateDoc }) => updateDoc(eventRef, { status: 'confirmed' }));
            showAlert("Consulta confirmada com sucesso!", "Confirmado");
            setModal(prev => ({ ...prev, isOpen: false }));
          }
        });
        return;
      }
      return; // Can't interact with other appointments
    }

    setModal({
      isOpen: true,
      title: "Confirmar Agendamento",
      message: `Você gostaria de solicitar uma consulta para ${event.start.toLocaleString('pt-BR')}?`,
      type: 'confirm',
      onConfirm: () => executeBooking(event)
    });
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    if (event.type === 'appointment') {
      if (event.patientId === user?.uid) {
        if (event.status === 'pending') {
          return { className: styles.eventPending }; // Need to define this style or use inline style
        }
        return { className: styles.eventConfirmed };
      }
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

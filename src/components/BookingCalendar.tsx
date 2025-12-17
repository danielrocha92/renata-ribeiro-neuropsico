'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer
const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp, serverTimestamp } from 'firebase/firestore';

// ... (imports and localizer setup remain the same)

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  psychologistId?: string; // Keep track of who owns the slot
  type?: 'availability' | 'appointment';
}

const BookingCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (!db) return;

    const fetchData = async () => {
      if (!db) return;

      // Fetch Availability
      const availabilityCol = collection(db, 'availability');
      const availSnapshot = await getDocs(availabilityCol);
      const availEvents = availSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Disponível',
          start: (data.start as Timestamp).toDate(),
          end: (data.end as Timestamp).toDate(),
          psychologistId: data.psychologistId,
          type: 'availability' as const
        };
      });

      // Fetch Appointments (to show as Reserved)
      const appointmentsCol = collection(db, 'appointments');
      // Optionally filter by date or psychologist if needed in future
      const apptSnapshot = await getDocs(appointmentsCol);
      const apptEvents = apptSnapshot.docs.map(doc => {
        const data = doc.data();
        // Check if status is not cancelled
        if (data.status === 'cancelled') return null;

        return {
          id: doc.id,
          title: 'Indisponível', // Masking data
          start: (data.start as Timestamp).toDate(),
          end: (data.end as Timestamp).toDate(),
          psychologistId: data.psychologistId,
          type: 'appointment' as const
        };
      }).filter(e => e !== null) as CalendarEvent[];

      setEvents([...availEvents, ...apptEvents]);
    };

    fetchData();
  }, []);

  const handleSelectSlot = async (slot: CalendarEvent & { type?: string }) => {
    if (slot.type === 'appointment') {
      return; // Do nothing for reserved slots
    }

    if (!user || !db) {
      alert("Você precisa estar logado para agendar.");
      return;
    }

    const confirmation = confirm(
      `Você gostaria de agendar uma consulta para ${slot.start.toLocaleString('pt-BR')}?`
    );

    if (confirmation) {
      try {
        if (!db) return;

        // 1. Create new appointment
        const appointmentTitle = `Consulta com ${user.displayName}`;
        const appointmentsCol = collection(db, 'appointments');
        await addDoc(appointmentsCol, {
          patientId: user.uid,
          patientName: user.displayName,
          psychologistId: slot.psychologistId,
          title: appointmentTitle,
          date: slot.start,
          start: slot.start, // Ensure start/end are saved for calendar rendering
          end: slot.end,
          status: 'confirmed',
          createdAt: serverTimestamp(),
        });

        // 2. Delete the availability slot
        const availabilityDocRef = doc(db, 'availability', slot.id);
        await deleteDoc(availabilityDocRef);

        // 3. Update local state
        setEvents(prev => prev.filter(s => s.id !== slot.id).concat([{
          id: 'temp_new_appt', // Temporary ID
          title: 'Indisponível',
          start: slot.start,
          end: slot.end,
          psychologistId: slot.psychologistId,
          // @ts-ignore
          type: 'appointment'
        }]));

        alert("Consulta agendada com sucesso!");

        // 4. Create Google Calendar event (keeping existing logic)
        try {
          const response = await fetch('/api/create-calendar-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.uid,
              appointment: {
                title: appointmentTitle,
                start: slot.start.toISOString(),
                end: slot.end.toISOString(),
              },
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            if (data.error !== 'User has not connected their Google Calendar') {
              console.error("Calendar API Error:", data.error);
            }
          }

        } catch (calendarError) {
          console.error("Erro ao criar evento no Google Calendar: ", calendarError);
        }

      } catch (error) {
        console.error("Erro ao agendar consulta: ", error);
        alert("Não foi possível completar o agendamento. Tente novamente.");
      }
    }
  };

  const eventStyleGetter = (event: CalendarEvent & { type?: string }) => {
    if (event.type === 'appointment') {
      return {
        style: {
          backgroundColor: '#e74c3c', // Red/Gray for unavailable
          opacity: 0.6,
          color: 'white',
          border: '0px',
          display: 'block',
          cursor: 'not-allowed'
        }
      };
    }
    return {
      style: {
        backgroundColor: '#3174ad', // Blue for available
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        cursor: 'pointer'
      }
    };
  };

  return (
    <div style={{ height: '70vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        views={[Views.WEEK, Views.DAY]}
        selectable={false} // Disable slot selection, rely on event selection
        onSelectEvent={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        culture='pt-BR'
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
          date: "Data",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "Não há horários disponíveis neste período.",
          showMore: total => `+ Ver mais (${total})`
        }}
      />
    </div>
  );
};

export default BookingCalendar;

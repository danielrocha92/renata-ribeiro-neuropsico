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
}

const BookingCalendar = () => {
  const { user } = useAuth();
  const [availableSlots, setAvailableSlots] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (!db) return;

    const fetchAvailability = async () => {
      if (!db) return;
      const availabilityCol = collection(db, 'availability');
      const querySnapshot = await getDocs(availabilityCol);
      const fetchedSlots = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Disponível',
          start: (data.start as Timestamp).toDate(),
          end: (data.end as Timestamp).toDate(),
          psychologistId: data.psychologistId,
        };
      });
      setAvailableSlots(fetchedSlots);
    };

    fetchAvailability();
  }, []);

  const handleSelectSlot = async (slot: CalendarEvent) => {
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
          date: slot.start, // Using the start time as the main date
          status: 'confirmed', // Automatically confirmed
          createdAt: serverTimestamp(),
        });

        // 2. Delete the availability slot
        const availabilityDocRef = doc(db, 'availability', slot.id);
        await deleteDoc(availabilityDocRef);

        // 3. Update local state to remove the slot from the calendar
        setAvailableSlots(prevSlots => prevSlots.filter(s => s.id !== slot.id));

        alert("Consulta agendada com sucesso!");

        // 4. Create Google Calendar event
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
            const errorData = await response.json();
            // If the calendar is not connected, we don't need to show an error.
            // The user can connect it later.
            if (errorData.error !== 'User has not connected their Google Calendar') {
              throw new Error(errorData.error || 'Falha ao criar evento no Google Calendar.');
            }
          }
        } catch (calendarError) {
          console.error("Erro ao criar evento no Google Calendar: ", calendarError);
          alert("Sua consulta foi agendada, mas não foi possível adicioná-la ao seu Google Calendar. Por favor, verifique a conexão do calendário na sua área de cliente.");
        }

      } catch (error) {
        console.error("Erro ao agendar consulta: ", error);
        alert("Não foi possível completar o agendamento. Tente novamente.");
      }
    }
  };

  return (
    <div style={{ height: '70vh' }}>
      <Calendar
        localizer={localizer}
        events={availableSlots}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        views={[Views.WEEK, Views.DAY]}
        selectable
        onSelectEvent={handleSelectSlot}
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

'use client';

import React, { useState, useEffect } from 'react';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from '@/styles/Admin.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

// Setup the localizer by providing the functions we imported from date-fns
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

interface AvailabilityEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
}

const DisponibilidadePage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<AvailabilityEvent[]>([]);

  // Fetch existing availability from Firestore on component mount
  useEffect(() => {
    if (!user || !db) return;

    const fetchAvailability = async () => {
      if (!db) return;
      const availabilityCol = collection(db, 'availability');
      const q = query(availabilityCol, where('psychologistId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedEvents = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          start: (data.start as Timestamp).toDate(),
          end: (data.end as Timestamp).toDate(),
        };
      });
      setEvents(fetchedEvents);
    };

    fetchAvailability();
  }, [user]);

  const handleSelectSlot = async ({ start, end }: { start: Date; end: Date }) => {
    if (!user || !db) {
      alert('Você precisa estar logado para adicionar disponibilidade.');
      return;
    }

    const title = 'Disponível';
    const newEvent: Omit<AvailabilityEvent, 'id'> & { psychologistId: string } = {
      start,
      end,
      title,
      psychologistId: user.uid,
    };

    try {
      if (!db) return;
      const availabilityCol = collection(db, 'availability');
      const docRef = await addDoc(availabilityCol, newEvent);
      setEvents(prevEvents => [...prevEvents, { ...newEvent, id: docRef.id, start, end, title }]);
      alert(`Horário adicionado com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar disponibilidade: ", error);
      alert("Ocorreu um erro ao salvar o horário.");
    }
  };

  return (
    <AdminPrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Gerenciar Disponibilidade</h1>
          <p>Clique e arraste nos horários do calendário para adicionar ou remover sua disponibilidade.</p>
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
              noEventsInRange: "Não há eventos neste período.",
              showMore: total => `+ Ver mais (${total})`
            }}
          />
        </div>
      </div>
    </AdminPrivateRoute>
  );
};

export default DisponibilidadePage;
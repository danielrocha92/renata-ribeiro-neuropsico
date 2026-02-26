import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CalendarEvent } from '@/components/UnifiedCalendar';

interface UseCalendarEventsProps {
    userId?: string;
    role: 'admin' | 'client';
}

export const useCalendarEvents = ({ userId, role }: UseCalendarEventsProps) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const availCol = collection(db, 'availability');
        const apptCol = collection(db, 'appointments');

        let availQuery = query(availCol);
        let apptQuery = query(apptCol);

        // If Admin, we usually only care about their own schedule
        if (role === 'admin' && userId) {
            availQuery = query(availCol, where('psychologistId', '==', userId));
            apptQuery = query(apptCol, where('psychologistId', '==', userId));
        }
        // If Client, we fetch all to show busy slots, but we might want to filter by psychologist if selected (not implemented yet globally)
        // For now we assume one psychologist or showing all availability.

        let availEvents: CalendarEvent[] = [];
        let apptEvents: CalendarEvent[] = [];

        const updateEvents = () => {
            setEvents([...availEvents, ...apptEvents]);
            setLoading(false);
        };

        const unsubAvail = onSnapshot(availQuery, (snapshot) => {
            availEvents = snapshot.docs.map(doc => {
                const data = doc.data();
                const start = data.start instanceof Timestamp ? data.start.toDate() : (data.start ? new Date(data.start) : null);
                const end = data.end instanceof Timestamp ? data.end.toDate() : (data.end ? new Date(data.end) : null);

                if (!start || !end) return null;

                return {
                    id: doc.id,
                    title: 'Disponível',
                    start,
                    end,
                    type: 'availability',
                    psychologistId: data.psychologistId
                } as CalendarEvent;
            }).filter((e): e is CalendarEvent => e !== null);

            updateEvents();
        }, (err) => {
            console.error("Availability listener error:", err);
            setError("Erro ao carregar disponibilidade.");
        });

        const unsubAppt = onSnapshot(apptQuery, (snapshot) => {
            apptEvents = snapshot.docs.map(doc => {
                const data = doc.data();
                const start = data.start instanceof Timestamp ? data.start.toDate() : (data.start ? new Date(data.start) : null);
                const end = data.end instanceof Timestamp ? data.end.toDate() : (data.end ? new Date(data.end) : null);

                if (!start || !end) return null;

                let title = data.title || 'Agendado';
                let type: 'appointment' = 'appointment';
                const patientName = data.patientName || (data.title && data.title.startsWith('Consulta com') ? data.title.replace('Consulta com ', '') : 'Paciente');

                // CLIENT VIEW LOGIC
                if (role === 'client') {
                    const isMyAppointment = userId && data.patientId === userId;

                    if (isMyAppointment) {
                        title = data.status === 'pending'
                            ? (data.createdBy === 'admin' ? 'Solicitação de Consulta (Clique para confirmar)' : 'Aguardando Confirmação')
                            : 'Minha Consulta';
                    } else {
                        // Mask other appointments
                        title = 'Indisponível';
                        // We strip personal info for privacy if it was fetched (though ideally security rules handles this)
                    }
                }
                // ADMIN VIEW LOGIC
                else if (role === 'admin') {
                    title = patientName;
                }

                return {
                    id: doc.id,
                    title, // Display title
                    start,
                    end,
                    type: type,
                    status: data.status,
                    patientId: data.patientId,
                    patientName: patientName,
                    createdBy: data.createdBy,
                    psychologistId: data.psychologistId,
                } as CalendarEvent;
            }).filter((e): e is CalendarEvent => e !== null);

            updateEvents();
        }, (err) => {
            console.error("Appointments listener error:", err);
            setError("Erro ao carregar agendamentos.");
        });

        return () => {
            unsubAvail();
            unsubAppt();
        };
    }, [userId, role]);

    return { events, loading, error };
};

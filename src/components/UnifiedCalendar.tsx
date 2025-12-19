'use client';

import { useState, useCallback, FC } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from '@/styles/BookingCalendar.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

export interface CalendarEvent {
    id?: string;
    title: string;
    start: Date;
    end: Date;
    type: 'availability' | 'appointment';
    status?: 'confirmed' | 'pending';
    patientId?: string;
    createdBy?: 'admin' | 'client';
    psychologistId?: string;
    patientName?: string;
}

interface UnifiedCalendarProps {
    events: CalendarEvent[];
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
    onSelectEvent?: (event: CalendarEvent) => void;
    eventPropGetter?: (event: CalendarEvent) => { className?: string; style?: React.CSSProperties };
    defaultView?: string;
    selectable?: boolean;
}

// Custom Toolbar Component extracted for reuse
const CustomToolbar = ({ date, view, onNavigate, onView }: any) => {
    const goToBack = () => onNavigate('PREV');
    const goToNext = () => onNavigate('NEXT');
    const goToCurrent = () => onNavigate('TODAY');

    const label = () => {
        return (
            <span className={styles.label}>
                {format(date, 'MMMM yyyy', { locale: ptBR })}
            </span>
        );
    };

    return (
        <div className={styles.toolbar}>
            <div className={styles.navigationButtons}>
                <button className={styles.navButton} onClick={goToBack} type="button">
                    <ChevronLeft size={18} />
                </button>
                <button className={styles.navButton} onClick={goToCurrent} type="button">
                    Hoje
                </button>
                <button className={styles.navButton} onClick={goToNext} type="button">
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className={styles.label}>
                {label()}
            </div>

            <div className={styles.viewButtons}>
                <button
                    className={`${styles.viewButton} ${view === 'week' ? styles.active : ''}`}
                    onClick={() => onView('week')}
                    type="button"
                >
                    Semana
                </button>
                <button
                    className={`${styles.viewButton} ${view === 'day' ? styles.active : ''}`}
                    onClick={() => onView('day')}
                    type="button"
                >
                    Dia
                </button>
                <button
                    className={`${styles.viewButton} ${view === 'month' ? styles.active : ''}`}
                    onClick={() => onView('month')}
                    type="button"
                >
                    Mês
                </button>
            </div>
        </div>
    );
};


const UnifiedCalendar: FC<UnifiedCalendarProps> = ({
    events,
    onSelectSlot,
    onSelectEvent,
    eventPropGetter,
    defaultView = Views.WEEK,
    selectable = true
}) => {
    const [view, setView] = useState<any>(defaultView); // Use any or string for view state to avoid type conflicts
    const [date, setDate] = useState(new Date());

    const onNavigate = useCallback((newDate: Date) => setDate(newDate), []);
    const onView = useCallback((newView: any) => setView(newView), []);

    return (
        <div className={styles.calendarContainer}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"

                // Controlled Props
                view={view}
                date={date}
                onNavigate={onNavigate}
                onView={onView}

                views={[Views.WEEK, Views.DAY, Views.MONTH]}
                selectable={selectable}
                onSelectSlot={onSelectSlot}
                onSelectEvent={onSelectEvent}
                eventPropGetter={eventPropGetter}

                components={{
                    toolbar: CustomToolbar
                }}

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

export default UnifiedCalendar;

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import UnifiedCalendar, { CalendarEvent } from '@/components/UnifiedCalendar';
import styles from '@/styles/Admin.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import AppointmentModal from '@/components/AppointmentModal';
import CustomModal from './CustomModal';

const AdminCalendar = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
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
            showAlert('Este horário já está ocupado.', 'Atenção');
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
                    patientName: patientName || title,
                    patientId: patientId,
                    start,
                    end,
                    status: 'confirmed', // Admin appointments are confirmed by default
                    createdAt: serverTimestamp()
                };

                await addDoc(collection(db, 'appointments'), newAppointment);
            } else if (id && type === 'appointment') { // Update existing appointment
                const eventRef = doc(db, 'appointments', id);
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
            showAlert("Erro ao salvar agendamento.", "Erro");
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
            backgroundColor,
            borderRadius: '6px',
            opacity: 0.9,
            color: 'white',
            border: 'none',
            display: 'block',
            fontSize: '0.85rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        };
        return { style };
    };

    const handleGoogleCalendarSync = () => {
        if (!user) return;
        const redirectUrl = `/api/auth/google/redirect?userId=${user.uid}`;
        window.location.href = redirectUrl;
    };

    // Check auth provider
    const isGoogleAuth = user?.providerData.some(p => p.providerId === 'google.com');

    return (
        <div className={styles.container}>
            <header className={styles.header} style={{ marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Gerenciar Agendamentos</h1>
                    <p>Clique em um horário para agendar ou em um agendamento para editar/excluir.</p>
                </div>
                {user && !isGoogleAuth && (
                    <button onClick={handleGoogleCalendarSync} className={styles.googleButton}>
                        Vincular com Google Agenda
                    </button>
                )}
            </header>
            <div style={{ height: '70vh', marginTop: '1rem' }}>
                <UnifiedCalendar
                    events={events}
                    selectable={true}
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
            <CustomModal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
                confirmText="OK"
                cancelText="Cancelar"
            />
        </div>
    );
};

export default AdminCalendar;

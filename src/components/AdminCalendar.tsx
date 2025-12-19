'use client';

import React, { useState } from 'react';
import UnifiedCalendar, { CalendarEvent } from '@/components/UnifiedCalendar';
import { useCalendarEvents } from '@/hooks/useCalendarEvents'; // Added import
import styles from '@/styles/Admin.module.css';
import utils from '@/styles/Utils.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import AppointmentModal from '@/components/AppointmentModal';
import CustomModal from './CustomModal';

const AdminCalendar = () => {
    const { user } = useAuth();
    const { events } = useCalendarEvents({ userId: user?.uid, role: 'admin' });
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
                    date: start, // Adding compatibility field
                    start,
                    end,
                    status: 'pending', // Per requirement: "se o paciente solicitar a consulta, deve chegar para o admin e vice e versa"
                    createdBy: 'admin',
                    createdAt: serverTimestamp()
                };

                await addDoc(collection(db, 'appointments'), newAppointment);
            } else if (id && type === 'appointment') { // Update existing appointment
                const eventRef = doc(db, 'appointments', id);
                await updateDoc(eventRef, {
                    patientName: patientName || title,
                    patientId: patientId,
                    date: start, // Adding compatibility field
                    start,
                    end
                });
            }
            closeModal();
            // No need to fetchEvents(), onSnapshot in hook will update
        } catch (err) {
            console.error("Error saving appointment:", err);
            showAlert("Erro ao salvar agendamento.", "Erro");
        }
    };

    const handleConfirm = async (id: string) => {
        if (!db) return;
        const eventRef = doc(db, 'appointments', id);
        await updateDoc(eventRef, { status: 'confirmed' });

        // Notify Client
        const eventToConfirm = events.find(e => e.id === id);
        if (eventToConfirm && eventToConfirm.patientId) {
            // We need to fetch patient Email ideally, or use a notification system that the client listens to.
            // But user asked for email.
            // I'll import sendNotificationEmail.
            await import('@/lib/notifications').then(async ({ sendNotificationEmail }) => {
                // Try to fetch patient email
                try {
                    const patientDoc = await import('firebase/firestore').then(({ getDoc, doc }) => getDoc(doc(db, 'users', eventToConfirm.patientId!)));
                    if (patientDoc.exists()) {
                        const patientEmail = patientDoc.data().email;
                        if (patientEmail) {
                            sendNotificationEmail(patientEmail, 'appointment_confirmed', `Data: ${eventToConfirm.start.toLocaleString()}`);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching patient email for notification:", err);
                }
            });
        }

        closeModal();
    };

    const handleDelete = async (id: string) => {
        if (!db) return;
        await deleteDoc(doc(db, 'appointments', id));
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

    // Check auth provider
    const isGoogleAuth = user?.providerData.some(p => p.providerId === 'google.com');

    return (
        <div className={styles.container}>
            <header className={`${styles.header} ${utils.mb0}`}>
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
            <div className={utils.mt1}>
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

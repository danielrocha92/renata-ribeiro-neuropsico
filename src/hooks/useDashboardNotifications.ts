import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Notifications {
    appointments: number;
    messages: number;
    documents: number;
}

export const useDashboardNotifications = (userId: string | undefined, role: 'admin' | 'client') => {
    const [notifications, setNotifications] = useState<Notifications>({
        appointments: 0,
        messages: 0,
        documents: 0
    });

    useEffect(() => {
        if (!userId || !db) return;

        const unsubs: (() => void)[] = [];

        // 1. APPOINTMENTS
        if (role === 'admin') {
            const qAppt = query(
                collection(db, 'appointments'),
                where('status', '==', 'pending'),
                where('createdBy', '==', 'client')
            );
            unsubs.push(onSnapshot(qAppt, snap => {
                setNotifications(prev => ({ ...prev, appointments: snap.size }));
            }));
        } else {
            const qAppt = query(
                collection(db, 'appointments'),
                where('patientId', '==', userId),
                where('status', '==', 'pending'),
                where('createdBy', '==', 'admin')
            );
            unsubs.push(onSnapshot(qAppt, snap => {
                setNotifications(prev => ({ ...prev, appointments: snap.size }));
            }));
        }

        // 2. MESSAGES (CHAT)
        if (role === 'admin') {
            // For admin, we count chats with unreadCount > 0
            // Assuming 'chats' collection has a document per patient-chat
            const qChat = query(
                collection(db, 'chats'),
                where('unreadCount', '>', 0)
            );
            unsubs.push(onSnapshot(qChat, snap => {
                // We can either count rooms with unread messages, or sum total unread.
                // Let's count rooms for the badge.
                setNotifications(prev => ({ ...prev, messages: snap.size }));
            }));
        } else {
            // For client, we just assume 'chats/{userId}/messages' is the path?
            // Or 'chats/{something}' where patientId is userId.
            // Typically the chat room ID IS the patientId (based on AdminChatPage line 23: id: string; // This is the patientId).
            const chatsRef = collection(db, `chats/${userId}/messages`);
            const qChat = query(
                chatsRef,
                where('read', '==', false),
                where('senderId', '==', 'admin')
            );
            unsubs.push(onSnapshot(qChat, snap => {
                setNotifications(prev => ({ ...prev, messages: snap.size }));
            }));
        }

        // 3. DOCUMENTS
        if (role === 'client') {
            // Check for documents where patientId == userId AND read == false
            const qDocs = query(
                collection(db, 'documents'),
                where('patientId', '==', userId),
                where('read', '==', false) // Note: Need to make sure we set this on creation
            );
            unsubs.push(onSnapshot(qDocs, snap => {
                setNotifications(prev => ({ ...prev, documents: snap.size }));
            }));
        }
        // Admin usually doesn't need "unread documents" unless client uploads (which isn't implemented yet).

        return () => {
            unsubs.forEach(u => u());
        };
    }, [userId, role]);

    return notifications;
};

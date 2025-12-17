'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Admin.module.css';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';
import { Send, User, MessageSquare } from 'lucide-react';

interface ChatRoom {
    id: string; // This is the patientId
    patientName: string;
    lastMessage: string;
    lastUpdated: Timestamp;
}

interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: Timestamp;
}

const AdminChatPage = () => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [reply, setReply] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    // Fetch Chat Rooms (Inbox)
    useEffect(() => {
        const q = query(collection(db, 'chats'), orderBy('lastUpdated', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            const roomList = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatRoom));
            setRooms(roomList);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Messages when a room is selected
    useEffect(() => {
        if (!selectedRoomId) return;

        const q = query(
            collection(db, `chats/${selectedRoomId}/messages`),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Message));
            setMessages(msgs);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => unsubscribe();
    }, [selectedRoomId]);

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !selectedRoomId) return;

        try {
            // Admin sends message. Sender can be 'admin' or the admin's actual UID if available.
            // We'll use 'admin' for simplicity or the current auth user.
            await addDoc(collection(db, `chats/${selectedRoomId}/messages`), {
                text: reply,
                senderId: 'admin',
                createdAt: serverTimestamp(),
                read: false
            });

            // Update parent to bump it to top
            await updateDoc(doc(db, 'chats', selectedRoomId), {
                lastMessage: `Você: ${reply}`,
                lastUpdated: serverTimestamp(),
                unreadCount: 0 // Admin replied, so presumably read? Or logic for client unread.
            });
            setReply('');
        } catch (error) {
            console.error("Error replying:", error);
        }
    };

    return (
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Atendimento Online</h1>
                </header>

                <div className={styles.chatContainer}>

                    {/* Sidebar: Room List */}
                    <div className={`${styles.chatList} ${selectedRoomId ? styles.hiddenMobile : ''}`}>
                        <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem' }}>Conversas</h3>
                        {rooms.length === 0 && <p style={{ color: '#888' }}>Nenhuma conversa iniciada.</p>}
                        {rooms.map(room => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedRoomId(room.id)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    backgroundColor: selectedRoomId === room.id ? '#f0f7ff' : 'transparent',
                                    borderRadius: '4px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                    <User size={16} color="#666" />
                                    <span style={{ fontWeight: 600 }}>{room.patientName || 'Usuário'}</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {room.lastMessage}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                    {room.lastUpdated?.seconds ? new Date(room.lastUpdated.seconds * 1000).toLocaleDateString() : ''}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Main Chat Area */}
                    <div className={`${styles.chatMain} ${!selectedRoomId ? styles.hiddenMobile : ''}`}>
                        {selectedRoomId ? (
                            <>
                                <div className={styles.chatHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button className={styles.backButton} onClick={() => setSelectedRoomId(null)}>
                                            ← Voltar
                                        </button>
                                        <strong>Chat com {rooms.find(r => r.id === selectedRoomId)?.patientName}</strong>
                                    </div>
                                </div>

                                <div className={styles.messageArea}>
                                    {messages.map(msg => {
                                        const isAdmin = msg.senderId === 'admin';
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`${styles.messageBubble} ${isAdmin ? styles.messageAdmin : styles.messageUser}`}
                                            >
                                                <p style={{ margin: 0 }}>{msg.text}</p>
                                                <span style={{ display: 'block', marginTop: '0.3rem', fontSize: '0.7rem', opacity: 0.7, textAlign: 'right' }}>
                                                    {msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                                </span>
                                            </div>
                                        )
                                    })}
                                    <div ref={bottomRef} />
                                </div>

                                <form onSubmit={handleSendReply} className={styles.inputArea}>
                                    <input
                                        type="text"
                                        value={reply}
                                        onChange={e => setReply(e.target.value)}
                                        placeholder="Digite sua resposta..."
                                        className={styles.input}
                                        style={{ borderRadius: '24px' }}
                                    />
                                    <button type="submit" className={styles.button} style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Send size={20} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                <MessageSquare size={48} style={{ marginBottom: '1rem' }} />
                                <p>Selecione uma conversa para visualizar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminChatPage;

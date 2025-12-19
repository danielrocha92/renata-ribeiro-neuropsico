'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Chat.module.css';
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
            await addDoc(collection(db, `chats/${selectedRoomId}/messages`), {
                text: reply,
                senderId: 'admin',
                createdAt: serverTimestamp(),
                read: false
            });

            await updateDoc(doc(db, 'chats', selectedRoomId), {
                lastMessage: `Você: ${reply}`,
                lastUpdated: serverTimestamp(),
                unreadCount: 0 // Admin replied
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
                    <h1 className={styles.headerTitle}>Atendimento Online</h1>
                </header>

                <div className={styles.chatLayout} style={{ display: 'grid', gridTemplateColumns: selectedRoomId ? '1fr' : '1fr', height: 'calc(100vh - 80px)' }}>
                    {/* Simplified for now, using Chat.module rules */}

                    {/* We need sidebar + main. Chat.module doesn't mandate sidebar styles yet.
                        Let's reuse Admin styles for sidebar or create specific ones.
                        Actually, let's keep the existing logic but using Chat.module for the message bubbles.
                    */}

                    {/* Sidebar: Room List */}
                    <div className={`${styles.chatList || 'sidebar'}`} style={{
                        width: selectedRoomId ? '300px' : '100%',
                        display: selectedRoomId && window.innerWidth < 768 ? 'none' : 'block',
                        borderRight: '1px solid #ddd',
                        overflowY: 'auto',
                        background: 'white'
                    }}>
                        {/* Inline styles for sidebar temporarily until we add Sidebar styles to Chat.module or reuse */}
                        <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                            <h3 style={{ margin: 0 }}>Conversas</h3>
                        </div>
                        {rooms.length === 0 && <p style={{ padding: '1rem', color: '#888' }}>Nenhuma conversa.</p>}
                        {rooms.map(room => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedRoomId(room.id)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    backgroundColor: selectedRoomId === room.id ? '#f0f7ff' : 'transparent'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                    <User size={16} color="#666" />
                                    <span style={{ fontWeight: 600 }}>{room.patientName || 'Usuário'}</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                    {room.lastMessage}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Main Chat Area */}
                    {/* Styles from Chat.module can be used for the message area */}
                    <div className={styles.chatMain} style={{
                        margin: 0,
                        display: !selectedRoomId && window.innerWidth < 768 ? 'none' : 'flex',
                        flex: 1
                    }}>
                        {selectedRoomId ? (
                            <>
                                <div className={styles.header} style={{ backgroundColor: '#f9f9f9', padding: '0.5rem 1rem' }}>
                                    <button onClick={() => setSelectedRoomId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '1rem', display: 'md-none' }}>
                                        ←
                                    </button>
                                    <strong>{rooms.find(r => r.id === selectedRoomId)?.patientName}</strong>
                                </div>

                                <div className={styles.messagesContainer}>
                                    {messages.map(msg => {
                                        const isAdmin = msg.senderId === 'admin';
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`${styles.messageBubble} ${isAdmin ? styles.messageOwn : styles.messageOther}`} // Using Chat.module styles
                                                style={{ backgroundColor: isAdmin ? '#6A7EBD' : '#fff', color: isAdmin ? 'white' : '#333' }}
                                            >
                                                <p style={{ margin: 0 }}>{msg.text}</p>
                                                <span className={styles.messageTime}>
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
                                        className={styles.inputField}
                                    />
                                    <button type="submit" className={styles.sendButton}>
                                        <Send size={20} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                <MessageSquare size={48} style={{ marginBottom: '1rem' }} />
                                <p>Selecione uma conversa.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminChatPage;

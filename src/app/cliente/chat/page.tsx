'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Cliente.module.css';
import PrivateRoute from '@/components/PrivateRoute';
import { ArrowLeft, Send, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    addDoc,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    doc,
    setDoc
} from 'firebase/firestore';

interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: Timestamp;
}

const ChatPage: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user || !db) return;

        // Reference to the specific chat room for this user
        // We structure it as: chats/{userId}/messages/{messageId}
        const q = query(
            collection(db, `chats/${user.uid}/messages`),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            setMessages(msgs);
            // Scroll to bottom on new message
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user || !db) return;

        try {
            // Add message to subcollection
            await addDoc(collection(db, `chats/${user.uid}/messages`), {
                text: message,
                senderId: user.uid,
                createdAt: serverTimestamp(),
                read: false
            });

            // Update parent chat document for Admin Inbox visibility
            await setDoc(doc(db, "chats", user.uid), {
                lastMessage: message,
                lastUpdated: serverTimestamp(),
                patientId: user.uid,
                patientName: user.displayName || user.email || "Usuário",
                unreadCount: 1
            }, { merge: true });

            setMessage('');
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            alert("Erro ao enviar mensagem.");
        }
    };

    return (
        <PrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Fale com o Profissional</h1>
                            <p>Canal de comunicação direta e segura.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainContent} style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
                    <div className={styles.section} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>

                        {/* Chat Area */}
                        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: '#f5f7fa', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>
                                    Envie uma mensagem para iniciar o atendimento.
                                </p>
                            )}
                            {messages.map(msg => {
                                const isMe = msg.senderId === user?.uid;
                                return (
                                    <div
                                        key={msg.id}
                                        style={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            maxWidth: '75%',
                                            backgroundColor: isMe ? '#6A7EBD' : '#fff',
                                            color: isMe ? 'white' : '#333',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            borderBottomRightRadius: isMe ? '2px' : '12px',
                                            borderBottomLeftRadius: isMe ? '12px' : '2px',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <p style={{ margin: 0 }}>{msg.text}</p>
                                        <span style={{ display: 'block', marginTop: '0.4rem', fontSize: '0.7rem', opacity: 0.7, textAlign: 'right' }}>
                                            {msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #eee', backgroundColor: 'white', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '24px', border: '1px solid #ddd', outline: 'none' }}
                            />
                            <button
                                type="submit"
                                className={styles.actionButton}
                                style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}>
                        <Lock size={10} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Esta conversa é criptografada e confidencial.
                    </p>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default ChatPage;

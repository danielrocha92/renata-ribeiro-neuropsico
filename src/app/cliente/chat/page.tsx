'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Chat.module.css'; // Updated import
import utils from '@/styles/Utils.module.css';
import PrivateRoute from '@/components/PrivateRoute';
import { ArrowLeft, Send, Lock, FileText, Image as ImageIcon, Check, CheckCheck } from 'lucide-react';
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
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    read?: boolean;
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
        const q = query(
            collection(db, `chats/${user.uid}/messages`),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            // Mark admin messages as read
            msgs.forEach(async (msg) => {
                if (msg.senderId === 'admin' && msg.read === false) {
                    await import('firebase/firestore').then(({ updateDoc, doc }) => {
                        updateDoc(doc(db, `chats/${user.uid}/messages`, msg.id), { read: true });
                    });
                }
            });

            setMessages(msgs);
            // Scroll to bottom
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user || !db) return;

        try {
            await addDoc(collection(db, `chats/${user.uid}/messages`), {
                text: message,
                senderId: user.uid,
                createdAt: serverTimestamp(),
                read: false
            });

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

    const renderMessageContent = (msg: Message) => {
        if (msg.fileUrl) {
            const isImage = msg.fileType?.startsWith('image/');
            return (
                <div className={utils.flexColumn}>
                    {isImage ? (
                        <img
                            src={msg.fileUrl}
                            alt={msg.fileName}
                            className={styles.chatImage}
                            onClick={() => window.open(msg.fileUrl, '_blank')}
                        />
                    ) : (
                        <div className={styles.fileAttachment}>
                            <FileText size={20} />
                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                                {msg.fileName || 'Arquivo'}
                            </a>
                        </div>
                    )}
                    {msg.text && <p className={utils.m0}>{msg.text}</p>}
                </div>
            );
        }
        return <p className={utils.m0}>{msg.text}</p>;
    };

    return (
        <PrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <button onClick={() => router.back()} className={utils.iconButtonSecondary}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className={styles.headerContent}>
                        <h1 className={styles.headerTitle}>Fale com o Profissional</h1>
                        <p className={styles.headerSubtitle}>Canal de comunicação direta e segura.</p>
                    </div>
                </header>

                <div className={styles.chatLayout}>
                    <div className={styles.chatMain}>
                        <div className={styles.messagesContainer}>
                            {messages.length === 0 && (
                                <p className={`${utils.textCenter} ${utils.textMuted} ${utils.mt2}`}>
                                    Envie uma mensagem para iniciar o atendimento.
                                </p>
                            )}
                            {messages.map(msg => {
                                const isMe = msg.senderId === user?.uid;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`${styles.messageBubble} ${isMe ? styles.messageOwn : styles.messageOther}`}
                                    >
                                        {renderMessageContent(msg)}
                                        <span className={styles.messageTime}>
                                            {msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                            {isMe && (
                                                <span className={utils.ml05}>
                                                    {msg.read ? <CheckCheck size={14} className={styles.iconRead} /> : <Check size={14} className={styles.iconUnread} />}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className={styles.inputArea}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className={styles.inputField}
                            />
                            {/* File upload temporarily disabled due to Free Plan limitations
                            <label className={styles.attachButton}>
                                <Paperclip size={20} />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className={utils.dNone}
                                />
                            </label>
                             */}
                            <button
                                type="submit"
                                className={styles.sendButton}
                                disabled={!message.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                        <div className={styles.encryptionNote}>
                            <Lock size={10} className={`${utils.verticalAlignMiddle} ${utils.mr05}`} />
                            Esta conversa é criptografada e confidencial.
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default ChatPage;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Chat.module.css';
import utils from '@/styles/Utils.module.css';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import { db, storage } from '@/lib/firebase';
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    Timestamp,
    where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Send, User, MessageSquare, Paperclip, FileText, Image as ImageIcon, Check, CheckCheck, Plus, X, Search } from 'lucide-react';

interface ChatRoom {
    id: string; // This is the patientId
    patientName: string;
    lastMessage: string;
    lastUpdated: Timestamp;
    unreadCount?: number;
}

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

const AdminChatPage = () => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [reply, setReply] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [allPatients, setAllPatients] = useState<any[]>([]);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

    // Fetch Chat Rooms (Inbox)
    useEffect(() => {
        const q = query(collection(db, 'chats'), orderBy('lastUpdated', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            const roomList = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatRoom));
            setRooms(roomList);
        });
        return () => unsubscribe();
    }, []);

    // Fetch All Patients for New Chat
    useEffect(() => {
        const fetchPatients = async () => {
            const q = query(collection(db, 'users'), where('userType', '==', 'paciente'));
            const snap = await import('firebase/firestore').then(({ getDocs }) => getDocs(q));
            setAllPatients(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
        };
        fetchPatients();
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

            // Mark patient messages as read
            msgs.forEach(async (msg) => {
                if (msg.senderId !== 'admin' && msg.read === false) {
                    // Update message read status
                    await import('firebase/firestore').then(({ updateDoc, doc }) => {
                        updateDoc(doc(db, `chats/${selectedRoomId}/messages`, msg.id), { read: true });
                    });
                }
            });
            // Also update room unread count to 0 if needed (already done in handleSendReply but good to do on open too if just reading)
            if (snap.docs.some(d => d.data().senderId !== 'admin' && d.data().read === false)) {
                // But simplified: we can just reset unreadCount on the room doc if we are viewing it.
                // However, the room list listener might need this update to clear the badge.
                import('firebase/firestore').then(({ updateDoc, doc }) => {
                    updateDoc(doc(db, 'chats', selectedRoomId), { unreadCount: 0 });
                });
            }

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

            // Use setDoc with merge: true to create the room if it doesn't exist
            await import('firebase/firestore').then(({ setDoc, doc }) => {
                setDoc(doc(db, 'chats', selectedRoomId), {
                    lastMessage: `Você: ${reply}`,
                    lastUpdated: serverTimestamp(),
                    unreadCount: 0, // Admin replied
                    // If creates new, we might need patientId and patientName.
                    // If it's a new chat initiated by admin, these fields are crucial for the list.
                    // We can try to find the patientName from allPatients if available.
                    patientId: selectedRoomId,
                    patientName: rooms.find(r => r.id === selectedRoomId)?.patientName || allPatients.find(p => p.uid === selectedRoomId)?.name || 'Paciente'
                }, { merge: true });
            });

            setReply('');
        } catch (error) {
            console.error("Error replying:", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedRoomId) return;

        // Validar tamanho (ex: 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Arquivo muito grande. Máximo 5MB.');
            return;
        }

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `chat_uploads/${selectedRoomId}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Send message with file
            await addDoc(collection(db, `chats/${selectedRoomId}/messages`), {
                text: '', // Empty text for file messages
                fileUrl: downloadURL,
                fileName: file.name,
                fileType: file.type,
                senderId: 'admin',
                createdAt: serverTimestamp(),
                read: false
            });

            await updateDoc(doc(db, 'chats', selectedRoomId), {
                lastMessage: `Você enviou um arquivo: ${file.name}`,
                lastUpdated: serverTimestamp(),
                unreadCount: 0
            });

        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Erro ao enviar arquivo.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
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
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>Atendimento Online</h1>
                </header>

                <div className={styles.adminChatLayout}>

                    {/* Sidebar: Room List */}
                    <div className={`${styles.chatList} ${selectedRoomId ? styles.hiddenMobile : ''}`}>
                        <div className={styles.sidebarHeader}>
                            <h3 className={utils.m0}>Conversas</h3>
                            <button onClick={() => setIsNewChatModalOpen(true)} className={utils.iconButtonSecondary} title="Nova Conversa">
                                <Plus size={20} />
                            </button>
                        </div>
                        {rooms.length === 0 && <p className={`${utils.p1} ${utils.textMuted}`}>Nenhuma conversa iniciada.</p>}
                        {rooms.map(room => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedRoomId(room.id)}
                                className={`${styles.roomItem} ${selectedRoomId === room.id ? styles.roomItemSelected : ''}`}
                            >
                                <div className={`${utils.flexRow} ${utils.mb05}`}>
                                    <User size={16} className={utils.textMuted} />
                                    <span className={utils.fw600}>{room.patientName || 'Usuário'}</span>
                                    {room.unreadCount ? (
                                        <span className={styles.unreadBadge}>
                                            {room.unreadCount}
                                        </span>
                                    ) : null}
                                </div>
                                <p className={styles.lastMsg}>
                                    {room.lastMessage}
                                </p>
                            </div>
                        ))}
                    </div>

                    {isNewChatModalOpen && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modalContent}>
                                <div className={styles.modalHeader}>
                                    <h3>Nova Conversa</h3>
                                    <button onClick={() => setIsNewChatModalOpen(false)} className={styles.closeButton}><X size={20} /></button>
                                </div>
                                <div className={styles.patientList}>
                                    {allPatients.map(patient => (
                                        <div
                                            key={patient.uid}
                                            className={styles.patientItem}
                                            onClick={() => {
                                                setSelectedRoomId(patient.uid);
                                                setIsNewChatModalOpen(false);
                                            }}
                                        >
                                            <User size={20} />
                                            <span>{patient.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Chat Area */}
                    <div className={`${styles.chatMain} ${!selectedRoomId ? styles.hiddenMobile : ''}`}>
                        {selectedRoomId ? (
                            <>
                                <div className={styles.chatHeaderAdmin}>
                                    <button onClick={() => setSelectedRoomId(null)} className={styles.backButton}>
                                        ←
                                    </button>
                                    <strong>{rooms.find(r => r.id === selectedRoomId)?.patientName || allPatients.find(p => p.uid === selectedRoomId)?.name || 'Paciente'}</strong>
                                </div>

                                <div className={styles.messagesContainer}>
                                    {messages.map(msg => {
                                        const isAdmin = msg.senderId === 'admin';
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`${styles.messageBubble} ${isAdmin ? styles.messageOwn : styles.messageOther}`}
                                            >
                                                {renderMessageContent(msg)}
                                                <span className={styles.messageTime}>
                                                    {msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                                    {isAdmin && (
                                                        <span className={utils.ml05}>
                                                            {msg.read ? <CheckCheck size={14} className={styles.iconRead} /> : <Check size={14} className={styles.iconUnread} />}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        )
                                    })}
                                    <div ref={bottomRef} />
                                </div>

                                <form onSubmit={handleSendReply} className={styles.inputArea}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className={utils.dNone}
                                        onChange={handleFileUpload}
                                        accept="image/*,application/pdf"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className={styles.attachButton}
                                        disabled={isUploading}
                                    >
                                        <Paperclip size={20} />
                                    </button>

                                    <input
                                        type="text"
                                        value={reply}
                                        onChange={e => setReply(e.target.value)}
                                        placeholder={isUploading ? "Enviando arquivo..." : "Digite sua resposta..."}
                                        disabled={isUploading}
                                        className={styles.inputField}
                                    />
                                    <button type="submit" className={styles.sendButton} disabled={isUploading || !reply.trim()}>
                                        <Send size={20} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className={styles.emptyState}>
                                <MessageSquare size={48} className={utils.mb1} />
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

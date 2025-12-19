'use client';

import React, { useState, useEffect } from 'react';
import utils from '@/styles/Utils.module.css';
import { db } from '../lib/firebase';
import { collection, query, where, updateDoc, doc, onSnapshot } from 'firebase/firestore';

interface PendingUser {
  uid: string;
  name: string;
  email: string;
  crp: string;
}

const VerificationManager: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, "users"), where("userType", "==", "psicologo"), where("status", "==", "pending"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users: PendingUser[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as PendingUser);
      });
      setPendingUsers(users);
      setLoading(false);
    }, (err) => {
      console.error("Failed to fetch pending users:", err);
      setError("Não foi possível buscar usuários pendentes.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (uid: string) => {
    if (!db) return;
    const userRef = doc(db, "users", uid);
    try {
      await updateDoc(userRef, {
        status: 'active'
      });
      // The onSnapshot listener will automatically update the UI
    } catch (err) {
      console.error("Failed to approve user:", err);
      setError("Ocorreu um erro ao aprovar o usuário.");
    }
  };

  if (loading) {
    return <p>Carregando aprovações...</p>;
  }

  if (error) {
    return <p className={utils.alertError}>{error}</p>;
  }

  return (
    <div>
      {pendingUsers.length > 0 ? (
        pendingUsers.map(user => (
          <div key={user.uid} className={`${utils.cardBorder} ${utils.mb1}`}>
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>CRP:</strong> {user.crp}</p>
            <button onClick={() => handleApprove(user.uid)}>Aprovar</button>
          </div>
        ))
      ) : (
        <p>Nenhum psicólogo pendente de aprovação.</p>
      )}
    </div>
  );
};

export default VerificationManager;
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esta verificação agora é executada novamente quando 'auth' ou 'db'
    // mudam de 'null' para seus valores reais.
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          // --- CORREÇÃO 1: VERIFICAÇÃO DE TIPO ---
          // Adicionamos a verificação 'db' dentro do callback
          // para garantir ao TypeScript que 'db' não é nulo.
          if (!db) {
            console.error("Auth context: Firestore (db) não está disponível no callback.");
            throw new Error("Conexão com banco de dados indisponível.");
          }
          // --- FIM DA CORREÇÃO 1 ---

          const userDocRef = doc(db, 'users', user.uid); // Esta é a linha 31 original
          const userDoc = await getDoc(userDocRef);
          // A user is an admin if they are a psychologist AND their status is active
          if (userDoc.exists() && userDoc.data().userType === 'psicologo' && userDoc.data().status === 'active') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth context error:", error);
        // Set states to a stable default in case of error
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = { user, isAdmin, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
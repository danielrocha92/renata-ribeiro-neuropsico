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
          // --- CORREÇÃO 1: VERIFICAÇÃO DE ADMIN ---
          // A user is an admin if they matches specific credentials OR if they are a psychologist in DB.
          // Is checked FIRST to ensure access even if DB has issues or user doc is missing.

          const isRenata = (user.displayName && user.displayName.trim().toLowerCase() === 'renata ribeiro') ||
            (user.email === 'renataribeiro.neuropsico@gmail.com');

          if (isRenata) {
            setIsAdmin(true);
          } else {
            // If not Renata, check DB
            try {
              if (!db) throw new Error("Database not initialized");
              const userDocRef = doc(db, 'users', user.uid);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists() && userDoc.data().userType === 'psicologo' && userDoc.data().status === 'active') {
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
            } catch (dbError) {
              console.error("Error checking admin status in DB:", dbError);
              setIsAdmin(false);
            }
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
  }, [auth, db]);

  const value = { user, isAdmin, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
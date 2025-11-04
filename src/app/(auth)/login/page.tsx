'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../styles/Login.module.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth || !db) {
      setError("O serviço de autenticação não está disponível. Tente novamente mais tarde.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore to check role and status
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await signOut(auth);
        setError("Dados de usuário não encontrados.");
        return;
      }

      const userData = userDoc.data();

      if (userData.userType === 'psicologo') {
        if (userData.status === 'pending') {
          await signOut(auth);
          setError('Sua conta de psicólogo está pendente de aprovação.');
        } else if (userData.status === 'active') {
          router.push('/admin');
        } else {
          await signOut(auth);
          setError('O status da sua conta é inválido.');
        }
      } else if (userData.userType === 'paciente') {
        router.push('/cliente');
      } else {
        await signOut(auth);
        setError('Tipo de usuário desconhecido.');
      }

    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        switch (firebaseError.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('E-mail ou senha inválidos.');
            break;
          case 'auth/invalid-email':
            setError('O formato do e-mail é inválido.');
            break;
          default:
            setError('Ocorreu um erro ao fazer login.');
            console.error(error);
        }
      } else {
        setError('Ocorreu um erro desconhecido.');
        console.error(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h1 className={styles.title}>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>Entrar</button>
        <p className={styles.signupLink}>
          Não tem uma conta? <Link href="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
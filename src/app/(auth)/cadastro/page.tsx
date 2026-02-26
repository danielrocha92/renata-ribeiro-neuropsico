'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../styles/Cadastro.module.css';
import { FaGoogle } from 'react-icons/fa';

const CadastroPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!auth || !db) {
      setError("O serviço de autenticação não está disponível. Tente novamente mais tarde.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const newUser = {
        uid: user.uid,
        name: name,
        email: user.email,
        userType: 'paciente',
        status: 'active',
      };

      await setDoc(doc(db, "users", user.uid), newUser);
      router.push('/cliente');
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Este e-mail já está em uso.');
          break;
        case 'auth/invalid-email':
          setError('O formato do e-mail é inválido.');
          break;
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres.');
          break;
        default:
          setError('Ocorreu um erro ao criar a conta.');
          console.error(error);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    if (!auth || !db) {
      setError("O serviço de autenticação não está disponível. Tente novamente mais tarde.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUser = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          userType: 'paciente',
          status: 'active',
        };
        await setDoc(userDocRef, newUser);
      }

      router.push('/cliente');
    } catch (error: unknown) {
      console.error("Google Sign-Up Error:", error);
      setError("Ocorreu um erro ao fazer login com o Google.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.signupForm} onSubmit={handleEmailPasswordSignUp}>
        <h1 className={styles.title}>Criar Conta</h1>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Nome Completo"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirmar Senha"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>Cadastrar</button>
        <div className={styles.divider}>ou</div>
        <button type="button" className={`${styles.button} ${styles.googleButton}`} onClick={handleGoogleSignUp}>
          <FaGoogle className={styles.googleIcon} />
          Cadastrar com Google
        </button>
        <p className={styles.loginLink}>
          Já tem uma conta? <Link href="/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
};

export default CadastroPage;

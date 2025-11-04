'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../styles/Cadastro.module.css';

interface UserData {
  uid: string;
  name: string;
  email: string;
  userType: string;
  status: string;
  crp?: string;
}

const CadastroPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('paciente');
  const [crp, setCrp] = useState(''); // State for CRP number
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (userType === 'psicologo' && !crp) {
      setError('O número do CRP é obrigatório para psicólogos.');
      return;
    }

    if (!auth || !db) {
      setError('Serviço de autenticação ou banco de dados indisponível.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const userData: UserData = {
        uid: user.uid,
        name: name,
        email: email,
        userType: userType,
        status: userType === 'psicologo' ? 'pending' : 'active',
      };

      if (userType === 'psicologo') {
        userData.crp = crp;
      }

      await setDoc(doc(db, "users", user.uid), userData);

      if (userType === 'paciente') {
        router.push('/cliente');
      } else {
        setSuccess('Cadastro realizado com sucesso! Sua conta está pendente de aprovação por um administrador.');
        setTimeout(() => router.push('/login'), 4000);
      }

    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          setError('Este e-mail já está em uso.');
        } else if (firebaseError.code === 'auth/weak-password') {
          setError('A senha é muito fraca. Use pelo menos 6 caracteres.');
        } else {
          setError('Ocorreu um erro ao criar o usuário.');
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
      <form className={styles.signupForm} onSubmit={handleSignUp}>
        <h1 className={styles.title}>Criar Conta</h1>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <select
          className={styles.input}
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="paciente">Paciente</option>
          <option value="psicologo">Psicólogo</option>
        </select>
        <input
          type="text"
          placeholder="Nome Completo"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {userType === 'psicologo' && (
          <input
            type="text"
            placeholder="Número do CRP (ex: 06/123456)"
            className={styles.input}
            value={crp}
            onChange={(e) => setCrp(e.target.value)}
            required
          />
        )}
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
        <button type="submit" className={styles.button} disabled={!!success}>
          Cadastrar
        </button>
        <p className={styles.loginLink}>
          Já tem uma conta? <Link href="/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
};

export default CadastroPage;
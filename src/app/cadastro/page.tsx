'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/Cadastro.module.css';

const CadastroPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('paciente');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!auth) {
      setError('Serviço de autenticação indisponível.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
      }

      console.log("Novo usuário criado:", userCredential.user);
      if (userType === 'paciente') {
        router.push('/cliente');
      } else {
        router.push('/admin');
      }

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (error.code === 'auth/weak-password') {
        setError('A senha é muito fraca. Use pelo menos 6 caracteres.');
      } else {
        setError('Ocorreu um erro ao criar o usuário.');
        console.error(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.signupForm} onSubmit={handleSignUp}>
        <h1 className={styles.title}>Criar Conta</h1>
        {error && <p className={styles.error}>{error}</p>}
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
        <p className={styles.loginLink}>
          Já tem uma conta? <Link href="/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
};

export default CadastroPage;

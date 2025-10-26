'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/Login.module.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState('paciente');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth) {
      setError("O serviço de autenticação não está disponível. Tente novamente mais tarde.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (userType === 'paciente') {
        router.push('/cliente');
      } else {
        router.push('/admin');
      }
    } catch (error: any) {
      // Traduzir mensagens de erro comuns do Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Nenhum usuário encontrado com este e-mail.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta. Por favor, tente novamente.');
          break;
        case 'auth/invalid-email':
          setError('O formato do e-mail é inválido.');
          break;
        default:
          setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
          console.error(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h1 className={styles.title}>Login</h1>
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
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

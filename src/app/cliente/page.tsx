'use client';

import React, { useState } from 'react';
import styles from '../../styles/Cliente.module.css';
import PrivateRoute from '../../components/PrivateRoute';
import BookingCalendar from '@/components/BookingCalendar';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  Video,
  FileText,
  CreditCard,
  MessageCircle,
  BookOpen,
  LogOut,
  HelpCircle
} from 'lucide-react';

const ClientePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Simplified loading state if needed, or remove if not doing async work on mount

  // Simulating loading check if user is resolved, though PrivateRoute handles most of it.
  // We can keep it simple.

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const dashboardCards = [
    {
      title: "Teleterapia",
      icon: <Video className={styles.cardIcon} size={32} />,
      description: "Acesse sua sessão online segura.",
      action: () => router.push('/cliente/teleterapia'),
      active: true
    },
    {
      title: "Conteúdo Exclusivo",
      icon: <BookOpen className={styles.cardIcon} size={32} />,
      description: "Artigos, vídeos e exercícios para você.",
      action: () => router.push('/cliente/conteudo'),
      active: true
    },
    {
      title: "Prontuário e Histórico",
      icon: <FileText className={styles.cardIcon} size={32} />,
      description: "Resumo dos seus atendimentos.",
      action: () => router.push('/cliente/historico'),
      active: true
    },
    {
      title: "Financeiro",
      icon: <CreditCard className={styles.cardIcon} size={32} />,
      description: "Histórico de pagamentos e notas.",
      action: () => router.push('/cliente/financeiro'),
      active: true
    },
    {
      title: "Fale com o Profissional",
      icon: <MessageCircle className={styles.cardIcon} size={32} />,
      description: "Canal seguro de comunicação.",
      action: () => router.push('/cliente/chat'),
      active: true
    },
    {
      title: "Guia de Uso",
      icon: <HelpCircle className={styles.cardIcon} size={32} color="#FBC02D" />,
      description: "Aprenda como usar a plataforma.",
      action: () => router.push('/cliente/ajuda'),
      active: true
    }
  ];

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.welcomeMessage}>
            <h1>Área do Cliente</h1>
            <p>Olá, {user?.displayName || 'Cliente'}. Bem-vindo(a) ao seu espaço de saúde e bem-estar.</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton} title="Sair">
            <LogOut size={20} /> Sair
          </button>
        </header>

        {loading ? (
          <p className={styles.loading}>Carregando sua área...</p>
        ) : (
          <>
            {/* Quick Actions / Features Grid */}
            <div className={styles.dashboardGrid}>
              {dashboardCards.map((card, index) => (
                <div key={index} className={styles.card} onClick={card.action}>
                  {card.icon}
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>{card.description}</p>
                </div>
              ))}
            </div>

            <div className={styles.mainContent}>
              <section className={styles.requestSection} style={{ width: '100%' }}>
                <h2>Agende Nova Sessão</h2>
                <BookingCalendar />
              </section>
            </div>
          </>
        )}
      </div>
    </PrivateRoute>
  );
};

export default ClientePage;

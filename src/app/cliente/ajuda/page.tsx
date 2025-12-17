'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Cliente.module.css';
import PrivateRoute from '@/components/PrivateRoute';
import {
    ArrowLeft,
    Video,
    BookOpen,
    FileText,
    CreditCard,
    MessageCircle,
    Calendar,
    HelpCircle
} from 'lucide-react';

const ClienteAjudaPage: React.FC = () => {
    const router = useRouter();

    return (
        <PrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Guia de Uso</h1>
                            <p>Aprenda a navegar e utilizar sua Área do Cliente.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainContent} style={{ display: 'block' }}>

                    <div className={styles.section} style={{ marginBottom: '2rem' }}>
                        <h2><Calendar size={24} style={{ verticalAlign: 'middle', marginRight: '10px', color: '#6A7EBD' }} /> 1. Agendamento de Sessões</h2>
                        <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '1rem' }}>
                            No painel principal ou na seção "Agende Nova Sessão", você verá um calendário interativo.
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#555', lineHeight: '1.6' }}>
                            <li>Os dias com horários disponíveis estarão marcados.</li>
                            <li>Clique em um horário livre para selecionar.</li>
                            <li>Preencha seus dados (se solicitado) e confirme o agendamento.</li>
                            <li>Você receberá uma confirmação por e-mail e o agendamento aparecerá em "Meus Agendamentos".</li>
                        </ul>
                    </div>

                    <div className={styles.section} style={{ marginBottom: '2rem' }}>
                        <h2><Video size={24} style={{ verticalAlign: 'middle', marginRight: '10px', color: '#6A7EBD' }} /> 2. Teleterapia (Vídeo Online)</h2>
                        <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '1rem' }}>
                            Para suas sessões online:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#555', lineHeight: '1.6' }}>
                            <li>Acesse o menu <strong>Teleterapia</strong> no dia da sua consulta.</li>
                            <li>O botão "Entrar na Videochamada" ficará ativo 10 minutos antes do horário.</li>
                            <li>Recomendamos usar fones de ouvido e estar em um local silencioso.</li>
                        </ul>
                    </div>

                    <div className={styles.section} style={{ marginBottom: '2rem' }}>
                        <h2><MessageCircle size={24} style={{ verticalAlign: 'middle', marginRight: '10px', color: '#6A7EBD' }} /> 3. Fale com o Profissional</h2>
                        <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '1rem' }}>
                            Use o chat seguro para:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#555', lineHeight: '1.6' }}>
                            <li>Tirar dúvidas rápidas.</li>
                            <li>Enviar avisos sobre atrasos ou imprevistos.</li>
                            <li>A comunicação é criptografada e confidencial.</li>
                        </ul>
                    </div>

                    <div className={styles.section} style={{ marginBottom: '2rem' }}>
                        <h2><CreditCard size={24} style={{ verticalAlign: 'middle', marginRight: '10px', color: '#6A7EBD' }} /> 4. Financeiro</h2>
                        <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '1rem' }}>
                            Gerencie seus pagamentos de forma transparente:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#555', lineHeight: '1.6' }}>
                            <li>Veja cobranças pendentes e realize o pagamento via link.</li>
                            <li>Acesse o histórico de todas as sessões pagas.</li>
                            <li>Baixe recibos e notas fiscais (quando disponíveis).</li>
                        </ul>
                    </div>

                    <div className={styles.section} style={{ marginBottom: '2rem' }}>
                        <h2><BookOpen size={24} style={{ verticalAlign: 'middle', marginRight: '10px', color: '#6A7EBD' }} /> 5. Conteúdo Exclusivo</h2>
                        <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '1rem' }}>
                            Acesse materiais complementares disponibilizados pela profissional:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#555', lineHeight: '1.6' }}>
                            <li>Artigos, vídeos explicativos e exercícios práticos.</li>
                            <li>Alguns conteúdos podem ser exclusivos e estarão marcados com um cadeado até serem liberados.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </PrivateRoute>
    );
};

export default ClienteAjudaPage;

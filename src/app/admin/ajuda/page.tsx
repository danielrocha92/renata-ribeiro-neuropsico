'use client';

import React from 'react';
import Link from 'next/link';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Admin.module.css';
import {
    ArrowLeft,
    Calendar,
    BookOpen,
    CreditCard,
    MessageCircle,
    Settings
} from 'lucide-react';

const AdminAjudaPage = () => {
    return (
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href="/admin" style={{ color: '#333', display: 'flex', alignItems: 'center' }}>
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1>Manual do Administrador</h1>
                            <p>Como gerenciar sua plataforma digital.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.content} style={{ maxWidth: '900px' }}>

                    <div className={styles.section} style={{ marginBottom: '2rem' }}>
                        <h2 className={styles.sectionTitle}><Calendar size={20} style={{ marginRight: '8px' }} /> Gerenciando Agenda</h2>
                        <p>Em <strong>Agenda e Disponibilidade</strong>, você define quando pode atender.</p>
                        <ul>
                            <li>Selecione os dias da semana e os horários de início e fim.</li>
                            <li>Marque dias específicos como "Folga" para bloquear agendamentos.</li>
                            <li>O sistema impede automaticamente conflitos de horário.</li>
                        </ul>
                    </div>

                    <div className={styles.section} style={{ marginBottom: '2rem' }}>
                        <h2 className={styles.sectionTitle}><MessageCircle size={20} style={{ marginRight: '8px' }} /> Atendimento Online (Chat)</h2>
                        <p>O módulo de chat centraliza mensagens de todos os pacientes.</p>
                        <ul>
                            <li>Ao entrar, você verá uma lista de pacientes que enviaram mensagens no lado esquerdo.</li>
                            <li>Novas mensagens sobem para o topo da lista.</li>
                            <li>Clique em um nome para abrir a conversa e responder.</li>
                            <li>Todas as mensagens ficam salvas no histórico do paciente.</li>
                        </ul>
                    </div>

                    <div className={styles.section} style={{ marginBottom: '2rem' }}>
                        <h2 className={styles.sectionTitle}><CreditCard size={20} style={{ marginRight: '8px' }} /> Financeiro</h2>
                        <p>Lance cobranças e mantenha o controle de pagamentos.</p>
                        <ul>
                            <li><strong>Nova Cobrança:</strong> Selecione o paciente, descreva o serviço (ex: "Sessão 20/12"), valor e vencimento.</li>
                            <li>O paciente verá essa cobrança imediatamente na área dele.</li>
                            <li>Para dar baixa, encontre a cobrança na lista e altere o status para "Pago" (Funcionalidade de edição completa em breve, por enquanto use a exclusão e recriação se errar).</li>
                        </ul>
                    </div>

                    <div className={styles.section} style={{ marginBottom: '2rem' }}>
                        <h2 className={styles.sectionTitle}><BookOpen size={20} style={{ marginRight: '8px' }} /> Conteúdos Didáticos</h2>
                        <p>Enriqueça a experiência do paciente com materiais exclusivos.</p>
                        <ul>
                            <li>Adicione Artigos, Links de Vídeos ou PDFs.</li>
                            <li>Marque a opção <strong>Conteúdo Exclusivo</strong> para bloquear o acesso livre (útil se você quiser liberar apenas para planos específicos futuramente).</li>
                            <li>Você pode remover conteúdos antigos clicando no ícone de lixeira.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminAjudaPage;

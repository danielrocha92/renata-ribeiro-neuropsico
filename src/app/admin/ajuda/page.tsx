'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import styles from '@/styles/Cliente.module.css';
import utils from '@/styles/Utils.module.css';
import HelpSection from '@/components/HelpSection';
import {
    ArrowLeft,
    Calendar,
    BookOpen,
    CreditCard,
    MessageCircle,
    Settings
} from 'lucide-react';

const AdminAjudaPage = () => {
    const router = useRouter();

    return (
        <AdminPrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerActions}>
                        <button onClick={() => router.back()} className={styles.iconButton}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Manual do Administrador</h1>
                            <p>Como gerenciar sua plataforma digital.</p>
                        </div>
                    </div>
                </header>

                <div className={`${styles.mainContent} ${utils.block}`}>

                    <HelpSection
                        title="1. Gerenciando Agenda"
                        icon={<Calendar size={24} />}
                        description={<>Em <strong>Agenda e Disponibilidade</strong>, você define quando pode atender.</>}
                        items={[
                            "Selecione os dias da semana e os horários de início e fim.",
                            "Marque dias específicos como \"Folga\" para bloquear agendamentos.",
                            "O sistema impede automaticamente conflitos de horário."
                        ]}
                    />

                    <HelpSection
                        title="2. Atendimento Online (Chat)"
                        icon={<MessageCircle size={24} />}
                        description="O módulo de chat centraliza mensagens de todos os pacientes."
                        items={[
                            "Ao entrar, você verá a lista de pacientes no lado esquerdo.",
                            "Novas mensagens sobem para o topo da lista.",
                            "Para compartilhar arquivos grandes ou vídeos, recomendamos usar links externos (Drive, YouTube).",
                            "Todas as mensagens ficam salvas no histórico do paciente."
                        ]}
                    />

                    <HelpSection
                        title="3. Financeiro"
                        icon={<CreditCard size={24} />}
                        description="Lance cobranças e mantenha o controle de pagamentos."
                        items={[
                            <><strong>Nova Cobrança:</strong> Selecione o paciente, descreva o serviço, valor e vencimento.</>,
                            "Opcionalmente, adicione o link de pagamento externo na cobrança.",
                            "O paciente verá essa cobrança imediatamente na área dele.",
                            "Acompanhe o status (Pago, Pendente, Atrasado) diretamente na tabela."
                        ]}
                    />

                    <HelpSection
                        title="4. Conteúdos Didáticos"
                        icon={<BookOpen size={24} />}
                        description="Enriqueça a experiência do paciente com materiais exclusivos."
                        items={[
                            <>Use preferencialmente a opção <strong>Link Externo</strong> para vídeos e arquivos pesados.</>,
                            "Adicione Artigos, Links de Vídeos, PDFs ou Imagens.",
                            <>Marque a opção <strong>Conteúdo Exclusivo</strong> para bloquear o acesso livre.</>,
                            "Organize sua biblioteca de materiais para seus pacientes acessarem."
                        ]}
                    />

                    <HelpSection
                        title="5. Teleterapia (Plataformas)"
                        icon={<Settings size={24} />}
                        description="Flexibilidade para atender onde preferir."
                        items={[
                            "Acesse a página de Teleterapia para escolher a plataforma de vídeo.",
                            "Opções disponíveis: Google Meet, Zoom, WhatsApp Web ou Whereby.",
                            "Ao clicar, você será redirecionada para a plataforma escolhida em uma nova aba.",
                            "O link do Whereby já inclui sua identificação como anfitriã."
                        ]}
                    />

                    <HelpSection
                        title="6. Prontuário e Documentos"
                        icon={<BookOpen size={24} />} // Using BookOpen as generic file/record icon
                        description="Gerencie o histórico clínico e troca de arquivos."
                        items={[
                            "Acesse 'Prontuário e Histórico' no painel principal.",
                            "Selecione um paciente para ver seus documentos.",
                            "Para adicionar: escolha entre Upload (arquivos pequenos) ou Link Externo (recomendado).",
                            "Para remover: clique no ícone de lixeira ao lado do documento indesejado."
                        ]}
                    />

                </div>
            </div>
        </AdminPrivateRoute>
    );
};

export default AdminAjudaPage;

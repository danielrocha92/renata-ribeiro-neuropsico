'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Cliente.module.css';
import utils from '@/styles/Utils.module.css';
import PrivateRoute from '@/components/PrivateRoute';
import HelpSection from '@/components/HelpSection';
import {
    ArrowLeft,
    Video,
    BookOpen,
    CreditCard,
    MessageCircle,
    Calendar
} from 'lucide-react';

const ClienteAjudaPage: React.FC = () => {
    const router = useRouter();

    return (
        <PrivateRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerActions}>
                        <button onClick={() => router.back()} className={styles.iconButton}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.welcomeMessage}>
                            <h1>Guia de Uso</h1>
                            <p>Aprenda a navegar e utilizar sua Área do Cliente.</p>
                        </div>
                    </div>
                </header>

                <div className={`${styles.mainContent} ${utils.block}`}>

                    <HelpSection
                        title="1. Agendamento de Sessões"
                        icon={<Calendar size={24} />}
                        description='No painel principal ou na seção "Agende Nova Sessão", você verá um calendário interativo.'
                        items={[
                            "Os dias com horários disponíveis estarão marcados.",
                            "Clique em um horário livre para selecionar.",
                            "Preencha seus dados (se solicitado) e confirme o agendamento.",
                            'Você receberá uma confirmação por e-mail e o agendamento aparecerá em "Meus Agendamentos".'
                        ]}
                    />

                    <HelpSection
                        title="2. Teleterapia (Vídeo Online)"
                        icon={<Video size={24} />}
                        description="Para suas sessões online, oferecemos flexibilidade:"
                        items={[
                            <>Acesse o menu <strong>Teleterapia</strong> no horário agendado.</>,
                            "Você poderá escolher por onde quer ser atendido: Google Meet, Zoom, WhatsApp ou Whereby.",
                            "Basta clicar na opção combinada com a profissional para abrir a sala.",
                            "O Whereby já preenche seu nome automaticamente para facilitar."
                        ]}
                    />

                    <HelpSection
                        title="3. Fale com o Profissional"
                        icon={<MessageCircle size={24} />}
                        description="Use o chat seguro para:"
                        items={[
                            "Tirar dúvidas rápidas.",
                            "Enviar avisos sobre atrasos ou imprevistos.",
                            "A comunicação é criptografada e confidencial."
                        ]}
                    />

                    <HelpSection
                        title="4. Financeiro"
                        icon={<CreditCard size={24} />}
                        description="Gerencie seus pagamentos de forma transparente:"
                        items={[
                            "Veja cobranças pendentes e realize o pagamento via link.",
                            "Acesse o histórico de todas as sessões pagas.",
                            "Baixe recibos e notas fiscais (quando disponíveis)."
                        ]}
                    />

                    <HelpSection
                        title="5. Conteúdo Exclusivo"
                        icon={<BookOpen size={24} />}
                        description="Acesse materiais complementares disponibilizados pela profissional:"
                        items={[
                            "Artigos, vídeos explicativos e exercícios práticos.",
                            "Alguns conteúdos podem ser exclusivos e estarão marcados com um cadeado até serem liberados."
                        ]}
                    />

                </div>
            </div>
        </PrivateRoute>
    );
};

export default ClienteAjudaPage;

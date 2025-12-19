import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const sendNotificationEmail = async (
    toEmail: string,
    type: 'appointment_request' | 'appointment_confirmed' | 'new_message' | 'new_document',
    previewText?: string
) => {
    if (!toEmail || !db) return;

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://renata-ribeiro-neuropsico.web.app';

    let subject = '';
    let body = '';
    let link = siteUrl;

    switch (type) {
        case 'appointment_request':
            subject = 'Nova Solicitação de Consulta';
            body = `Você recebeu uma nova solicitação de consulta. Acesse o painel para responder.<br/><br/>${previewText || ''}`;
            link = `${siteUrl}/admin/disponibilidade`;
            break;
        case 'appointment_confirmed':
            subject = 'Sua Consulta foi Confirmada!';
            body = `Sua consulta foi confirmada. Acesse o site para ver os detalhes.<br/><br/>${previewText || ''}`;
            link = `${siteUrl}/cliente`; // Or specific route
            break;
        case 'new_message':
            subject = 'Nova Mensagem Recebida';
            body = `Você recebeu uma nova mensagem.<br/><br/>"${previewText || 'Conteúdo oculto'}"`;
            link = `${siteUrl}/cliente/chat`; // Or admin/chat
            break;
        case 'new_document':
            subject = 'Novo Documento Disponível';
            body = `Um novo documento foi adicionado ao seu prontuário.`;
            link = `${siteUrl}/cliente/historico`;
            break;
    }

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>${subject}</h2>
      <p>${body}</p>
      <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #D95C41; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">
        Acessar Plataforma
      </a>
    </div>
  `;

    // Try to use Firebase Extension 'Trigger Email' if configured (collection 'mail')
    try {
        await addDoc(collection(db, 'mail'), {
            to: toEmail,
            message: {
                subject: `[Renata Ribeiro] ${subject}`,
                html: emailHtml
            }
        });
        console.log(`[Email Queued] To: ${toEmail}, Subject: ${subject}`);
    } catch (error) {
        // If permission failed or collection doesn't exist, we just log it as the user might not have backend set up fully.
        console.warn("[Email Notification] Failed to queue email (backend might need config):", error);
    }
};

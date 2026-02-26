import emailjs from '@emailjs/browser';

export const sendNotificationEmail = async (
    toEmail: string,
    type: 'appointment_request' | 'appointment_confirmed' | 'new_message' | 'new_document' | 'payment_receipt',
    previewText?: string
) => {
    if (!toEmail) return;

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
        case 'payment_receipt':
            subject = 'Confirmação de Pagamento - Renata Ribeiro';
            body = `Recebemos o seu pagamento referente à consulta. Muito obrigada!<br/><br/>
            <strong>Aviso Legal sobre Recibos de Consulta Psicológica (IRPF):</strong><br/>
            Para fins de dedução no Imposto de Renda e em conformidade com as regras da Receita Federal obrigatórias a partir de 2025 para profissionais autônomos, o seu <strong>Recibo Oficial Eletrônico</strong> com validade fiscal será emitido exclusivamente através do sistema oficial <strong>Receita Saúde</strong>. Você o receberá em breve ou poderá consultá-lo diretamente nos canais da Receita Federal. Este e-mail serve apenas como confirmação interna de pagamento.`;
            link = `${siteUrl}/cliente/financeiro`;
            break;
    }

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>[Renata Ribeiro] ${subject}</h2>
      <p>${body}</p>
      <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #D95C41; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">
        Acessar Plataforma
      </a>
    </div>
  `;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    if (!serviceId || !templateId || !publicKey) {
        console.warn("[Email Notification] As credenciais do EmailJS não estão configuradas no .env.local.");
        return;
    }

    try {
        await emailjs.send(
            serviceId,
            templateId,
            {
                to_email: toEmail,
                subject: subject,
                // Variável que armazena todo o HTML do e-mail perfeitamente construído para injetar no template deles.
                message_html: emailHtml,
            },
            publicKey
        );
        console.log(`[Email Sent via EmailJS] To: ${toEmail}, Subject: ${subject}`);
    } catch (error) {
        console.error("[Email Notification] Failed to send email via EmailJS:", error);
    }
};

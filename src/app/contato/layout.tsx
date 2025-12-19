import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Entre em Contato | Agende sua Consulta",
    description: "Fale com Renata Ribeiro para agendar sua consulta de psicoterapia ou avaliação neuropsicológica. WhatsApp, E-mail ou Formulário. Atendimento em SP.",
    alternates: {
        canonical: '/contato',
    },
};

export default function ContatoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

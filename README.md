<h1 align="center">🧠 Plataforma Renata Ribeiro Neuropsicopedagoga <img src="https://vercelbadge.vercel.app/api/danielrocha92/renata-ribeiro-neuropsico" alt="Vercel Status"></h1>

<p align="center"><strong>Sistema Completo de Gestão de Clínica e Atendimento ao Paciente</strong><br>
Uma solução web robusta desenvolvida para digitalizar e otimizar os atendimentos de Neuropsicopedagogia, oferecendo áreas dedicadas para pacientes e administração.</p>

<p align="center">🔗 <strong><a href="https://renata-ribeiro-neuropsico.vercel.app/">Acesse o Sistema</a></strong></p>

<hr>

<h2>� Sobre o Projeto</h2>

Este projeto evoluiu de um site institucional para uma **Plataforma Web Completa (SaaS-like)**. Além de apresentar os serviços da profissional, o sistema agora gerencia toda a jornada do paciente, desde o agendamento até o pagamento e acompanhamento terapêutico.

A aplicação conta com autenticação segura, níveis de acesso (Admin/Psicólogo e Paciente), chat em tempo real, gestão financeira automatizada e compartilhamento de conteúdo exclusivo.

---

## 🌟 Principais Funcionalidades

### 🔐 Autenticação e Segurança
- **Login e Cadastro Seguro:** Integração com Firebase Auth.
- **Proteção de Rotas:** Middleware e componentes (`PrivateRoute`, `AdminPrivateRoute`) garantindo acesso restrito.
- **Recuperação de Senha:** Fluxo automatizado via e-mail.

### 👩‍⚕️ Área Administrativa (Psicólogo)
- **Dashboard Geral:** Visão macro da clínica.
- **Prontuário Digital:** Histórico completo unificado com gestão de documentos (Upload ou Links Externos) e exclusão de registros.
- **Agenda e Disponibilidade:** Gestão eficiente de horários com sincronização Google Agenda.
- **Financeiro (Receita Saúde):** Emissão de cobranças, controle de status (Pago/Pendente) e envio automático de avisos fiscais via e-mail.
- **Teleterapia:** Hub de conexões permitindo escolher entre Google Meet, Zoom, WhatsApp ou Whereby para o atendimento.
- **Gestão de Conteúdo:** Upload de materiais didáticos exclusivos ou via links externos.
- **Chat Centralizado:** Envio de mensagens e orientações para pacientes com suporte a anexos.
- **Notificações Inteligentes:** Alertas automáticos por e-mail para agendamentos, confirmações e pagamentos.

### 👤 Área do Paciente
- **Painel Personalizado:** Resumo de agendamentos e lembretes inteligentes.
- **Agendamento Online:** Marcação de consultas baseada na disponibilidade real da profissional.
- **Teleterapia:** Acesso fácil à videochamada na plataforma definida (Meet, Zoom, etc.).
- **Financeiro:** Histórico de pagamentos e links de fatura integrados (Mercado Pago/Stripe).
- **Prontuário e Histórico:** Visualização integrada de consultas passadas e documentos compartilhados.
- **Conteúdos Exclusivos:** Acesso a materiais didáticos liberados pela profissional.
- **Chat Privado:** Canal direto e seguro para comunicação criptografada.

---

<h2>🛠️ Tecnologias Utilizadas</h2>

O projeto utiliza uma stack moderna focada em performance, escalabilidade e experiência do usuário:

- **Frontend:**
  - [Next.js 14](https://nextjs.org/) (App Router, Server Components)
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [CSS Modules](https://github.com/css-modules/css-modules) (Design Premium e Responsivo)
  - [Lucide React](https://lucide.dev/) / [React Icons](https://react-icons.github.io/react-icons/)

- **Backend & Serviços:**
  - [Firebase Auth](https://firebase.google.com/products/auth) (Gestão de Identidade)
  - [Firebase Firestore](https://firebase.google.com/products/firestore) (Banco de Dados NoSQL em Tempo Real)
  - [Firebase Storage](https://firebase.google.com/products/storage) (Armazenamento Cloud)
  - [EmailJS](https://www.emailjs.com/) (Motor de Notificações Transacionais)
  - [Vercel](https://vercel.com/) (Hospedagem e CI/CD)

---

<h2>🖼️ Estrutura do Projeto</h2>

```bash
src/
├── app/
│   ├── admin/             # Rotas do Painel Administrativo
│   ├── cliente/           # Rotas da Área do Paciente
│   └── (public)/          # Landing Page, Serviços, Sobre e Contato
├── components/            # UI components (Header, Footer, Calendar, etc.)
├── contexts/              # Context Providers (Auth, Theme)
├── hooks/                 # Custom Hooks para lógica de dados
├── lib/                   # Configurações de serviços e utilitários
└── styles/                # CSS Modules e Globais
```

---

<h2>🚀 Como Executar Localmente</h2>

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/danielrocha92/renata-ribeiro-neuropsico.git
   cd renata-ribeiro-neuropsico
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env.local` na raiz:
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...

   # EmailJS
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
   NEXT_PUBLIC_EMAILJS_TEMPLATE_CONFIRMACAO=...
   NEXT_PUBLIC_EMAILJS_TEMPLATE_RECIBO=...
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

<h2>🛡️ Segurança e Privacidade</h2>

O sistema segue padrões rigorosos de proteção de dados:
- **Isolamento de Dados:** Pacientes só acessam seus próprios registros.
- **Criptografia:** Comunicação protegida via SSL e regras de segurança Firestore.
- **Níveis de Acesso:** Separação clara entre funções administrativas e de usuários comuns.

---

<h2>👨‍💻 Autor</h2>

**Daniel Rocha**
*Desenvolvedor Full-Stack focado em Soluções Digitais de Alto Impacto.*

[LinkedIn](https://www.linkedin.com/in/danielrocha92)

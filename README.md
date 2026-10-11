<h1 align="center">🧠 Plataforma Renata Ribeiro — Psicologia & Neuropsicopedagogia</h1>

<p align="center">
  <img src="https://vercelbadge.vercel.app/api/danielrocha92/renata-ribeiro-neuropsico" alt="Vercel Deploy Status">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-blue?style=flat&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-orange?style=flat&logo=firebase" alt="Firebase">
</p>

<p align="center">
  <strong>Ecossistema Web Completo para Gestão Clínica, Teleterapia e Acompanhamento do Paciente</strong><br>
  Solução digital de alta fidelidade desenvolvida para atendimento neuropsicopedagógico e psicológico, com portais dedicados para pacientes e gestão clínica administrativa.
</p>

<p align="center">
  🌐 <strong><a href="https://renata-ribeiro-neuropsico.vercel.app/" target="_blank">Acessar a Plataforma em Produção</a></strong> | 📖 <strong><a href="./ARQUITETURA_E_PROCESSOS.md">Documentação Completa de Arquitetura</a></strong>
</p>

---

## 📌 Sumário Executivo

A aplicação é uma plataforma **SaaS-like clínica** que digitaliza integralmente a jornada de atendimento:
1. **Presença Digital & Prova Social:** Landing page de alta performance com depoimentos reais sincronizados diretamente do Google Meu Negócio (Google Places API com cache de 24h), serviços clínicos detalhados e conformidade com a LGPD.
2. **Área do Paciente (`/cliente`):** Agendamento online de consultas, prontuário digital com visualização de laudos e atividades, sala de teleterapia, histórico financeiro com pagamento integrado e chat criptografado.
3. **Painel do Especialista (`/admin`):** Dashboard gerencial com alertas de próximas sessões, gerenciador de agenda sincronizado com o Google Calendar, prontuário eletrônico unificado, faturamento com emissão de avisos fiscais (Receita Saúde / IRPF), hub de teleconferências e biblioteca de conteúdos didáticos exclusivos.

---

## 🏗️ Arquitetura e Tecnologias

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Renderização híbrida SSR/SSG, Server Components e API Routes seguras |
| **UI Library** | [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) | Tipagem estrita de ponta a ponta e interfaces reativas |
| **Estilização** | CSS Modules Dedicados | Estilização isolada por módulo (`src/styles/*`) com tokens globais |
| **Banco de Dados & Auth** | [Google Firebase](https://firebase.google.com/) | Firebase Authentication, Cloud Firestore (NoSQL em tempo real) e Storage |
| **Integração de Agenda** | Google Calendar API (`googleapis`) | Sincronização automática de consultas via OAuth2 com token de refresh offline |
| **Notificações** | [EmailJS](https://www.emailjs.com/) | Disparo automatizado de e-mails transacionais (solicitações, confirmações e recibos) |
| **Prova Social** | Google Places API | Avaliações oficiais em tempo real com fallback em caso de indisponibilidade |
| **Teleterapia** | Multi-Hub | Whereby (sala customizada com nome do paciente), Google Meet, Zoom e WhatsApp Web |
| **SEO & Deploy** | `next-sitemap` & [Vercel](https://vercel.com/) | Geração contínua de sitemap e esteira de CI/CD integrada |

---

## 🗺️ Mapa de Rotas do Sistema

### 🌐 Área Institucional & Pública
* `/` — Página inicial com apresentação profissional, depoimentos do Google Reviews e agendamento.
* `/servicos` — Detalhamento das áreas de atuação clínica e neuropsicopedagógica.
* `/sobre` — Trajetória, formação e metodologia da profissional.
* `/blog` & `/conteudo` — Artigos e materiais educativos públicos.
* `/contato` — Canais de comunicação direta e localização.
* `/politica-de-privacidade`, `/termos-e-condicoes`, `/lgpd` — Documentos jurídicos e termos de conformidade.

### 👤 Área do Paciente (`/cliente`)
* `/cliente` — Dashboard do paciente com resumo do próximo atendimento e calendário de marcação.
* `/cliente/historico` — Prontuário pessoal com consultas anteriores e download de laudos/arquivos compartilhados.
* `/cliente/teleterapia` — Hub de conexão para a videochamada na plataforma combinada.
* `/cliente/financeiro` — Faturas pendentes (com botão para pagar via link) e recibos emitidos.
* `/cliente/chat` — Canal seguro e criptografado de mensagens diretas com a terapeuta.
* `/cliente/conteudo` — Acesso a exercícios e artigos liberados para o tratamento.
* `/cliente/ajuda` — Manual interativo do paciente.

### 👩‍⚕️ Área Administrativa (`/admin`)
* `/admin` — Visão executiva com cards de métricas, próximas consultas e calendário unificado.
* `/admin/atendimentos` — Listagem, alteração de status (Pendente, Confirmado, Realizada, Cancelado).
* `/admin/disponibilidade` — Gestão de slots de horários com integração Google Calendar.
* `/admin/prontuarios` — Prontuário eletrônico com upload inteligente (Base64 ou Links Externos) e exclusão segura.
* `/admin/financeiro` — Emissão de cobranças, links de gateway (Mercado Pago/Stripe) e disparo de avisos fiscais do Receita Saúde.
* `/admin/teleterapia` — Sala de comando para início imediato da sessão em Whereby, Meet, Zoom ou WhatsApp.
* `/admin/chat` — Inbox centralizado com suporte a conversas simultâneas e badges de não lidas.
* `/admin/conteudo` — Gestão e publicação de materiais didáticos (PDF, vídeos, artigos) com controle de acesso exclusivo.
* `/admin/ajuda` — Manual do administrador da clínica.

---

## ⚡ Guia Rápido de Instalação e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/danielrocha92/renata-ribeiro-neuropsico.git
cd renata-ribeiro-neuropsico
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie o arquivo `.env.local` na raiz do projeto com as chaves necessárias:

```env
# Firebase SDK
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"

# Notificações Transacionais (EmailJS)
NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_xxxxxxx"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="template_padrao"
NEXT_PUBLIC_EMAILJS_TEMPLATE_CONFIRMACAO="template_confirmacao"
NEXT_PUBLIC_EMAILJS_TEMPLATE_RECIBO="template_recibo"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="public_key_xxxxxxx"

# Google Calendar OAuth2
GOOGLE_CLIENT_ID="xxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxx"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# Google Places API (Reviews)
GOOGLE_PLACES_API_KEY="AIzaSy..."
```

### 4. Executar em ambiente de desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no seu navegador em `http://localhost:3000`.

### 5. Scripts de Build e Produção
```bash
# Compilação para produção
npm run build

# Execução do bundle compilado
npm run start

# Verificação estática de código
npm run lint
```

---

## 📚 Documentação Técnica Aprofundada

Para consultar o diagrama de sequência detalhado, matriz de regras do Firestore (`firestore.rules`), modelo das coleções NoSQL e o fluxo de conformidade do Receita Saúde:

👉 **[Consulte a Documentação Técnica e de Processos (ARQUITETURA_E_PROCESSOS.md)](./ARQUITETURA_E_PROCESSOS.md)**

---

## 👨‍💻 Autor

**Daniel Rocha**  
*Desenvolvedor Full-Stack focado em Soluções Digitais Escaláveis e de Alto Impacto.*  
* [LinkedIn](https://www.linkedin.com/in/danielrocha92)

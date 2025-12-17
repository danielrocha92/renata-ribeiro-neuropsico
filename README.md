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
- **Gestão de Pacientes:** Prontuário digital simplificado.
- **Agenda e Disponibilidade:** Definição de horários livres para agendamentos.
- **Financeiro:** Criação de faturas, links de pagamento e controle de inadimplência.
- **Gestão de Conteúdo:** Upload de artigos e vídeos exclusivos para pacientes.
- **Chat Centralizado:** Comunicação direta com todos os pacientes em uma única interface.
- **Manual do Sistema:** Guia integrado para facilitar o uso da ferramenta.

### 👤 Área do Paciente
- **Painel Personalizado:** Resumo de agendamentos e pendências.
- **Agendamento Online:** Marcação de consultas baseada na disponibilidade real da profissional.
- **Teleterapia:** Link direto para sessões de vídeo.
- **Financeiro:** Histórico de pagamentos e boletos pendentes.
- **Conteúdos Exclusivos:** Acesso a materiais didáticos liberados pela profissional.
- **Chat Privado:** Canal direto e seguro para tirar dúvidas.

---

<h2>🛠️ Tecnologias Utilizadas</h2>

O projeto utiliza uma stack moderna focada em performance, escalabilidade e experiência do usuário:

- **Frontend:**
  - [Next.js 14](https://nextjs.org/) (App Router, Server Components)
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [CSS Modules](https://github.com/css-modules/css-modules) (Design Responsivo Mobile-First)
  - [Lucide React](https://lucide.dev/) (Ícones)

- **Backend & Infraestrutura:**
  - [Firebase Auth](https://firebase.google.com/products/auth) (Gestão de Identidade)
  - [Firebase Firestore](https://firebase.google.com/products/firestore) (Banco de Dados NoSQL em Tempo Real)
  - [Firebase Storage](https://firebase.google.com/products/storage) (Armazenamento de Arquivos/Mídia)
  - [Vercel](https://vercel.com/) (Hospedagem e CI/CD)

---

<h2>🖼️ Estrutura do Projeto</h2>

```bash
src/
├── app/
│   ├── admin/             # Rotas protegidas da Área Administrativa
│   ├── cliente/           # Rotas protegidas da Área do Paciente
│   ├── login/             # Fluxos de Autenticação
│   └── (public)/          # Site Institucional e Blog
├── components/            # Componentes Reutilizáveis (UI)
├── contexts/              # Gestão de Estado Global (AuthContext)
├── lib/                   # Configurações (Firebase, Utils)
└── styles/                # CSS Modules globais e específicos
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
   Crie um arquivo `.env.local` na raiz e adicione suas credenciais do Firebase:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=seu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` no seu navegador.

---

<h2>🛡️ Regras de Segurança (Firestore)</h2>

O sistema utiliza regras de segurança rigorosas para garantir a privacidade dos dados:
- **Dados Médicos:** Apenas o próprio paciente e o admin têm acesso.
- **Conteúdos:** Públicos ou restritos conforme configuração.
- **Chat:** Totalmente isolado entre paciente e profissional.

---

<h2>👨‍💻 Autor</h2>

**Daniel Rocha**
*Desenvolvedor Full-Stack focado em Soluções Digitais de Alto Impacto.*

[LinkedIn](https://www.linkedin.com/in/danielrocha92)

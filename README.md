# Agendador de Eventos

Projeto de Desenvolvimento Mobile — Engenharia de Software / UniGuairacá.
Aplicativo para **organização e agendamento de eventos e compromissos**, com suporte a autenticação, sincronização em tempo real na nuvem e busca automática de endereços por CEP via API.

O projeto segue uma arquitetura limpa, modular e componentizada (Feature-Based Architecture), mantendo o código desacoplado e escalável.

---

## 🚀 Stack Tecnológica

| Item | Versão / Tecnologia |
| --- | --- |
| **Expo SDK** | 57 |
| **React Native** | 0.86.0 |
| **React** | 19.2.3 |
| **Expo Router** | 57 (navegação baseada em arquivos, typed routes) |
| **TypeScript** | 6 (strict mode) |
| **Backend & Auth** | Firebase 12 (Authentication & Firestore Database) |
| **API Externa** | ViaCEP (consulta e autopreenchimento de endereços) |

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (v18 ou superior recomendado).
- Aplicativo **Expo Go** instalado no smartphone (Android ou iOS) ou um emulador configurado.

### Passos

1. Clone o repositório ou acesse a pasta do projeto:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento do Expo:
```bash
npx expo start
```

3. Abra o aplicativo **Expo Go** no celular e escaneie o QR Code gerado no terminal.

### Outros comandos disponíveis

```bash
npm run lint       # Executa o ESLint + Prettier para checar estilo de código
npm run format     # Formata automaticamente os arquivos em src/
npm run typecheck  # Executa o TypeScript para checar tipagens estáticas
```

---

## 📁 Estrutura de Pastas

Baseada nas boas práticas recomendadas pela documentação oficial do Expo:
a pasta `src/app/` é reservada **exclusivamente para rotas e layouts de tela**, enquanto toda a lógica de negócio, componentes e utilitários residem em pastas dedicadas dentro de `src/`.

```text
agendador-de-eventos/
├── assets/images/            # Ícones e splash screen
└── src/
    ├── app/                  # ROTAS (Expo Router) — telas e layouts
    │   ├── _layout.tsx       # Layout raiz global (Stack e Safe Area Providers)
    │   ├── index.tsx         # Redirecionamento inicial
    │   ├── +not-found.tsx    # Tela de rota 404 não encontrada
    │   ├── (auth)/           # Fluxo de autenticação
    │   │   ├── _layout.tsx   # Stack sem header das telas de login/cadastro
    │   │   ├── sign-in.tsx   # Tela de Login (E-mail e Senha)
    │   │   └── sign-up.tsx   # Tela de Cadastro de Usuário
    │   ├── (tabs)/           # Abas da navegação inferior
    │   │   ├── _layout.tsx   # Tab Bar com ícones (Início, Validar CEP, Configurações)
    │   │   ├── home.tsx      # Tela Início com lista paginada de eventos
    │   │   ├── cep.tsx       # Tela de consulta de CEP
    │   │   └── settings.tsx  # Tela de configurações e perfil do usuário
    │   └── events/
    │       └── new.tsx       # Modal de cadastro de novo evento
    ├── components/ui/        # Componentes visuais atômicos compartilhados
    │   ├── Button.tsx        # Botão com variantes (primary, secondary, ghost) e loading
    │   ├── Card.tsx          # Card com elevação e bordas arredondadas
    │   ├── Screen.tsx        # Container padrão de tela com Safe Area e ScrollView
    │   ├── ScreenHeader.tsx  # Cabeçalho padrão com título, subtítulo e ações
    │   └── TextField.tsx     # Campo de texto estilizado com rótulo, ícones e erro
    ├── constants/            # Design System Tokens
    │   ├── colors.ts         # Paleta de cores oficial
    │   ├── spacing.ts        # Escalas de espaçamento e borderRadius
    │   └── typography.ts     # Padrões tipográficos
    ├── features/             # MÓDULOS DE NEGÓCIO (Domain-Driven / Feature-Based)
    │   ├── auth/             # Serviços, hooks e tipos de autenticação (Firebase Auth)
    │   └── events/           # Serviços (Firestore), hooks (tempo real) e componentes de evento
    ├── lib/                  # Utilitários e integrações
    │   ├── firebase.ts       # Inicialização da SDK do Firebase
    │   ├── date.ts           # Utilitários de manipulação e formatação de datas
    │   └── format.ts         # Formatações de moeda e datas
    └── types/                # Definições globais de tipos do TypeScript
```

---

## 📐 Diretrizes de Arquitetura

1. **Tela não contém regra de negócio:** Os arquivos em `src/app` apenas montam a árvore visual e consomem hooks e serviços das suas respectivas *features*.
2. **Componentização reaproveitável:** Componentes de interface compartilhados entre mais de uma feature residem em `src/components/ui`.
3. **Consistência visual (Design Tokens):** Nenhuma tela ou componente define cores ou espaçamentos avulsos; todos importam tokens de `src/constants`.

---

## 📱 Telas e Rotas do Aplicativo

| Tela | Rota | Descrição |
| --- | --- | --- |
| **Login** | `/sign-in` | Autenticação por e-mail e senha, com botão de visibilidade e recuperação de senha. |
| **Criar Conta** | `/sign-up` | Cadastro de novos usuários com validação de senha e confirmação. |
| **Início (Eventos)** | `/home` | Dashboard com resumo, listagem paginada de eventos e exclusão com modal de confirmação. |
| **Novo Evento** | `/events/new` | Modal para agendar evento (descrição, datas de início/fim e CEP com busca automática). |
| **Validar CEP** | `/cep` | Ferramenta para validação e consulta de logradouros via API do ViaCEP. |
| **Configurações** | `/settings` | Informações do usuário logado, versão do app e logout seguro. |

---

## ✨ Funcionalidades Principais

- [x] **Autenticação Completa:** Criação de usuário, login, logout e persistência de sessão via Firebase Auth.
- [x] **Gestão de Eventos:** Cadastro de eventos com datas e vinculação a endereços.
- [x] **Exclusão Segura com Modal Personalizado:** Modal interativo com prévia das informações antes de confirmar a exclusão.
- [x] **Sincronização em Tempo Real:** Dados do Firestore sincronizados instantaneamente usando snapshots (`onSnapshot`).
- [x] **Integração com API ViaCEP:** Autopreenchimento de endereço ao completar os 8 dígitos do CEP no cadastro de eventos e tela dedicada de consulta.
- [x] **Paginação de Eventos:** Visualização limpa com 5 eventos por página e botões de navegação (*Anterior / Próxima*).
- [x] **Tratamento de Erros e Feedbacks:** Alertas, máscaras de input, indicadores de carregamento (*ActivityIndicator*) e estados vazios amigáveis.

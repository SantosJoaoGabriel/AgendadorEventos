# Guia Financeiro

Projeto didático de Desenvolvimento Mobile — Engenharia de Software / UniGuairacá.
App de organização de **receitas** e **contas a pagar**, construído em aula, do zero.

Este repositório contém **apenas a estrutura base**: navegação, design tokens,
componentes de UI e as pastas das features. As regras de negócio são implementadas
aula por aula.

## Stack

| Item | Versão |
| --- | --- |
| Expo SDK | 57 |
| React Native | 0.86.0 |
| React | 19.2.3 |
| Expo Router | 57 (typed routes) |
| TypeScript | 6 (strict) |

## Como rodar

```bash
npm install
npx expo start
```

Depois use o app **Expo Go** (ou um emulador) para abrir o projeto.

Outros comandos:

```bash
npm run lint       # ESLint + Prettier
npm run format     # formata src/
npm run typecheck  # checagem de tipos
```

## Estrutura de pastas

Baseada nas recomendações do post
[Expo app folder structure best practices](https://expo.dev/blog/expo-app-folder-structure-best-practices):
a pasta `app/` guarda **apenas rotas**, e todo o resto do código vive em `src/`.

```
guia-financeiro/
├── assets/images/            ícones e splash
└── src/
    ├── app/                  ROTAS (expo-router) — só layout de tela
    │   ├── _layout.tsx       layout raiz + providers globais
    │   ├── index.tsx         redireciona para o login
    │   ├── +not-found.tsx
    │   ├── (auth)/           sign-in, sign-up
    │   ├── (tabs)/           home, incomes, bills
    │   ├── incomes/new.tsx   modal "Nova receita"
    │   └── bills/new.tsx     modal "Nova conta a pagar"
    ├── components/ui/        componentes compartilhados (Button, Card, TextField...)
    ├── constants/            design tokens: cores, espaçamento, tipografia
    ├── features/             módulos do app (auth, incomes, bills)
    ├── hooks/                hooks genéricos
    ├── lib/                  utilitários (formatação, datas)
    └── types/                tipos compartilhados
```

### As duas regras que seguimos

1. **Tela não tem regra de negócio.** Arquivos em `src/app` montam o layout e
   chamam hooks/serviços da feature correspondente.
2. **Componente nasce na feature.** Se dois módulos passarem a usar o mesmo
   componente, ele sobe para `src/components/ui`.

## Telas do wireframe

| Wireframe | Rota |
| --- | --- |
| Login | `/sign-in` |
| Criar conta | `/sign-up` |
| Início (dashboard) | `/home` |
| Receitas | `/incomes` |
| Contas a pagar | `/bills` |
| Nova receita | `/incomes/new` |
| Nova conta a pagar | `/bills/new` |

Todas já navegam, com o conteúdo marcado como `TODO (aula)`.

## Próximos passos sugeridos (roteiro de aulas)

1. Componentes de UI e design tokens — recriar o visual do dashboard.
2. Estado local e formulários — tela "Nova receita".
3. Persistência local (AsyncStorage / SQLite) — listar receitas salvas.
4. Contas a pagar: status, filtros e marcar como paga.
5. Contexto de autenticação e proteção de rotas.
6. Integração com API e tratamento de erro/carregamento.

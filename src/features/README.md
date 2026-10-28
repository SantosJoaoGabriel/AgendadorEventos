# Features

Cada pasta aqui é um "módulo" do app e concentra tudo o que pertence a ele:

```
features/<feature>/
├── components/   componentes usados só por esta feature
├── hooks/        regras de estado desta feature
├── services/     acesso a dados (API, storage, mock)
├── types.ts      tipos da feature
└── index.ts      o que a feature expõe para fora
```

Regra prática: **as telas em `src/app` só montam layout e chamam a feature.**
Se um componente passar a ser usado por duas features, ele sobe para `src/components/ui`.

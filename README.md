# PlanOS Desktop

Aplicativo desktop offline-first para planejamento e gerenciamento diário de andames, usando Electron + React + TypeScript + TailwindCSS.

## Estrutura

- `main/` Processo Electron, banco local SQLite, IPC e filesystem.
- `renderer/` Interface React (UI) com Vite.
- `examples/` Arquivo mock de Excel e mapeamento de colunas.

## Scripts

```bash
npm run dev
npm run build
npm run generate:mock
```

## Banco local

Na primeira execução o aplicativo cria automaticamente o arquivo SQLite em:

```
<userData>/db/planejamento.db
```

com as tabelas iniciais e uma equipe padrão.

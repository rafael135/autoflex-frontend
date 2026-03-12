# Autoflex — Gestão Industrial (Frontend Vue)

Front-end do sistema de controle de estoque industrial — cadastro de produtos, matérias-primas e simulador de produção.
Migração do projeto React para **Vue 3**, mantendo paridade funcional e arquitetura em Vertical Slices.

> Backend: [rafael135/autoflex-api](https://github.com/rafael135/autoflex-api)

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| UI | Vue 3 + PrimeVue 3 + PrimeIcons |
| Linguagem | TypeScript 5.9 (strict) |
| Build | Vite 7 + Vue TSC |
| Estado / Data fetching | Composables + Axios (Pinia na base do app) |
| Roteamento | Vue Router 4 |
| Testes unitários | Vitest 4 + Testing Library (Vue) |
| Testes E2E | Cypress 15 |

---

## Requisitos Atendidos

**Funcionais**

| ID | Implementação |
|----|---------------|
| RF001–RF003 | CRUD de produtos, matérias-primas e associações via API REST |
| RF004 | Endpoint `GET /production` para cálculo de produção possível |
| RF005–RF006 | Tabelas paginadas com modal de criação/edição para produtos e insumos |
| RF007 | Associação produto ↔ matérias-primas no modal de produto |
| RF008 | Tela `/production` com cards de estatística e tabela ranqueada |

**Não Funcionais**

| ID | Como foi atendido |
|----|-------------------|
| RNF001 | SPA em Vue, compatível com navegadores modernos |
| RNF002 | Front e back separados; comunicação via `VITE_API_URL` |
| RNF003 | Layout responsivo com sidebar desktop e drawer mobile |
| RNF006 | Vue 3 + TypeScript + arquitetura por features |
| RNF007 | Código e endpoints em inglês; UI em português conforme domínio |

**Desejáveis:** ✅ 39 testes unitários (Vitest) · ✅ 4 specs Cypress (18 testes E2E)

---

## Funcionalidades

- **`/products`** — CRUD com tabela paginada; modal inclui seleção de matérias-primas com busca e paginação incremental
- **`/rawMaterials`** — CRUD com tabela paginada de insumos
- **`/production`** — cards de estatística (valor total, total simulado, top produto) e tabela ranqueada de produção possível

---

## Arquitetura

Estrutura por Vertical Slices em `src/features`:

- `products`
- `rawMaterials`
- `production`

Cada slice possui módulos de `api`, `composables`, `components`, `routes` e `types`.

---

## Instalação

```bash
npm install
```

Crie `.env` na raiz (ou copie de `.env.example`):

```env
VITE_API_URL=http://localhost:8080/api
```

---

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (`vue-tsc` + `vite build`) |
| `npm run preview` | Preview do build |
| `npm run typecheck` | Verificação de tipos |
| `npm run test` | Testes unitários (run) |
| `npm run test:watch` | Testes unitários em watch |
| `npm run test:ui` | Interface do Vitest |
| `npm run test:coverage` | Cobertura de testes |
| `npm run cy:open` | Abre Cypress |
| `npm run cy:run` | Cypress headless |
| `npm run cy:dev` | Sobe dev server + abre Cypress |
| `npm run cy:ci` | Sobe dev server + Cypress headless |

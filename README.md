# Autoflex — Gestão Industrial (Frontend)

Front-end do sistema de controle de estoque industrial — cadastro de produtos, matérias-primas e simulador de produção. Desenvolvido como teste técnico para a vaga na **Projedata**.

> O back-end (API REST) está em repositório separado.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| UI | React 19 + Ant Design 6 |
| Linguagem | TypeScript 5.9 (strict) |
| Build | Vite 7 (SWC) |
| Estado / Data fetching | Redux Toolkit 2 + RTK Query |
| Roteamento | React Router DOM 7 |
| Testes unitários | Vitest 4 + Testing Library |
| Testes E2E | Cypress 15 |

---

## Requisitos Atendidos

**Funcionais**

| ID | Implementação |
|----|---------------|
| RF001–RF003 | CRUD de produtos, matérias-primas e associações consumidos via RTK Query |
| RF004 | Endpoint `GET /production` calcula produção possível (prioridade por maior valor) |
| RF005–RF006 | Tabelas paginadas com modal de criação/edição para produtos e insumos |
| RF007 | Associação produto ↔ matérias-primas incorporada no modal de produto |
| RF008 | Tela `/production` com cards de estatística e tabela ranqueada |

**Não Funcionais**

| ID | Como foi atendido |
|----|-------------------|
| RNF001 | React SPA — funciona em Chrome, Firefox e Edge |
| RNF002 | Front e back em repositórios separados; comunicação via `VITE_API_URL` |
| RNF003 | Layout responsivo com `Grid.useBreakpoint()`, sidebar colapsável e Drawer mobile |
| RNF006 | React 19 + Redux Toolkit 2 + RTK Query |
| RNF007 | Código, endpoints e colunas em inglês |

**Desejáveis:** ✅ 14 suítes Vitest · ✅ 4 specs Cypress (navegação, produtos, insumos, produção)

---

## Funcionalidades

- **`/products`** — CRUD com tabela paginada; modal inclui seleção de matérias-primas com lazy loading e debounce
- **`/rawMaterials`** — CRUD com tabela paginada e filtro por nome
- **`/production`** — cards de estatística (valor total, total simulado, top produto) e tabela ranqueada de produção possível

---

## Instalação

```bash
npm install
```

Crie `.env` na raiz:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm test` | Testes unitários (watch) |
| `npm run test:coverage` | Cobertura de testes |
| `npm run cy:dev` | Sobe dev server + abre Cypress |
| `npm run cy:ci` | Sobe dev server + Cypress headless |
| `npm run cy:mock` | Cypress com fixtures locais (sem back-end) |

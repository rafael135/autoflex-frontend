# Autoflex Frontends

Repositório com duas implementações de frontend para o sistema **Autoflex — Gestão Industrial**:

- **React** (implementação original): `autoflex-frontend`
- **Vue** (migração com paridade funcional): `autoflex-vue`

Ambas consomem o mesmo backend:

> API: [rafael135/autoflex-api](https://github.com/rafael135/autoflex-api)

---

## Estrutura

```text
autoflex-frontends/
├── autoflex-frontend/   # React + Ant Design + RTK Query
└── autoflex-vue/        # Vue + PrimeVue + Composables
```

---

## Por que os projetos estão separados?

A separação foi intencional para garantir:

1. **Comparação clara entre stacks**
   - Permite avaliar React e Vue lado a lado, sem misturar dependências e convenções.

2. **Evolução independente**
   - Cada frontend pode evoluir no próprio ritmo (UI, arquitetura, testes e tooling) sem risco de regressão cruzada.

3. **Build e pipeline isolados**
   - Scripts, cobertura de testes e execução de CI/E2E ficam previsíveis por projeto.

4. **Rastreabilidade da migração**
   - O projeto Vue representa a migração incremental com paridade funcional do projeto React.

---

## Resumo das stacks

| Projeto | UI | Dados | Roteamento | Testes |
|---------|----|-------|------------|--------|
| `autoflex-frontend` | React 19 + Ant Design 6 | Redux Toolkit + RTK Query | React Router 7 | Vitest + Cypress |
| `autoflex-vue` | Vue 3 + PrimeVue 3 | Composables + Axios (Pinia base) | Vue Router 4 | Vitest + Cypress |

---

## Funcionalidades (presentes nos dois)

- **`/products`**: CRUD de produtos com paginação e associação de matérias-primas
- **`/rawMaterials`**: CRUD de matérias-primas com paginação
- **`/production`**: simulação de produção com cards de estatística e tabela ranqueada

---

## Como rodar

### 1) React

```bash
cd autoflex-frontend
npm install
npm run dev
```

### 2) Vue

```bash
cd autoflex-vue
npm install
npm run dev
```

Em ambos, configure o `.env` com:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## Documentação de cada projeto

- Veja o README do React em `autoflex-frontend/README.md`
- Veja o README do Vue em `autoflex-vue/README.md`

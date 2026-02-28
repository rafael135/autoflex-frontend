/// <reference types="cypress" />

// ---------------------------------------------------------------------------
// Type declarations for custom commands
// ---------------------------------------------------------------------------
declare global {
    namespace Cypress {
        interface Chainable {
            useMocks(): boolean;
            interceptGetRawMaterials(fixture?: string): void;
            interceptGetProducts(fixture?: string): void;
            interceptGetProduction(fixture?: string): void;
            interceptCrudRawMaterial(): void;
            interceptCrudProduct(): void;
            cleanupE2EData(): Chainable<void>;
        }
    }
}

const apiUrl = (): string => (Cypress.env("apiUrl") as string) ?? "http://localhost:8080/api";

Cypress.Commands.add("useMocks", () => !!Cypress.env("useMocks"));

Cypress.Commands.add("interceptGetRawMaterials", (fixture = "raw-materials-page-1.json") => {
    if (!Cypress.env("useMocks")) return;
    cy.intercept("GET", `${apiUrl()}/raw-materials*`, { fixture }).as("getRawMaterials");
});

Cypress.Commands.add("interceptGetProducts", (fixture = "products-page-1.json") => {
    if (!Cypress.env("useMocks")) return;
    cy.intercept("GET", `${apiUrl()}/products*`, { fixture }).as("getProducts");
});

Cypress.Commands.add("interceptGetProduction", (fixture = "production-data.json") => {
    if (!Cypress.env("useMocks")) return;
    cy.intercept("GET", `${apiUrl()}/production`, { fixture }).as("getProduction");
});

Cypress.Commands.add("interceptCrudRawMaterial", () => {
    if (!Cypress.env("useMocks")) return;
    cy.intercept("POST",   `${apiUrl()}/raw-materials`,   { statusCode: 201, body: { id: 99, name: "[E2E] Insumo Mock", stockQuantity: 100 } }).as("createRawMaterial");
    cy.intercept("PUT",    `${apiUrl()}/raw-materials/*`, { statusCode: 200, body: { id: 99, name: "[E2E] Insumo Mock Editado", stockQuantity: 200 } }).as("updateRawMaterial");
    cy.intercept("DELETE", `${apiUrl()}/raw-materials/*`, { statusCode: 204, body: null }).as("deleteRawMaterial");
});

Cypress.Commands.add("interceptCrudProduct", () => {
    if (!Cypress.env("useMocks")) return;
    cy.intercept("POST",   `${apiUrl()}/products`,   { statusCode: 201, body: { id: 99, name: "[E2E] Produto Mock", value: 100, materials: [] } }).as("createProduct");
    cy.intercept("PUT",    `${apiUrl()}/products/*`, { statusCode: 200, body: { id: 99, name: "[E2E] Produto Mock Editado", value: 200, materials: [] } }).as("updateProduct");
    cy.intercept("DELETE", `${apiUrl()}/products/*`, { statusCode: 204, body: null }).as("deleteProduct");
});

Cypress.Commands.add("cleanupE2EData", () => {
    if (Cypress.env("useMocks")) return;
    const api = apiUrl();

    cy.request({ url: `${api}/raw-materials?name=%5BE2E%5D&page=1&itemsPerPage=100`, failOnStatusCode: false })
      .then((res) => {
          const items: Array<{ id: number }> = res.body?.data ?? [];
          items.forEach((item) => {
              cy.request({ method: "DELETE", url: `${api}/raw-materials/${item.id}`, failOnStatusCode: false });
          });
      });

    cy.request({ url: `${api}/products?page=1&itemsPerPage=100`, failOnStatusCode: false })
      .then((res) => {
          const items: Array<{ id: number; name: string }> = res.body?.data ?? [];
          items.filter((p) => p.name.startsWith("[E2E]")).forEach((item) => {
              cy.request({ method: "DELETE", url: `${api}/products/${item.id}`, failOnStatusCode: false });
          });
      });
});

export {};

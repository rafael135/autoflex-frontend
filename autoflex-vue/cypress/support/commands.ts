/// <reference types="cypress" />

const apiUrl = (): string => (Cypress.env("apiUrl") as string) ?? "http://localhost:8080/api";

Cypress.Commands.add("useMocks", () => true);

Cypress.Commands.add("interceptGetRawMaterials", (fixture = "raw-materials-page-1.json") => {
  cy.intercept("GET", `${apiUrl()}/raw-materials*`, { fixture }).as("getRawMaterials");
});

Cypress.Commands.add("interceptGetProducts", (fixture = "products-page-1.json") => {
  cy.intercept("GET", `${apiUrl()}/products*`, { fixture }).as("getProducts");
});

Cypress.Commands.add("interceptGetProduction", (fixture = "production-data.json") => {
  cy.intercept("GET", `${apiUrl()}/production`, { fixture }).as("getProduction");
});

Cypress.Commands.add("interceptCrudRawMaterial", () => {
  cy.intercept("POST", `${apiUrl()}/raw-materials`, {
    statusCode: 201,
    body: { id: 99, name: "[E2E] Insumo Mock", stockQuantity: 100 },
  }).as("createRawMaterial");

  cy.intercept("PUT", `${apiUrl()}/raw-materials/*`, {
    statusCode: 200,
    body: { id: 99, name: "[E2E] Insumo Mock Editado", stockQuantity: 200 },
  }).as("updateRawMaterial");

  cy.intercept("DELETE", `${apiUrl()}/raw-materials/*`, {
    statusCode: 204,
    body: null,
  }).as("deleteRawMaterial");
});

Cypress.Commands.add("interceptCrudProduct", () => {
  cy.intercept("POST", `${apiUrl()}/products`, {
    statusCode: 201,
    body: { id: 99, name: "[E2E] Produto Mock", value: 100, materials: [] },
  }).as("createProduct");

  cy.intercept("PUT", `${apiUrl()}/products/*`, {
    statusCode: 200,
    body: { id: 99, name: "[E2E] Produto Mock Editado", value: 200, materials: [] },
  }).as("updateProduct");

  cy.intercept("DELETE", `${apiUrl()}/products/*`, {
    statusCode: 204,
    body: null,
  }).as("deleteProduct");
});

export {};export {};
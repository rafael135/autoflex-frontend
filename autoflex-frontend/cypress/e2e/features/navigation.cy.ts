// ============================================================================
// Navigation spec
// Tests: default redirect, 404 fallback, sidebar navigation
// ============================================================================
export {};

describe("Navigation", () => {
    it("redirects / to /products", () => {
        cy.visit("/");
        cy.url().should("include", "/products");
    });

    it("shows the 404 page for an unknown route", () => {
        cy.visit("/rota-invalida", { failOnStatusCode: false });
        cy.get("[data-testid='not-found-page']").should("be.visible");
        cy.contains("404").should("be.visible");
    });

    it("navigates back to /products from 404 page", () => {
        cy.visit("/rota-invalida", { failOnStatusCode: false });
        cy.get("[data-testid='not-found-home-button']").click();
        cy.url().should("include", "/products");
    });

    it("navigates to /rawMaterials via sidebar", () => {
        cy.visit("/products");
        // Ant Design menu items render as li with data-menu-id containing the key
        cy.contains("Insumos").click();
        cy.url().should("include", "/rawMaterials");
    });

    it("navigates to /production via sidebar", () => {
        cy.visit("/products");
        cy.contains("Simulador").click();
        cy.url().should("include", "/production");
    });

    it("navigates back to /products via sidebar", () => {
        cy.visit("/rawMaterials");
        cy.contains("Produtos").click();
        cy.url().should("include", "/products");
    });
});

describe("Navigation", () => {
  it("navigates between feature routes", () => {
    cy.visit("/");
    cy.url().should("include", "/products");

    cy.contains("button", "Insumos").click();
    cy.url().should("include", "/rawMaterials");

    cy.contains("button", "Simulador").click();
    cy.url().should("include", "/production");

    cy.contains("button", "Produtos").click();
    cy.url().should("include", "/products");
  });
});
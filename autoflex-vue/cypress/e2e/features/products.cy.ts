export {};

describe("Products", () => {
  beforeEach(() => {
    cy.interceptGetProducts();
    cy.interceptGetRawMaterials();
    cy.interceptCrudProduct();
    cy.visit("/products");
  });

  it("shows products table", () => {
    cy.get("[data-testid='products-table']").should("be.visible");
  });

  it("opens and closes create modal", () => {
    cy.get("[data-testid='add-product-button']").click();
    cy.get(".p-dialog:visible").should("contain.text", "Novo Produto");

    cy.get(".p-dialog:visible").within(() => {
      cy.get("[data-testid='modal-cancel-button']").click();
    });
    cy.get(".p-dialog:visible").should("not.exist");
  });

  it("creates a product", () => {
    cy.get("[data-testid='add-product-button']").click();

    cy.get(".p-dialog:visible").within(() => {
      cy.get("[data-testid='name-input']")
        .clear()
        .type("[E2E] Produto Cypress")
        .should("have.value", "[E2E] Produto Cypress");

      cy.get("[data-testid='value-input']")
        .click()
        .type("{selectall}250")
        .blur()
        .should("have.value", "250");

      cy.get("[data-testid='modal-ok-button']").click();
    });

    cy.wait("@createProduct");

    cy.contains("Produto cadastrado com sucesso").should("be.visible");
  });

  it("edits a product", () => {
    cy.get("[data-testid='edit-button']").first().click();
    cy.contains("Editar Produto").should("be.visible");

    cy.get("[data-testid='name-input']").clear().type("[E2E] Produto Cypress Editado");
    cy.get("[data-testid='modal-ok-button']").click();
    cy.wait("@updateProduct");

    cy.contains("Produto atualizado com sucesso").should("be.visible");
  });

  it("deletes a product", () => {
    cy.on("window:confirm", () => true);
    cy.get("[data-testid='delete-button']").first().click();
    cy.wait("@deleteProduct");

    cy.contains("Produto excluído com sucesso").should("be.visible");
  });
});
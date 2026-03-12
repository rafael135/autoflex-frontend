export {};

describe("Raw Materials", () => {
  beforeEach(() => {
    cy.interceptGetRawMaterials();
    cy.interceptCrudRawMaterial();
    cy.visit("/rawMaterials");
  });

  it("shows raw materials table", () => {
    cy.get("[data-testid='raw-materials-table']").should("be.visible");
  });

  it("opens and closes create modal", () => {
    cy.get("[data-testid='add-raw-material-button']").click();
    cy.get(".p-dialog:visible").should("contain.text", "Novo Insumo");

    cy.get(".p-dialog:visible").within(() => {
      cy.get("[data-testid='modal-cancel-button']").click();
    });
    cy.get(".p-dialog:visible").should("not.exist");
  });

  it("creates a raw material", () => {
    cy.get("[data-testid='add-raw-material-button']").click();

    cy.get(".p-dialog:visible").within(() => {
      cy.get("[data-testid='name-input']")
        .clear()
        .type("[E2E] Insumo Cypress")
        .should("have.value", "[E2E] Insumo Cypress");

      cy.get("[data-testid='stock-quantity-input']")
        .click()
        .type("{selectall}100")
        .blur()
        .should("have.value", "100");

      cy.get("[data-testid='modal-ok-button']").click();
    });

    cy.wait("@createRawMaterial");

    cy.contains("Insumo cadastrado com sucesso").should("be.visible");
  });

  it("edits a raw material", () => {
    cy.get("[data-testid='edit-button']").first().click();
    cy.contains("Editar Insumo").should("be.visible");

    cy.get("[data-testid='name-input']").clear().type("[E2E] Insumo Cypress Editado");
    cy.get("[data-testid='modal-ok-button']").click();
    cy.wait("@updateRawMaterial");

    cy.contains("Insumo atualizado com sucesso").should("be.visible");
  });

  it("deletes a raw material", () => {
    cy.on("window:confirm", () => true);
    cy.get("[data-testid='delete-button']").first().click();
    cy.wait("@deleteRawMaterial");

    cy.contains("Insumo excluído com sucesso").should("be.visible");
  });
});
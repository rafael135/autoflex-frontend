export {};

describe("Production Simulator", () => {
  beforeEach(() => {
    cy.interceptGetProduction();
    cy.visit("/production");
  });

  describe("Statistics Cards", () => {
    it("shows total production value card", () => {
      cy.get("[data-testid='statistic-total-value']").should("be.visible");
    });

    it("shows simulated products card", () => {
      cy.get("[data-testid='statistic-products-count']").should("be.visible");
    });

    it("shows max capacity card", () => {
      cy.get("[data-testid='statistic-max-capacity']").should("be.visible");
    });
  });

  describe("Simulation Table", () => {
    it("shows the production table", () => {
      cy.get("[data-testid='production-table']").should("be.visible");
    });

    it("shows products with capacity and total value", () => {
      cy.get("[data-testid='production-table']").contains("Quadro Elétrico Industrial");
      cy.get("[data-testid='production-table']").contains("Painel de Comando");
    });

    it("shows empty state when no products are simulable", () => {
      cy.interceptGetProduction("production-empty.json");
      cy.visit("/production");
      cy.get("[data-testid='production-empty']").should("be.visible");
      cy.get("[data-testid='statistic-products-count']").should("contain.text", "0");
    });
  });

  describe("Error Handling", () => {
    it("shows error alert when API fails", () => {
      cy.intercept("GET", `${Cypress.env("apiUrl")}/production`, { statusCode: 500, body: {} }).as(
        "getProductionError",
      );
      cy.visit("/production");
      cy.get("[data-testid='error-alert']").should("be.visible");
      cy.contains("Erro ao carregar dados de produção.").should("be.visible");
    });
  });
});
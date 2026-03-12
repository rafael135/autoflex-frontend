// ============================================================================
// Production simulator spec
// Real backend by default; mock mode activated via cypress --env useMocks=true
// In real mode, creates [E2E] products + raw materials with sufficient stock
// to guarantee the simulator returns results.
// ============================================================================
export {};

describe("Production Simulator", () => {
    // IDs tracked for cleanup
    let rawMaterialId: number;

    before(() => {
        cy.cleanupE2EData();

        if (!Cypress.env("useMocks")) {
            // 1. Create a raw material with ample stock
            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/raw-materials`,
                body: { name: "[E2E] Insumo Producao", stockQuantity: 1000 },
            }).then((rmRes) => {
                rawMaterialId = rmRes.body.id;

                // 2. Create a product that uses this raw material
                cy.request({
                    method: "POST",
                    url: `${Cypress.env("apiUrl")}/products`,
                    body: {
                        name: "[E2E] Produto Producao",
                        value: 500,
                        materials: [{ rawMaterialId, quantity: 5 }],
                    },
                });
            });
        }
    });

    after(() => {
        cy.cleanupE2EData();
    });

    beforeEach(() => {
        cy.interceptGetProduction();
        cy.visit("/production");
    });

    // =========================================================================
    // Statistics cards
    // =========================================================================
    describe("Statistics Cards", () => {
        it("shows the Total Production Value card", () => {
            cy.get("[data-testid='statistic-total-value']").should("be.visible");
        });

        it("shows the Simulated Products card", () => {
            cy.get("[data-testid='statistic-products-count']").should("be.visible");
        });

        it("shows the Maximum Capacity card", () => {
            cy.get("[data-testid='statistic-max-capacity']").should("be.visible");
        });

        it("shows non-zero values when there are products with sufficient stock", () => {
            if (Cypress.env("useMocks")) {
                // Fixture has totalProductionValue = 2700
                cy.get("[data-testid='statistic-total-value']").should("contain.text", "2.700");
                cy.get("[data-testid='statistic-products-count']").should("contain.text", "2");
                return;
            }

            // Real backend: at least 1 product should be simulable — check the
            // ant-statistic-content-value span directly to avoid icon text garbling parseInt
            cy.get("[data-testid='statistic-products-count']")
                .find(".ant-statistic-content-value")
                .invoke("text")
                .then((text) => {
                    expect(parseInt(text.trim(), 10)).to.be.greaterThan(0);
                });
        });
    });

    // =========================================================================
    // Table
    // =========================================================================
    describe("Simulation Table", () => {
        it("shows the production table", () => {
            cy.get("[data-testid='production-table']").should("be.visible");
        });

        it("shows products with capacity and total value", () => {
            if (Cypress.env("useMocks")) {
                cy.get("[data-testid='production-table']").contains("Quadro Elétrico Industrial");
                cy.get("[data-testid='production-table']").contains("4");
                return;
            }

            cy.get("[data-testid='production-table']").contains("[E2E] Produto Producao");
        });

        it("shows empty state when no products are simulable (mock)", () => {
            if (!Cypress.env("useMocks")) return;
            cy.interceptGetProduction("production-empty.json");
            cy.visit("/production");
            cy.contains("Nenhum produto pode ser produzido com o estoque atual.").should("be.visible");
        });
    });

    // =========================================================================
    // Error state (mock only)
    // =========================================================================
    describe("Error Handling", () => {
        it("shows error alert when the API returns an error (mock)", () => {
            if (!Cypress.env("useMocks")) return;
            cy.intercept("GET", "**/production", { statusCode: 500, body: {} }).as("getProductionError");
            cy.visit("/production");
            cy.get("[data-testid='error-alert']").should("be.visible");
            cy.contains("Não foi possível carregar os dados de produção.").should("be.visible");
        });
    });
});

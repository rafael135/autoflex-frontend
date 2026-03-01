// ============================================================================
// Products spec
// Real backend by default; mock mode activated via cypress --env useMocks=true
// All test data uses the "[E2E]" prefix to avoid polluting real records.
// ============================================================================
export {};

const PRODUCT_NAME = "[E2E] Produto Cypress";
const PRODUCT_NAME_UPDATED = "[E2E] Produto Cypress Editado";
const RAW_MATERIAL_NAME = "[E2E] Insumo para Produto";

describe("Products", () => {
    before(() => {
        cy.cleanupE2EData();
    });

    afterEach(() => {
        cy.cleanupE2EData();
    });

    // -------------------------------------------------------------------------
    // Setup mocks when not using real backend
    // -------------------------------------------------------------------------
    beforeEach(() => {
        cy.interceptGetProducts();
        cy.interceptGetRawMaterials();
        cy.visit("/products");
    });

    // =========================================================================
    // List
    // =========================================================================
    describe("Products List", () => {
        it("shows the products table", () => {
            cy.get("[data-testid='products-table']").should("be.visible");
        });

        it("shows empty state when no products are available", () => {
            cy.interceptGetProducts("products-empty.json");
            cy.visit("/products");
            cy.contains("Não há produtos registrados").should("be.visible");
        });

        it("shows error alert when the API returns an error (mock)", () => {
            if (!Cypress.env("useMocks")) return;
            cy.intercept("GET", "**/products*", { statusCode: 500, body: {} }).as("getProductsError");
            cy.visit("/products");
            cy.get("[data-testid='error-alert']").should("be.visible");
        });
    });

    // =========================================================================
    // Create — without materials
    // =========================================================================
    describe("Create Product without materials", () => {
        beforeEach(() => {
            cy.interceptCrudProduct();
        });

        it("opens the modal when clicking on New Product", () => {
            cy.get("[data-testid='add-product-button']").click();
            cy.get("[data-testid='crud-modal']").should("be.visible");
            cy.contains("Novo Produto").should("be.visible");
        });

        it("closes the modal when canceling", () => {
            cy.get("[data-testid='add-product-button']").click();
            cy.get("[data-testid='modal-cancel-button']").click();
            cy.get("[data-testid='crud-modal']").should("not.exist");
        });

        it("shows validations when submitting empty form", () => {
            cy.get("[data-testid='add-product-button']").click();
            cy.get("[data-testid='modal-ok-button']").click();
            cy.contains("Informe o nome").should("be.visible");
            cy.contains("Informe o valor unitário").should("be.visible");
        });

        it("creates a product without materials successfully", () => {
            cy.get("[data-testid='add-product-button']").click();
            cy.get("[data-testid='name-input']").type(PRODUCT_NAME);
            cy.get("[data-testid='value-input']").type("250");
            cy.get("[data-testid='modal-ok-button']").click();

            cy.get("[data-testid='crud-modal']").should("not.exist");
            cy.contains("Produto cadastrado com sucesso").should("be.visible");

            if (!Cypress.env("useMocks")) {
                cy.contains(PRODUCT_NAME).should("be.visible");
                cy.contains("0 insumos").should("be.visible");
            }
        });
    });

    // =========================================================================
    // Create — with materials
    // =========================================================================
    describe("Create Product with materials", () => {
        beforeEach(() => {
            cy.interceptCrudProduct();
        });

        it("adds and removes materials in the form", () => {
            cy.get("[data-testid='add-product-button']").click();

            // Add first material
            cy.get("[data-testid='add-material-button']").click();
            cy.get("[data-testid='quantity-input-0']").should("be.visible");

            // Add second material
            cy.get("[data-testid='add-material-button']").click();
            cy.get("[data-testid='quantity-input-1']").should("be.visible");

            // Remove second material
            cy.get("[data-testid='remove-material-button-1']").click();
            cy.get("[data-testid='quantity-input-1']").should("not.exist");
        });

        it("creates a product with materials using real backend", () => {
            if (Cypress.env("useMocks")) return;

            // Create a raw material to associate
            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/raw-materials`,
                body: { name: RAW_MATERIAL_NAME, stockQuantity: 500 },
            }).then((rmRes) => {
                const rmId: number = rmRes.body.id;

                cy.visit("/products");
                cy.get("[data-testid='add-product-button']").click();
                cy.get("[data-testid='name-input']").type(PRODUCT_NAME);
                cy.get("[data-testid='value-input']").type("300");

                cy.get("[data-testid='add-material-button']").click();

                // Wait for the material row to render, then open the Select
                cy.get("[data-testid='material-select-0']").should('exist').click();
                cy.contains(RAW_MATERIAL_NAME).click();

                cy.get("[data-testid='quantity-input-0']").type("2");
                cy.get("[data-testid='modal-ok-button']").click();

                cy.get("[data-testid='crud-modal']").should("not.exist");
                cy.contains("Produto cadastrado com sucesso").should("be.visible");
                cy.contains(PRODUCT_NAME).should("be.visible");
                cy.contains("1 insumo").should("be.visible");

                // Cleanup orphan raw material
                cy.request({ method: "DELETE", url: `${Cypress.env("apiUrl")}/raw-materials/${rmId}`, failOnStatusCode: false });
            });
        });
    });

    // =========================================================================
    // Edit
    // =========================================================================
    describe("Edit Product", () => {
        beforeEach(() => {
            cy.interceptCrudProduct();
        });

        it("opens the edit modal pre-filled", () => {
            if (Cypress.env("useMocks")) {
                cy.get("[data-testid='edit-button']").first().click();
                cy.get("[data-testid='crud-modal']").should("be.visible");
                cy.contains("Editar Produto").should("be.visible");
                cy.get("[data-testid='name-input']").should("not.have.value", "");
                return;
            }

            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/products`,
                body: { name: PRODUCT_NAME, value: 100, materials: [] },
            });
            cy.visit("/products");
            cy.contains(PRODUCT_NAME).parents("tr").find("[data-testid='edit-button']").click();
            cy.get("[data-testid='crud-modal']").should("be.visible");
            cy.contains("Editar Produto").should("be.visible");
            cy.get("[data-testid='name-input']").should("have.value", PRODUCT_NAME);
        });

        it("edits a product successfully", () => {
            if (Cypress.env("useMocks")) {
                cy.get("[data-testid='edit-button']").first().click();
                cy.get("[data-testid='name-input']").clear().type(PRODUCT_NAME_UPDATED);
                cy.get("[data-testid='modal-ok-button']").click();
                cy.get("[data-testid='crud-modal']").should("not.exist");
                return;
            }

            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/products`,
                body: { name: PRODUCT_NAME, value: 100, materials: [] },
            });
            cy.visit("/products");
            cy.contains(PRODUCT_NAME).parents("tr").find("[data-testid='edit-button']").click();
            cy.get("[data-testid='name-input']").clear().type(PRODUCT_NAME_UPDATED);
            cy.get("[data-testid='value-input']").clear().type("999");
            cy.get("[data-testid='modal-ok-button']").click();

            cy.get("[data-testid='crud-modal']").should("not.exist");
            cy.contains("Produto atualizado com sucesso").should("be.visible");
            cy.contains(PRODUCT_NAME_UPDATED).should("be.visible");
        });
    });

    // =========================================================================
    // Delete
    // =========================================================================
    describe("Delete Product", () => {
        beforeEach(() => {
            cy.interceptCrudProduct();
        });

        it("cancels deletion when clicking No", () => {
            if (Cypress.env("useMocks")) {
                cy.get("[data-testid='delete-button']").first().click();
                cy.contains("Excluir produto").should("be.visible");
                cy.contains("Não").click();
                return;
            }

            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/products`,
                body: { name: PRODUCT_NAME, value: 50, materials: [] },
            });
            cy.visit("/products");
            cy.contains(PRODUCT_NAME).parents("tr").find("[data-testid='delete-button']").click();
            cy.contains("Excluir produto").should("be.visible");
            cy.contains("Não").click();
            cy.contains(PRODUCT_NAME).should("be.visible");
        });

        it("deletes a product when confirming", () => {
            if (Cypress.env("useMocks")) {
                cy.get("[data-testid='delete-button']").first().click();
                cy.get(".ant-popconfirm").contains("Sim").click();
                return;
            }

            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/products`,
                body: { name: PRODUCT_NAME, value: 50, materials: [] },
            });
            cy.intercept("DELETE", `${Cypress.env("apiUrl")}/products/*`).as("deleteProduct");
            cy.visit("/products");
            cy.contains(PRODUCT_NAME).parents("tr").find("[data-testid='delete-button']").click();
            cy.contains("Excluir produto").should("be.visible");
            cy.get(".ant-popconfirm").contains("Sim").click();
            cy.wait("@deleteProduct");

            // Check the toast first (message fires right after DELETE resolves),
            // then verify the row is gone (RTK re-fetch completes)
            cy.contains("Produto excluído com sucesso").should("be.visible");
            cy.contains(PRODUCT_NAME).should("not.exist");
        });
    });
});

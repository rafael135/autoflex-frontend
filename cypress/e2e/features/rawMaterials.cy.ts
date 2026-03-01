// ============================================================================
// Raw Materials spec
// Real backend by default; mock mode activated via cypress --env useMocks=true
// All test data uses the "[E2E]" prefix to avoid polluting real records.
// ============================================================================
export {};

const RAW_MATERIAL_NAME = "[E2E] Insumo Cypress";
const RAW_MATERIAL_NAME_UPDATED = "[E2E] Insumo Cypress Editado";

describe("Raw Materials", () => {
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
        cy.interceptGetRawMaterials();
        cy.visit("/rawMaterials");
    });

    // =========================================================================
    // List
    // =========================================================================
    describe("List Raw Materials", () => {
        it("shows the raw materials table", () => {
            cy.get("[data-testid='raw-materials-table']").should("be.visible");
        });

        it("shows empty state when no raw materials are available", () => {
            cy.interceptGetRawMaterials("raw-materials-empty.json");
            cy.visit("/rawMaterials");
            cy.contains("Não há insumos registrados").should("be.visible");
        });

        it("shows error alert when the API returns an error (mock)", () => {
            if (!Cypress.env("useMocks")) return;
            cy.intercept("GET", "**/raw-materials*", { statusCode: 500, body: {} }).as("getRawMaterialsError");
            cy.visit("/rawMaterials");
            cy.get("[data-testid='error-alert']").should("be.visible");
        });
    });

    // =========================================================================
    // Create
    // =========================================================================
    describe("Create Raw Material", () => {
        beforeEach(() => {
            cy.interceptCrudRawMaterial();
        });

        it("opens the modal when clicking on New Raw Material", () => {
            cy.get("[data-testid='add-raw-material-button']").click();
            cy.get("[data-testid='crud-modal']").should("be.visible");
            cy.contains("Novo Insumo").should("be.visible");
        });

        it("closes the modal when canceling", () => {
            cy.get("[data-testid='add-raw-material-button']").click();
            cy.get("[data-testid='modal-cancel-button']").click();
            cy.get("[data-testid='crud-modal']").should("not.exist");
        });

        it("shows validations when submitting empty form", () => {
            cy.get("[data-testid='add-raw-material-button']").click();
            cy.get("[data-testid='modal-ok-button']").click();
            cy.contains("Informe o nome").should("be.visible");
            cy.contains("Informe a quantidade").should("be.visible");
        });

        it("creates a raw material successfully", () => {
            cy.get("[data-testid='add-raw-material-button']").click();
            cy.get("[data-testid='name-input']").type(RAW_MATERIAL_NAME);
            cy.get("[data-testid='stock-quantity-input']").type("100");
            cy.get("[data-testid='modal-ok-button']").click();

            // Modal should close
            cy.get("[data-testid='crud-modal']").should("not.exist");

            // Success message should appear
            cy.contains("Insumo cadastrado com sucesso").should("be.visible");

            // Item should appear in the table (real backend) or modal closed (mock)
            if (!Cypress.env("useMocks")) {
                cy.contains(RAW_MATERIAL_NAME).should("be.visible");
            }
        });
    });

    // =========================================================================
    // Edit
    // =========================================================================
    describe("Edit Raw Material", () => {
        beforeEach(() => {
            cy.interceptCrudRawMaterial();
        });

        it("opens the edit modal pre-filled", () => {
            if (Cypress.env("useMocks")) {
                // In mock mode just check that the first row edit button works
                cy.get("[data-testid='edit-button']").first().click();
                cy.get("[data-testid='crud-modal']").should("be.visible");
                cy.contains("Editar Insumo").should("be.visible");
                cy.get("[data-testid='name-input']").should("not.have.value", "");
                return;
            }

            // Real backend: create then edit
            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/raw-materials`,
                body: { name: RAW_MATERIAL_NAME, stockQuantity: 50 },
            });
            cy.visit("/rawMaterials");
            cy.contains(RAW_MATERIAL_NAME).parents("tr").find("[data-testid='edit-button']").click();
            cy.get("[data-testid='crud-modal']").should("be.visible");
            cy.contains("Editar Insumo").should("be.visible");
            cy.get("[data-testid='name-input']").should("have.value", RAW_MATERIAL_NAME);
        });

        it("edits a raw material successfully", () => {
            if (Cypress.env("useMocks")) {
                cy.get("[data-testid='edit-button']").first().click();
                cy.get("[data-testid='name-input']").clear().type(RAW_MATERIAL_NAME_UPDATED);
                cy.get("[data-testid='modal-ok-button']").click();
                cy.get("[data-testid='crud-modal']").should("not.exist");
                return;
            }

            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/raw-materials`,
                body: { name: RAW_MATERIAL_NAME, stockQuantity: 50 },
            });
            cy.visit("/rawMaterials");
            cy.contains(RAW_MATERIAL_NAME).parents("tr").find("[data-testid='edit-button']").click();
            cy.get("[data-testid='name-input']").clear().type(RAW_MATERIAL_NAME_UPDATED);
            cy.get("[data-testid='stock-quantity-input']").clear().type("200");
            cy.get("[data-testid='modal-ok-button']").click();

            cy.get("[data-testid='crud-modal']").should("not.exist");
            cy.contains("Insumo atualizado com sucesso").should("be.visible");
            cy.contains(RAW_MATERIAL_NAME_UPDATED).should("be.visible");
        });
    });

    // =========================================================================
    // Delete
    // =========================================================================
    describe("Delete Raw Material", () => {
        beforeEach(() => {
            cy.interceptCrudRawMaterial();
        });

        it("shows delete confirmation", () => {
            if (Cypress.env("useMocks")) {
                cy.get("[data-testid='delete-button']").first().click();
                cy.contains("Excluir insumo").should("be.visible");
                cy.contains("Tem certeza").should("be.visible");
                cy.contains("Não").click(); // Cancel
                return;
            }

            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/raw-materials`,
                body: { name: RAW_MATERIAL_NAME, stockQuantity: 10 },
            });
            cy.visit("/rawMaterials");
            cy.contains(RAW_MATERIAL_NAME).parents("tr").find("[data-testid='delete-button']").click();
            cy.contains("Excluir insumo").should("be.visible");
            cy.contains("Não").click();
            cy.contains(RAW_MATERIAL_NAME).should("be.visible");
        });

        it("deletes a raw material when confirming", () => {
            if (Cypress.env("useMocks")) {
                cy.get("[data-testid='delete-button']").first().click();
                cy.get(".ant-popconfirm").contains("Sim").click();
                return;
            }

            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/raw-materials`,
                body: { name: RAW_MATERIAL_NAME, stockQuantity: 10 },
            });
            cy.intercept("DELETE", `${Cypress.env("apiUrl")}/raw-materials/*`).as("deleteRawMaterial");
            cy.visit("/rawMaterials");
            cy.contains(RAW_MATERIAL_NAME).parents("tr").find("[data-testid='delete-button']").click();
            cy.contains("Excluir insumo").should("be.visible");
            cy.get(".ant-popconfirm").contains("Sim").click();
            cy.wait("@deleteRawMaterial");

            // Check the toast first (message fires right after DELETE resolves),
            // then verify the row is gone (RTK re-fetch completes)
            cy.contains("Insumo excluído com sucesso").should("be.visible");
            cy.contains(RAW_MATERIAL_NAME).should("not.exist");
        });
    });
});

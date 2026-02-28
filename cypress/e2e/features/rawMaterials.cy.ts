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
    describe("Lista de Insumos", () => {
        it("exibe a tabela de insumos", () => {
            cy.get("[data-testid='raw-materials-table']").should("be.visible");
        });

        it("exibe estado vazio quando não há insumos", () => {
            cy.interceptGetRawMaterials("raw-materials-empty.json");
            cy.visit("/rawMaterials");
            cy.contains("Não há insumos registrados").should("be.visible");
        });

        it("exibe error alert quando a API retorna erro (mock)", () => {
            if (!Cypress.env("useMocks")) return;
            cy.intercept("GET", "**/raw-materials*", { statusCode: 500, body: {} }).as("getRawMaterialsError");
            cy.visit("/rawMaterials");
            cy.get("[data-testid='error-alert']").should("be.visible");
        });
    });

    // =========================================================================
    // Create
    // =========================================================================
    describe("Criar Insumo", () => {
        beforeEach(() => {
            cy.interceptCrudRawMaterial();
        });

        it("abre o modal ao clicar em Novo Insumo", () => {
            cy.get("[data-testid='add-raw-material-button']").click();
            cy.get("[data-testid='crud-modal']").should("be.visible");
            cy.contains("Novo Insumo").should("be.visible");
        });

        it("fecha o modal ao cancelar", () => {
            cy.get("[data-testid='add-raw-material-button']").click();
            cy.get("[data-testid='modal-cancel-button']").click();
            cy.get("[data-testid='crud-modal']").should("not.exist");
        });

        it("exibe validações ao submeter formulário vazio", () => {
            cy.get("[data-testid='add-raw-material-button']").click();
            cy.get("[data-testid='modal-ok-button']").click();
            cy.contains("Informe o nome").should("be.visible");
            cy.contains("Informe a quantidade").should("be.visible");
        });

        it("cria um insumo com sucesso", () => {
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
    describe("Editar Insumo", () => {
        beforeEach(() => {
            cy.interceptCrudRawMaterial();
        });

        it("abre o modal de edição pré-preenchido", () => {
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

        it("edita um insumo com sucesso", () => {
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
    describe("Excluir Insumo", () => {
        beforeEach(() => {
            cy.interceptCrudRawMaterial();
        });

        it("exibe confirmação de exclusão", () => {
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

        it("exclui um insumo ao confirmar", () => {
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

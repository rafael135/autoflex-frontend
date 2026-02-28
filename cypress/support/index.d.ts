/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            /** Returns true when Cypress env `useMocks` is truthy */
            useMocks(): boolean;

            /** Intercept GET /raw-materials* — uses fixture when useMocks=true */
            interceptGetRawMaterials(fixture?: string): void;

            /** Intercept GET /products* — uses fixture when useMocks=true */
            interceptGetProducts(fixture?: string): void;

            /** Intercept GET /production — uses fixture when useMocks=true */
            interceptGetProduction(fixture?: string): void;

            /** Intercept POST/PUT/DELETE for raw-materials */
            interceptCrudRawMaterial(): void;

            /** Intercept POST/PUT/DELETE for products */
            interceptCrudProduct(): void;

            /**
             * Delete all [E2E] prefixed records from the real backend.
             * No-op when useMocks=true.
             */
            cleanupE2EData(): Chainable<void>;
        }
    }
}

export {};

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      useMocks(): boolean;
      interceptGetRawMaterials(fixture?: string): void;
      interceptGetProducts(fixture?: string): void;
      interceptGetProduction(fixture?: string): void;
      interceptCrudRawMaterial(): void;
      interceptCrudProduct(): void;
    }
  }
}

export {};
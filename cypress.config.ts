import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'nhk3vd',
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.ts",
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(_on, _config) {
      // node event listeners
    },
    env: {
      apiUrl: "http://localhost:8080/api",
      useMocks: false,
    },
  },
});

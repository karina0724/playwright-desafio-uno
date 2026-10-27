import { test as base, expect } from "@playwright/test";
import { App } from "../pages/App";
import { data, TestData } from "../test-data";

/**
 * Fixture custom que extiende el test base de Playwright con:
 *   - `app`: punto de entrada a todos los Page Objects
 *   - `data`: datos de prueba resueltos (con variables de entorno aplicadas)
 *
 * Esto permite que los specs se mantengan declarativos:
 *   test("...", async ({ app, data }) => {
 *     await app.login.open();
 *     await app.login.login(data.users.validUser);
 *   });
 */

type Fixtures = {
  app: App;
  data: TestData;
};

export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    const app = new App(page);
    await use(app);
  },

  data: async ({}, use) => {
    await use(data);
  },
});

export { expect };

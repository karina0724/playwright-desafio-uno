import { test as base, expect } from "@playwright/test";
import { App } from "../pages/App";
import { data, TestData } from "../test-data";

/**
 * Custom fixture that extends Playwright's base test with:
 *   - `app`: entry point to all Page Objects
 *   - `data`: resolved test data (with environment variables applied)
 *
 * This keeps specs declarative:
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

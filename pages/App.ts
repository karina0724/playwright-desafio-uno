import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { BooksPage } from "./BooksPage";
import { ProfilePage } from "./ProfilePage";

/**
 * App — Unified entry point to all Page Objects in the system.
 * Injected into tests via fixtures so specs don't need to
 * instantiate each page manually.
 *
 * Typical usage:
 *   test("some case", async ({ app }) => {
 *     await app.login.open();
 *     await app.login.login(credentials);
 *     await app.books.open();
 *   });
 */
export class App {
  readonly login: LoginPage;
  readonly books: BooksPage;
  readonly profile: ProfilePage;

  constructor(page: Page) {
    this.login = new LoginPage(page);
    this.books = new BooksPage(page);
    this.profile = new ProfilePage(page);
  }
}

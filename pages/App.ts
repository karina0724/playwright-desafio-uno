import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { BooksPage } from "./BooksPage";
import { ProfilePage } from "./ProfilePage";

/**
 * App — Punto de entrada unificado a todos los Page Objects del sistema.
 * Se inyecta en los tests vía fixtures para que los specs no tengan que
 * instanciar manualmente cada página.
 *
 * Uso típico:
 *   test("algún caso", async ({ app }) => {
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

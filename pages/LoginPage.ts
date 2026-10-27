import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { environment } from "../config/environment";

export interface Credentials {
  username: string;
  password: string;
}

/**
 * LoginPage — Página de autenticación de demoqa.com.
 * URL: https://demoqa.com/login
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly newUserButton: Locator;
  readonly errorMessage: Locator;
  readonly userNameLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator("#userName");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login");
    this.newUserButton = page.locator("#newUser");
    this.errorMessage = page.locator("#name");
    this.userNameLabel = page.locator("#userName-value");
  }

  async open(): Promise<void> {
    await this.goto(environment.loginPath);
    await this.waitForVisible(this.loginButton);
  }

  async login(credentials: Credentials): Promise<void> {
    await this.fill(this.usernameInput, credentials.username);
    await this.fill(this.passwordInput, credentials.password);
    await this.click(this.loginButton);
  }

  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(environment.profilePath));
    await this.waitForVisible(this.userNameLabel);
  }

  async assertInvalidCredentials(): Promise<void> {
    await this.waitForVisible(this.errorMessage);
    await expect(this.errorMessage).toContainText("Invalid username or password!");
  }

  async getLoggedUserName(): Promise<string> {
    await this.waitForVisible(this.userNameLabel);
    return (await this.userNameLabel.textContent())?.trim() ?? "";
  }
}

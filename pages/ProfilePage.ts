import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { environment } from "../config/environment";

/**
 * ProfilePage — Authenticated user's profile page.
 * URL: https://demoqa.com/profile
 */
export class ProfilePage extends BasePage {
  readonly userNameLabel: Locator;
  readonly logoutButton: Locator;
  readonly goToStoreButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userNameLabel = page.locator("#userName-value");
    this.logoutButton = page.locator("#submit");
    this.goToStoreButton = page.locator("#gotoStore");
  }

  async assertProfileLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(environment.profilePath));
    await this.waitForVisible(this.userNameLabel);
  }

  async getUserName(): Promise<string> {
    return (await this.userNameLabel.textContent())?.trim() ?? "";
  }

  async logout(): Promise<void> {
    await this.click(this.logoutButton);
    await expect(this.page).toHaveURL(new RegExp(environment.loginPath));
  }
}

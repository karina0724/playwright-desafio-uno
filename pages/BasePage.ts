import { Locator, Page, expect } from "@playwright/test";

/**
 * BasePage — base contract for all Page Objects.
 * Encapsulates synchronization helpers and common actions to
 * avoid fixed sleeps and centralize explicit wait handling.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigates to a path relative to the baseURL. */
  protected async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }

  /** Click with an explicit wait for the locator to become actionable. */
  protected async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  /** Safe fill: waits for visibility, clears and types. */
  protected async fill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.fill(value);
  }

  /** Waits for a locator to become visible within the default timeout. */
  protected async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /** Waits for a locator to become hidden within the default timeout. */
  protected async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout });
  }

  /** Returns true/false based on current visibility, without throwing. */
  protected async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  /** Asserts the current URL contains the expected fragment. */
  async assertUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }
}

import { Locator, Page, expect } from "@playwright/test";

/**
 * BasePage — contrato base para todos los Page Objects.
 * Encapsula helpers de sincronización y acciones comunes para
 * evitar sleeps fijos y centralizar el manejo de esperas explícitas.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navega a una ruta relativa al baseURL. */
  protected async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }

  /** Click con espera explícita a que el locator sea accionable. */
  protected async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  /** Llenado seguro: espera visibilidad, limpia y escribe. */
  protected async fill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.fill(value);
  }

  /** Espera a que un locator sea visible dentro del timeout por defecto. */
  protected async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /** Espera a que un locator se oculte dentro del timeout por defecto. */
  protected async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout });
  }

  /** Devuelve true/false según visibilidad actual, sin lanzar excepción. */
  protected async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  /** Verifica que la URL actual contenga el fragmento esperado. */
  async assertUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }
}

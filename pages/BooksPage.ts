import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { environment } from "../config/environment";

/**
 * BooksPage — Book catalog from demoqa.com.
 * URL: https://demoqa.com/books
 *
 * Note:
 * "No rows found": reflected by an empty tbody and the paginator "Page 1 of 0".
 */
export class BooksPage extends BasePage {
  readonly searchBox: Locator;
  readonly booksWrapper: Locator;
  readonly booksTable: Locator;
  readonly bookRows: Locator;
  readonly pageInfo: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.locator("#searchBox");
    this.booksWrapper = page.locator(".books-wrapper");
    this.booksTable = page.locator(".books-wrapper table");
    this.bookRows = page.locator(".books-wrapper table tbody tr");
    this.pageInfo = page.locator(".books-wrapper").getByText(/Page\s+\d+\s+of\s+\d+/);
    this.loginButton = page.locator("#login");
  }

  async open(): Promise<void> {
    await this.goto(environment.booksPath);
    await this.waitForVisible(this.booksTable);
    await this.waitForVisible(this.pageInfo);
  }

  async searchByKeyword(keyword: string): Promise<void> {
    await this.fill(this.searchBox, keyword);
    await expect(this.pageInfo).toBeVisible();
    await expect(this.pageInfo).toHaveText(/Page\s+1\s+of\s+\d+/);
  }

  async clearSearch(): Promise<void> {
    await this.fill(this.searchBox, "");
  }

  async getVisibleBookTitles(): Promise<string[]> {
    await this.waitForVisible(this.bookRows.first());
    const titles = await this.bookRows.locator(".action-buttons a").allTextContents();
    return titles.map((t) => t.trim()).filter(Boolean);
  }

  async assertBookInResults(expectedTitle: string): Promise<void> {
    await this.waitForVisible(this.bookRows.first());
    const titles = await this.getVisibleBookTitles();
    expect(titles, `Expected the book "${expectedTitle}" in the results`).toContain(
      expectedTitle,
    );
  }

  async assertNoResultsMessage(): Promise<void> {
    await expect(this.pageInfo).toHaveText(/Page\s+1\s+of\s+0/);
    await expect(this.bookRows).toHaveCount(0);
  }

  async assertResultsCount(expected: number): Promise<void> {
    await expect(this.bookRows).toHaveCount(expected);
  }
}

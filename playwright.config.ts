import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { environment } from "./config/environment";

dotenv.config();

const WORKERS = process.env.WORKERS ? Number(process.env.WORKERS) : undefined;
const RETRIES = process.env.RETRIES ? Number(process.env.RETRIES) : 1;
const HEADLESS = process.env.HEADLESS !== "false";

export default defineConfig({
  testDir: "./test",
  timeout: 60 * 1000,
  expect: {
    timeout: environment.timeouts.default,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : RETRIES,
  workers: process.env.CI ? 1 : WORKERS,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "test-results/junit-results.xml" }],
  ],

  use: {
    baseURL: environment.baseUrl,
    headless: HEADLESS,
    actionTimeout: environment.timeouts.action,
    navigationTimeout: environment.timeouts.navigation,
    trace: "on",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1440, height: 900 },
  },

  projects: [
    {
      name: "auth",
      grep: /@auth/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "books",
      grep: /@books/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

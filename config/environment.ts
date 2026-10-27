import * as fs from "fs";
import * as path from "path";

/**
 * Per-environment configuration loader.
 * Reads the JSON file corresponding to TEST_ENV and exposes a typed object
 * for the rest of the project.
 */

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  loginPath: string;
  booksPath: string;
  profilePath: string;
  apiPath: string;
  timeouts: {
    default: number;
    navigation: number;
    action: number;
  };
}

const ENV = (process.env.TEST_ENV ?? "qa").toLowerCase();
const CONFIG_PATH = path.resolve(__dirname, "environments", `${ENV}.json`);

if (!fs.existsSync(CONFIG_PATH)) {
  throw new Error(
    `Configuración de ambiente no encontrada: ${CONFIG_PATH}. ` +
      `Verifica el valor de TEST_ENV en tu .env (actual: "${ENV}").`,
  );
}

const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
export const environment: EnvironmentConfig = JSON.parse(raw);

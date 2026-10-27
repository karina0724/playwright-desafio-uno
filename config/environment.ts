import * as fs from "fs";
import * as path from "path";

/**
 * Loader de configuración por ambiente.
 * Lee el archivo JSON correspondiente a TEST_ENV y expone un objeto tipado
 * para el resto del proyecto.
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

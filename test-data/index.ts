import usersRaw from "./users.json";
import booksRaw from "./books.json";

/**
 * Carga y resolución de datos de prueba.
 *
 * Las credenciales marcadas con el prefijo "FROM_ENV:" son resueltas
 * desde variables de entorno en tiempo de ejecución, para evitar
 * commitear secretos en el repositorio.
 */

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UsersData {
  validUser: UserCredentials;
  invalidUser: UserCredentials;
  emptyUser: UserCredentials;
}

export interface BookSearchData {
  keyword: string;
  expectedTitle?: string;
  expectedTitles?: string[];
  comment?: string;
  expectedBehavior?: string;
}

export interface BooksData {
  existingKeyword: BookSearchData;
  existingSingleResult: BookSearchData;
  istqbKeyword: BookSearchData;
  nonExistingKeyword: BookSearchData;
}

export interface TestData {
  users: UsersData;
  books: BooksData;
}

/**
 * Resuelve un valor "FROM_ENV:VAR_NAME" leyéndolo del process.env.
 */
function resolveEnvValue(value: string): string {
  if (typeof value === "string" && value.startsWith("FROM_ENV:")) {
    const envVar = value.replace("FROM_ENV:", "");
    const resolved = process.env[envVar];
    if (resolved === undefined) {
      throw new Error(
        `Variable de entorno requerida no definida: ${envVar}. ` +
          `Verifica tu archivo .env.`,
      );
    }
    return resolved;
  }
  return value;
}

function resolveCredentials(creds: UserCredentials): UserCredentials {
  return {
    username: resolveEnvValue(creds.username),
    password: resolveEnvValue(creds.password),
  };
}

export const data: TestData = {
  users: {
    validUser: resolveCredentials(usersRaw.validUser),
    invalidUser: resolveCredentials(usersRaw.invalidUser),
    emptyUser: resolveCredentials(usersRaw.emptyUser),
  },
  books: booksRaw as BooksData,
};

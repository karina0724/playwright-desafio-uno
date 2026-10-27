import usersRaw from "./users.json";
import booksRaw from "./books.json";

/**
 * Test data loading and resolution.
 *
 * Credentials prefixed with "FROM_ENV:" are resolved from
 * environment variables at runtime, to avoid committing secrets
 * to the repository.
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
 * Resolves a "FROM_ENV:VAR_NAME" value by reading it from process.env.
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

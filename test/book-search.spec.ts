import { test, expect } from "../fixtures";

test.describe("@books demoqa.com - Búsqueda de libros", () => {
  test.beforeEach(async ({ app }) => {
    await app.books.open();
  });

  test("BOOK-001: Búsqueda con palabra clave existente retorna coincidencias @smoke @positive", async ({
    app,
    data,
  }) => {
    const { keyword, expectedTitles = [] } = data.books.existingKeyword;

    await test.step(`Buscar por "${keyword}"`, async () => {
      await app.books.searchByKeyword(keyword);
    });

    await test.step("Validar que se muestren libros en los resultados", async () => {
      const titles = await app.books.getVisibleBookTitles();
      expect(titles.length).toBeGreaterThan(0);
      const anyExpectedFound = expectedTitles.some((t) => titles.includes(t));
      expect(
        anyExpectedFound,
        `Al menos uno de los títulos esperados debería aparecer. Visibles: ${titles.join(", ")}`,
      ).toBeTruthy();
    });
  });

  test("BOOK-002: Búsqueda por título exacto retorna el libro esperado @positive", async ({
    app,
    data,
  }) => {
    const { keyword, expectedTitle } = data.books.existingSingleResult;

    await test.step(`Buscar por "${keyword}"`, async () => {
      await app.books.searchByKeyword(keyword);
    });

    await test.step(`Validar presencia del libro "${expectedTitle}"`, async () => {
      await app.books.assertBookInResults(expectedTitle!);
    });
  });

  test("BOOK-003: Búsqueda por 'ISTQB Fundamentals' (no existe en el catálogo real) muestra estado vacío @negative", async ({
    app,
    data,
  }) => {
    const { keyword } = data.books.istqbKeyword;

    await test.step(`Buscar por "${keyword}"`, async () => {
      await app.books.searchByKeyword(keyword);
    });

    await test.step("Validar estado vacío (0 resultados)", async () => {
      await app.books.assertNoResultsMessage();
    });
  });

  test("BOOK-004: Búsqueda con palabra clave inexistente muestra estado vacío @negative", async ({
    app,
    data,
  }) => {
    const { keyword } = data.books.nonExistingKeyword;

    await test.step(`Buscar por "${keyword}"`, async () => {
      await app.books.searchByKeyword(keyword);
    });

    await test.step("Validar catálogo vacío", async () => {
      await app.books.assertNoResultsMessage();
      await app.books.assertResultsCount(0);
    });
  });
});

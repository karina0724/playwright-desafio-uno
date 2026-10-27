# Features — Escenarios BDD en Gherkin

Esta carpeta contiene los escenarios de prueba descritos en **Gherkin**, que actúan como **documentación viva** del comportamiento esperado del sistema.

Cada archivo `.feature` describe los escenarios en lenguaje de negocio y se corresponde con un spec de Playwright en `/test` que los ejecuta técnicamente.

## Mapeo feature ↔ spec

| Feature | Spec ejecutable | Casos |
| --- | --- | --- |
| `login.feature` | `test/login.spec.ts` | `LOG-001`, `LOG-002` |
| `book-search.feature` | `test/book-search.spec.ts` | `BOOK-001`, `BOOK-002`, `BOOK-003`, `BOOK-004` |

## Convenciones

- Los escenarios se escriben en **español** (`# language: es`).
- Cada escenario inicia con su **ID único** (`LOG-001`, `BOOK-001`, …) que se mantiene idéntico entre el `.feature` y su spec.
- Los **tags** sobre la Característica (`@auth`, `@books`) sirven de filtro por proyecto de Playwright.
- Los **tags** sobre cada Escenario (`@smoke`, `@positive`, `@negative`) sirven para segmentación fina.

## ¿Por qué no Cucumber-JS?

Se eligió mantener los `.feature` como documentación y ejecutar los escenarios con el `test` nativo de Playwright (más `test.step()` para mapear los pasos en el reporte) porque:

- Playwright nativo trae fixtures, trace viewer, reportes y paralelismo mejor integrados.
- El mantenimiento de `step definitions` de Cucumber-JS añade indirección que no aporta valor cuando el equipo es técnico.
- El contrato de negocio queda igualmente documentado en Gherkin.

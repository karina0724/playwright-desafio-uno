# demoqa Automation Suite

Suite de automatización E2E sobre [https://demoqa.com/books](https://demoqa.com/books), construida con **Playwright + TypeScript**, aplicando **Page Object Model** y escenarios **BDD en Gherkin**, con el **reporte HTML nativo de Playwright**.

| Propiedad | Valor |
| --- | --- |
| Framework | Playwright `^1.64.1` |
| Lenguaje | TypeScript `^7.0.2` |
| Patrón | Page Object Model + Fixtures custom |
| BDD | Gherkin (archivos `.feature`) |
| Reportes | Playwright HTML + JUnit |
| Autor | Karina Montero Leonardo |

---

## Tabla de contenido

1. [Requerimientos](#1-requerimientos)
2. [Instalación](#2-instalación)
3. [Configuración](#3-configuración)
4. [Ejecución de pruebas](#4-ejecución-de-pruebas)
5. [Reportes](#5-reportes)
6. [Estructura del proyecto](#6-estructura-del-proyecto)
7. [Arquitectura y decisiones de diseño](#7-arquitectura-y-decisiones-de-diseño)
8. [Casos de prueba cubiertos](#8-casos-de-prueba-cubiertos)
9. [Estudio de factibilidad — New User](#9-estudio-de-factibilidad--new-user)
10. [Buenas prácticas aplicadas](#10-buenas-prácticas-aplicadas)

---

## 1. Requerimientos

| Herramienta | Versión mínima |
| --- | --- |
| Node.js | `>= 18.x` |
| npm | `>= 9.x` |

Verifica tu versión:

```bash
node --version
npm --version
```

---

## 2. Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/karina0724/playwright-desafio-uno
cd playwright-desafio-uno

# 2. Instalar dependencias
npm install

# 3. Instalar los navegadores de Playwright
npx playwright install chromium

```

---

## 3. Configuración

### 3.1 Crear archivo `.env`

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env-template .env
```

El archivo `.env` contiene:

```env
TEST_ENV=qa
BASE_URL=https://demoqa.com
USER_NAME=automation_tester
USER_PASSWORD=Test@1234!
INVALID_USER_NAME=invalid_user_xyz
INVALID_PASSWORD=WrongPass123!
HEADLESS=true
WORKERS=2
RETRIES=1
```

### 3.2 Crear usuario válido en demoqa.com

Dado que la funcionalidad `New User` incluye reCAPTCHA (ver [docs/feasibility-new-user.md](docs/feasibility-new-user.md)), debes crear el usuario de pruebas **por API** o manualmente:

**Opción A — vía API (recomendado):**

```bash
curl -X POST https://demoqa.com/Account/v1/User \
  -H "Content-Type: application/json" \
  -d '{"userName":"automation_tester","password":"Test@1234!"}'
```

**Opción B — manual:**

Registrarte en [https://demoqa.com/register](https://demoqa.com/register) y guardar las credenciales en el `.env`.

### 3.3 Ambientes múltiples

El proyecto soporta configuración por ambiente mediante `TEST_ENV`:

- `config/environments/qa.json`
- `config/environments/staging.json`

Para cambiar de ambiente:

```bash
TEST_ENV=staging npm test
```

---

## 4. Ejecución de pruebas

### 4.1 Comandos principales

| Comando | Descripción |
| --- | --- |
| `npm test` | Ejecuta toda la suite |
| `npm run test:auth` | Solo tests de autenticación (`@auth`) |
| `npm run test:books` | Solo tests de búsqueda (`@books`) |
| `npm run test:headed` | Ejecuta con navegador visible |
| `npm run test:ui` | Modo UI interactivo de Playwright |
| `npm run test:debug` | Modo debug con Inspector |

### 4.2 Ejecutar un test específico

```bash
npx playwright test test/login.spec.ts
npx playwright test -g "LOG-001"
```

### 4.3 Ejecutar en paralelo

Por defecto corre en paralelo con los workers configurados en `.env` (`WORKERS=2`). Para forzar secuencial:

```bash
npx playwright test --workers=1
```

---

## 5. Reportes

El proyecto genera **dos reportes** en cada ejecución:

| Reporte | Carpeta | Comando para abrir |
| --- | --- | --- |
| HTML (Playwright) | `playwright-report/` | `npm run report` |
| JUnit XML | `test-results/junit-results.xml` | — (CI) |

### 5.1 HTML — reporte principal

```bash
# Abrir el último reporte HTML
npm run report
```

El reporte HTML nativo de Playwright incluye:

- Resumen de pasa/falla por proyecto y por test.
- **Steps** detallados dentro de cada test (gracias a `test.step()`).
- **Tags** por título (`@smoke`, `@positive`, `@negative`).
- **Trace viewer** interactivo, **screenshots** y **video** en caso de fallo.
- Filtros por estado, proyecto y texto.

> **¿Por qué solo Playwright HTML?**
> No requiere dependencias externas, vive en el mismo stack que la suite, se abre con un solo comando y cubre todo lo que necesitamos para la entrega: steps, tags, screenshots, video y trace viewer interactivo.

### 5.2 Limpieza de reportes

```bash
npm run clean
```

---

## 6. Estructura del proyecto

```
demoqa-automation/
├── config/
│   ├── environment.ts              # Loader de configuración por ambiente
│   └── environments/
│       ├── qa.json                 # Configuración QA
│       └── staging.json            # Configuración Staging
├── docs/
│   └── feasibility-new-user.md     # Estudio de factibilidad New User
├── features/                       # Escenarios BDD en Gherkin
│   ├── login.feature
│   └── book-search.feature
├── fixtures/
│   └── index.ts                    # Fixtures custom (app, data)
├── pages/                          # Page Object Model
│   ├── App.ts                      # Punto de entrada a todas las páginas
│   ├── BasePage.ts                 # Clase base con helpers comunes
│   ├── LoginPage.ts
│   ├── BooksPage.ts
│   └── ProfilePage.ts
├── test/                           # Specs ejecutables
│   ├── login.spec.ts
│   └── book-search.spec.ts
├── test-data/                      # Datos de prueba
│   ├── users.json
│   ├── books.json
│   └── index.ts                    # Resolver con variables de entorno
├── utils/                          # (reservado para helpers futuros)
├── .env-template
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

---

## 7. Arquitectura y decisiones de diseño

### 7.1 Page Object Model con `App` central

Cada página expone una clase que **encapsula sus locators y acciones**. La clase `App` agrupa todas las páginas y se inyecta mediante fixture, para que los specs sean declarativos:

```typescript
test("LOG-001: Login exitoso", async ({ app, data }) => {
  await app.login.open();
  await app.login.login(data.users.validUser);
  await app.login.assertLoginSuccess();
});
```

### 7.2 Fixtures custom (`app`, `data`)

El fixture extiende el `test` nativo de Playwright inyectando:

- `app`: instancia de todos los Page Objects.
- `data`: datos de prueba con variables de entorno ya resueltas.

Esto elimina instanciación repetida y centraliza el setup.

### 7.3 BasePage con esperas explícitas

`BasePage` define `click`, `fill`, `waitForVisible`, etc., que **siempre esperan por el estado del elemento** antes de accionar. **No se usan `page.waitForTimeout(ms)` ni `sleep` fijos.**

### 7.4 Configuración por ambiente

- `.env` → credenciales y flags de ejecución.
- `config/environments/<env>.json` → URLs, timeouts, paths.
- `config/environment.ts` → carga tipada del JSON correspondiente a `TEST_ENV`.

### 7.5 Separación de datos sensibles

Las credenciales en `test-data/users.json` usan el prefijo `FROM_ENV:` y se resuelven en runtime desde `process.env`. Esto evita commitear secretos.

### 7.6 Proyectos de Playwright por tag

```typescript
projects: [
  { name: "auth",  grep: /@auth/ },
  { name: "books", grep: /@books/ },
]
```

Permite ejecutar subconjuntos sin tocar el código.

### 7.7 BDD en Gherkin como documentación viva

Los archivos `.feature` describen los escenarios en lenguaje de negocio. Cada escenario Gherkin tiene su spec Playwright correspondiente con el mismo ID (`LOG-001`, `BOOK-001`, etc.), y los pasos del escenario se mapean a `test.step()` para que aparezcan en el reporte HTML y en el trace viewer como pasos navegables.

> **Nota:** Se eligió este enfoque sobre `@cucumber/cucumber` para aprovechar al máximo las fixtures, el trace viewer y el ecosistema nativo de Playwright, manteniendo la documentación Gherkin como contrato de negocio.

### 7.8 Reportes

- **HTML Playwright** → vista principal con traces, screenshots y videos embebidos.
- **JUnit** → integración con CI (Jenkins, GitLab, GitHub Actions).
- **list** → salida en consola para ejecución local.

### 7.9 Evidencias automáticas

- `screenshot: only-on-failure`
- `video: retain-on-failure`
- `trace: retain-on-failure`

Las evidencias quedan vinculadas al test que falló dentro del reporte HTML y son navegables desde el trace viewer.

---

## 8. Casos de prueba cubiertos

### 8.1 Autenticación (`@auth`)

| ID | Caso | Severidad | Tags |
| --- | --- | --- | --- |
| LOG-001 | Login exitoso con credenciales válidas | Critical | `@smoke @positive` |
| LOG-002 | Login fallido con credenciales inválidas | Critical | `@negative` |

### 8.2 Búsqueda de libros (`@books`)

| ID | Caso | Severidad | Tags |
| --- | --- | --- | --- |
| BOOK-001 | Búsqueda con palabra clave existente | Critical | `@smoke @positive` |
| BOOK-002 | Búsqueda por título exacto existente | Normal | `@positive` |
| BOOK-003 | Búsqueda "ISTQB Fundamentals" (no existe en catálogo real) | Normal | `@negative` |
| BOOK-004 | Búsqueda con palabra clave inexistente | Normal | `@negative` |

---

## 9. Estudio de factibilidad — New User

El estudio completo está en [`docs/feasibility-new-user.md`](docs/feasibility-new-user.md).

**Resumen del veredicto:**

> **No se recomienda automatizar `New User` vía UI** debido a la presencia de reCAPTCHA v2, dependencias de servicios externos y violación de ToS. Se recomienda cubrirlo por **API** como data setup y **manualmente** como smoke pre-release.

---

## 10. Buenas prácticas aplicadas

- ✅ Page Object Model con `App` como punto de entrada.
- ✅ Fixtures custom para inyección de dependencias.
- ✅ **Cero `sleeps` fijos** — todas las esperas son explícitas por estado.
- ✅ Configuración por ambiente (dev/qa/staging) sin tocar código.
- ✅ Datos sensibles fuera del repo, resueltos desde `.env`.
- ✅ Reporte HTML nativo con steps, tags, traces, screenshots y video.
- ✅ Steps declarativos dentro de cada test para trazabilidad.
- ✅ Escenarios Gherkin como documentación viva.
- ✅ Proyectos por tag para ejecuciones segmentadas.
- ✅ Traces, screenshots y videos automáticos ante fallos.
- ✅ TypeScript estricto con paths aliasing.
- ✅ `.gitignore` cuidado para no filtrar evidencias ni credenciales.

---

## Licencia

MIT © 2026 Karina Montero Leonardo

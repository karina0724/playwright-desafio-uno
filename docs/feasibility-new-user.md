# Estudio de Factibilidad de Automatización — Funcionalidad "New User"

| Propiedad | Valor |
| --- | --- |
| Sistema | demoqa.com — Book Store |
| Funcionalidad | Registro de nuevo usuario (`New User`) |
| Autor | Karina Montero Leonardo |
| Fecha | Octubre 2026 |
| Resultado | **NO se recomienda automatizar en este momento** |

---

## 1. Descripción de la funcionalidad

La funcionalidad `New User` se accede desde la pantalla de login (`https://demoqa.com/login`) mediante el botón **"New User"**, el cual redirige al formulario `https://demoqa.com/register`. Este formulario solicita:

- First Name
- Last Name
- Username
- Password
- Validación anti-bot vía **reCAPTCHA v2 Invisible** de Google (sitekey `6LfupSksAAAAALHNQnHsBoy3J8S7I79ujAhpQJwy`)
- Botón **Register**

Al enviar el formulario, el sistema crea una cuenta nueva en el Book Store y permite autenticarse con las credenciales recién creadas.

> **Nota importante — ¿por qué no se "ve" el captcha?**
> El sitio no utiliza la casilla visible "I'm not a robot": utiliza **reCAPTCHA v2 Invisible**, que corre en segundo plano. Lo único visible es el badge gris fijo en la esquina inferior derecha (`.grecaptcha-badge`). Un usuario humano con buen score (navegador real, cookies, historial, interacción natural) pasa sin ver ningún challenge y por eso aparenta que "no hay captcha". Esto **no significa que no exista** — el token sigue siendo exigido por el backend y es generado por Google a partir de señales del navegador y del comportamiento del usuario. En automatización pasa lo contrario: el score baja al detectarse señales de automation (ver sección 3.1), aparece un challenge visible (imágenes) o el token se devuelve con score bajo y el backend lo rechaza.

---

## 2. Resultado del estudio

**No se recomienda automatizar la funcionalidad `New User` como caso E2E dentro de la suite UI.** Las razones se detallan a continuación.

---

## 3. Justificación

### 3.1 Bloqueador principal: reCAPTCHA v2 Invisible

El formulario incluye un **reCAPTCHA v2 Invisible** de Google, diseñado específicamente como barrera anti-automatización. A diferencia del checkbox clásico, no se "resuelve" con un click: Google calcula un score en segundo plano a partir de señales del navegador (user agent, plugins, canvas/WebGL fingerprint, flag `navigator.webdriver`), cookies de sesión en google.com, historial, movimientos del mouse y timing de las interacciones.

Un navegador manejado por Playwright/Selenium/Cypress produce un score muy bajo (automation flags, sin interacción humana previa, fingerprint distinto). Resultado típico:

- Google escala a un **challenge visible** (imágenes "selecciona todos los semáforos") que no se puede resolver programáticamente.
- O devuelve un token de score bajo que el backend rechaza silenciosamente.

Esto implica que:

- Un flujo totalmente automatizado contra la UI **no puede completar el captcha** sin recurrir a servicios externos de resolución (2captcha, Anti-Captcha), lo cual:
  - Introduce dependencia de un tercero de pago.
  - Añade latencia impredecible (10–40 segundos por intento).
  - Viola los Términos de Servicio de Google reCAPTCHA.
  - No garantiza una tasa de éxito del 100%.
- Deshabilitar el captcha requiere modificar el sitio, lo cual no es posible en `demoqa.com` por ser un sitio público de terceros.
- El hecho de que un humano no vea el challenge no implica que no exista: el token sigue siendo requerido y validado por el backend.

### 3.2 Baja frecuencia funcional

El registro de un nuevo usuario es una acción de **baja frecuencia** y de **flujo lineal simple** (completar formulario → enviar → confirmar). No presenta variabilidad lógica significativa que justifique cobertura automatizada recurrente.

### 3.3 Dependencia de datos únicos

Cada ejecución requeriría un `username` único, forzando a generar datos dinámicos y a mantener un mecanismo de limpieza. En `demoqa.com` **no existe endpoint público documentado para eliminar usuarios**, por lo que la base de datos del entorno acumularía usuarios huérfanos indefinidamente.

### 3.4 Riesgo de bloqueo del ambiente

El reCAPTCHA, ante múltiples intentos fallidos desde una misma IP, puede endurecer el umbral de score o bloquear por completo las solicitudes. Esto podría afectar la ejecución del resto de la suite (login, búsqueda) que corre contra el mismo dominio.

---

## 4. Riesgos identificados

| ID | Riesgo | Impacto | Probabilidad | Mitigación |
| --- | --- | --- | --- | --- |
| R-01 | reCAPTCHA bloquea la ejecución automatizada | Alto | Alta | No automatizar vía UI |
| R-02 | Uso de servicios externos de resolución de captcha viola ToS | Alto | Alta | Prohibido su uso |
| R-03 | Datos huérfanos en el ambiente por falta de endpoint de limpieza | Medio | Alta | Automatizar por API (ver sección 6) |
| R-04 | Bloqueo de IP por intentos repetidos | Alto | Media | Limitar frecuencia, usar API |
| R-05 | Flaky tests por latencia del captcha | Medio | Alta | No depender del captcha |

---

## 5. Dependencias

- **Externas:** Google reCAPTCHA v2 (fuera del control del equipo QA).
- **Técnicas:** No existe UI alternativa de registro sin captcha.
- **Datos:** No existe mecanismo público para eliminar usuarios tras cada ejecución.
- **Ambiente:** `demoqa.com` es un sitio público compartido; cualquier cambio del lado del sitio puede romper la automatización sin aviso.

---

## 6. Estrategia recomendada

En lugar de automatizar `New User` por UI, se recomienda la siguiente estrategia híbrida:

### 6.1 Automatización por API

`demoqa.com` expone la API pública `https://demoqa.com/Account/v1/User` que **no requiere reCAPTCHA** para crear usuarios programáticamente. Esto permite:

- Crear usuarios como **data setup** para los tests de login (`LOG-001`).
- Validar reglas de negocio de creación de usuario (política de contraseñas, usernames duplicados) de forma rápida, determinista y mantenible.
- Eliminar usuarios creados con `DELETE /Account/v1/User/{UUID}` como teardown.

### 6.2 Pruebas manuales exploratorias

El flujo UI de registro se cubre con **pruebas manuales exploratorias periódicas**, enfocadas en:

- Mensajes de validación de campos.
- Experiencia de usuario (UX).
- Comportamiento del botón Register con captcha no resuelto.
- Compatibilidad visual multi-navegador.

### 6.3 Smoke test manual pre-release

Un único caso manual previo a cada release en ambiente de certificación, para validar que el flujo end-to-end sigue funcional.

---

## 7. Conclusión

| Pregunta | Respuesta |
| --- | --- |
| ¿Aplica automatización UI? | **No** |
| ¿Aplica automatización API? | **Sí**, recomendado para precondiciones de otros tests |
| ¿Aplica prueba manual? | **Sí**, de forma exploratoria + smoke pre-release |
| ¿Qué se automatiza en esta suite? | Solo Login y Búsqueda de libros, usando un usuario pre-creado por API o manualmente |

El esfuerzo de forzar la automatización UI de `New User` ante la presencia del reCAPTCHA tiene un **ROI negativo**: alto costo de mantenimiento, baja confiabilidad (flaky), dependencias éticamente cuestionables y nulo valor incremental sobre lo que puede cubrirse con una llamada API o una validación manual.

---
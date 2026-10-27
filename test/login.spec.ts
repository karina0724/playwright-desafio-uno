import { test, expect } from "../fixtures";

test.describe("@auth demoqa.com - Autenticación", () => {
  test.beforeEach(async ({ app }) => {
    await app.login.open();
  });

  test("LOG-001: Login exitoso con credenciales válidas @smoke @positive", async ({
    app,
    data,
  }) => {
    await test.step("Ingresar credenciales válidas y enviar formulario", async () => {
      await app.login.login(data.users.validUser);
    });

    await test.step("Validar redirección al perfil y nombre de usuario", async () => {
      await app.login.assertLoginSuccess();
      const userName = await app.login.getLoggedUserName();
      expect(userName).toBe(data.users.validUser.username);
    });
  });

  test("LOG-002: Login fallido con credenciales inválidas @negative", async ({
    app,
    data,
  }) => {
    await test.step("Ingresar credenciales inválidas y enviar formulario", async () => {
      await app.login.login(data.users.invalidUser);
    });

    await test.step("Validar mensaje de error y permanencia en /login", async () => {
      await app.login.assertInvalidCredentials();
      await app.login.assertUrlContains("/login");
    });
  });
});

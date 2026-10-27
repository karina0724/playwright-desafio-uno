# language: es
@auth @login
Característica: Inicio de sesión en demoqa.com
  Como usuario registrado en el Book Store de demoqa.com
  Quiero autenticarme con mis credenciales
  Para acceder a mi perfil y gestionar mi colección de libros

  Antecedentes:
    Dado que el usuario navega a la página de login

  @smoke @positive
  Escenario: LOG-001 - Login exitoso con credenciales válidas
    Cuando el usuario ingresa un nombre de usuario válido
    Y el usuario ingresa una contraseña válida
    Y el usuario presiona el botón "Login"
    Entonces el sistema redirige a la página de perfil
    Y se muestra el nombre del usuario autenticado

  @negative
  Escenario: LOG-002 - Login fallido con credenciales inválidas
    Cuando el usuario ingresa un nombre de usuario inexistente
    Y el usuario ingresa una contraseña incorrecta
    Y el usuario presiona el botón "Login"
    Entonces el sistema muestra el mensaje "Invalid username or password!"
    Y el usuario permanece en la página de login

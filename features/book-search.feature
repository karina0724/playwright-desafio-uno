# language: es
@books @search
Característica: Búsqueda de libros en el catálogo de demoqa.com
  Como visitante del Book Store de demoqa.com
  Quiero buscar libros por palabra clave
  Para localizar rápidamente títulos específicos del catálogo

  Antecedentes:
    Dado que el usuario navega a la página del catálogo de libros

  @smoke @positive
  Escenario: BOOK-001 - Búsqueda de libro con palabra clave existente
    Cuando el usuario busca por la palabra clave "JavaScript"
    Entonces el sistema muestra al menos un libro cuyo título contiene la palabra clave
    Y los resultados corresponden a libros disponibles en el catálogo

  @positive
  Escenario: BOOK-002 - Búsqueda de libro con título exacto existente
    Cuando el usuario busca por la palabra clave "Git Pocket Guide"
    Entonces el sistema muestra el libro "Git Pocket Guide" en los resultados

  @negative
  Escenario: BOOK-003 - Búsqueda de libro con palabra clave sugerida por enunciado (ISTQB Fundamentals)
    Dado que el libro "ISTQB Fundamentals" no existe en el catálogo real de demoqa.com
    Cuando el usuario busca por la palabra clave "ISTQB Fundamentals"
    Entonces el sistema muestra el mensaje "No rows found"

  @negative
  Escenario: BOOK-004 - Búsqueda de libro con palabra clave inexistente
    Cuando el usuario busca por la palabra clave "xyz-non-existing-book-123"
    Entonces el sistema muestra el mensaje "No rows found"
    Y el estado del catálogo queda vacío

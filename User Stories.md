# Historias de Usuario

A continuación se detallan las Historias de Usuario (HU) de las funcionalidades clave que previamente han sido implementadas en la plataforma, así como las nuevas historias a desarrollar.

## Historias de Usuario Implementadas

### HU-1: Registro e Ingreso Rápido
**Como** estudiante de ingeniería
**Quiero** ingresar mi nombre rápidamente en un formulario de inicio de sesión seguro
**Para** poder acceder a mis evaluaciones de forma personalizada sin necesidad de crear una cuenta compleja.
- **Criterio de Aceptación:** El login requiere un nombre de más de 3 caracteres y realiza una autenticación anónima automática por debajo con Supabase.

### HU-2: Selección y Navegación de Tests (TDD / BDD)
**Como** estudiante
**Quiero** tener un menú superior que me permita elegir entre realizar una evaluación de TDD o de BDD
**Para** poder certificar mi conocimiento en la disciplina específica de mi interés.
- **Criterio de Aceptación:** El usuario autenticado visualiza una botonera desde la que puede iniciar un cuestionario de 5 preguntas, con el contexto y las preguntas adaptadas para TDD o BDD según su selección.

### HU-3: Experiencia de Cuestionario Interactivo (Progreso)
**Como** estudiante
**Quiero** ver una barra indicadora de mi progreso y opciones de selección múltiple fluidas
**Para** saber en qué pregunta estoy (ej. 1 de 5) y qué tipo de examen estoy respondiendo.
- **Criterio de Aceptación:** El test muestra la pregunta actual, avanza auto-mágicamente al clickear la opción deseada y la barra progresa del 20% al 100%. 

### HU-4: Visualización de Calificación Inmediata
**Como** estudiante
**Quiero** que al finalizar la última pregunta se me muestre inmediatamente el resultado porcentual de mi test
**Para** saber instantáneamente cuánto puntaje obtuve en la evaluación.
- **Criterio de Aceptación:** Terminando el cuestionario, el score (#correctas / total_preguntas * 100) se muestra en verde si es ≥ 70% o naranja si es reprobatorio, permitiendo regresar al Dashboard o cerrar sesión.

### HU-5: Dashboard Global de Resultados y Progreso
**Como** ingeniero evaluado (o administrador)
**Quiero** ver todos los intentos históricos de la empresa en un panel ("Dashboard") 
**Para** comparar promedios, observar los estatus (Passed/Review) y tener trazabilidad.
- **Criterio de Aceptación:** El Dashboard lee la base de datos de Supabase desplegando métricas de total de estudiantes y promedio de la clase, además de una tabla sincronizada en tiempo real que refleja las nuevas entregas de exámenes al instante.

---

## Nuevas Historias de Usuario

### HU-6: Inicio de sesión con correo electrónico

**Como** usuario de la aplicación
**Quiero** poder iniciar sesión utilizando mi dirección de correo electrónico en lugar de un nombre de usuario
**Para** poder acceder a mi cuenta de una forma más estándar y fácil de recordar.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Formato de correo electrónico válido (Camino Feliz)**
- **Dado** que el usuario se encuentra en la pantalla de inicio de sesión
- **Cuando** ingresa una dirección de correo electrónico con un formato estructurado correctamente (ej. `nombre@dominio.com`)
- **Y** completa su contraseña y hace clic en "Iniciar Sesión"
- **Entonces** el sistema debe procesar la solicitud de ingreso sin mostrar errores de validación en el campo de correo.

**Criterios de Aceptación 2: Validación de formato de correo electrónico inválido (Camino Alterno)**
- **Dado** que el usuario se encuentra en la pantalla de inicio de sesión
- **Cuando** ingresa un texto en el campo de correo electrónico que no cumple con el formato estándar (ej. le falta el `@`, no tiene un dominio válido como `usuario@.com` o `usuario@dominio`)
- **Y** quita el foco del campo de texto (evento *blur*) o intenta hacer clic en "Iniciar Sesión"
- **Entonces** el sistema debe evitar el envío del formulario
- **Y** debe mostrar un mensaje de error visualmente preventivo indicando: *"Por favor, ingresa un formato de correo electrónico válido (ej. nombre@dominio.com)"*.

**Criterios de Aceptación 3: Campo de correo electrónico obligatorio**
- **Dado** que el usuario se encuentra en la pantalla de inicio de sesión
- **Cuando** deja el campo de correo electrónico completamente vacío
- **Y** hace clic en el botón de "Iniciar Sesión"
- **Entonces** el sistema debe evitar el envío del formulario
- **Y** debe resaltar el campo mostrando un mensaje de error que indique: *"El correo electrónico es un campo obligatorio"*.

---

### HU-7: Perfil de Administrador para Monitoreo de Tests

**Como** coordinador técnico o administrador de la plataforma
**Quiero** ingresar con una cuenta que tenga privilegios de administrador
**Para** poder visualizar un panel general (Dashboard) que muestre todos los estudiantes que han respondido a las evaluaciones en la plataforma a lo largo del tiempo.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Acceso exclusivo al panel general (Camino Feliz)**
- **Dado** que soy un usuario con el rol de `ADMIN` registrado en el sistema
- **Cuando** inicio sesión utilizando mis credenciales (correo electrónico y contraseña)
- **Entonces** el sistema me redirige a un Dashboard global
- **Y** en este Dashboard puedo visualizar una tabla o lista completa de todos los estudiantes, el tipo de test que tomaron, su porcentaje de aciertos y la fecha de la evaluación en tiempo real.

**Criterios de Aceptación 2: Restricción de vista global a estudiantes (Camino Alterno)**
- **Dado** que un participante estándar inicia sesión en la plataforma
- **Cuando** navega a la sección de Dashboard
- **Entonces** debe ver **únicamente** su propio historial de tests realizados
- **Y** no debe tener acceso ni poder visualizar el histórico o los resultados de otros estudiantes en la base de datos.

**Criterios de Aceptación 3: Métricas globales para el Administrador**
- **Dado** que el Administrador se encuentra en el Dashboard global
- **Cuando** visualiza la cabecera del panel
- **Entonces** debe observar tarjetas con las métricas consolidadas (KPIs) de toda la empresa, como: "Total de Tests Completados", "Promedio General de Calificaciones" y el "Estatus de Sincronización".

---

### HU-8: Dashboard Avanzado y Tendencias por Test para Administradores

**Como** administrador o coordinador de evaluaciones
**Quiero** visualizar una sección de tendencias y analíticas detalladas en el Dashboard global
**Para** poder analizar el desempeño específico en cada evaluación (TDD vs BDD), identificar las preguntas más falladas y comprender el nivel de conocimiento general del equipo mediante gráficas.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Gráficas de distribución de puntajes (Tortas/Donas)**
- **Dado** que el usuario administrador se encuentra en el Dashboard global
- **Cuando** la vista carga los resultados de la base de datos
- **Entonces** el sistema debe mostrar una gráfica de porcentajes (ej. gráfico circular o de dona) que indique la proporción de exámenes aprobados (>= 70%) versus exámenes reprobados (< 70%).

**Criterios de Aceptación 2: Tendencias detalladas por tipo de test y pregunta (Barras)**
- **Dado** que el usuario administrador está analizando las métricas
- **Cuando** selecciona o visualiza la sección de desempeño por pregunta
- **Entonces** debe ver un gráfico de barras que desglose el porcentaje de aciertos de cada una de las 5 preguntas.
- **Y** debe existir un mecanismo (ej. pestañas o filtros) para ver estas estadísticas separadas por "Test TDD" y "Test BDD".

**Criterios de Aceptación 3: Acceso denegado a estudiantes**
- **Dado** que un usuario con rol estándar (estudiante) inicia sesión
- **Cuando** accede a su Dashboard personal
- **Entonces** el sistema no debe mostrarle estas analíticas globales de la empresa, limitando su vista a sus métricas individuales o tarjetas básicas.

---

### HU-9: Gestión de Disponibilidad de Evaluaciones (Habilitar/Deshabilitar Tests)

**Como** administrador o coordinador de evaluaciones
**Quiero** poder habilitar o deshabilitar pruebas específicas (ej. Test TDD, Test BDD) desde mi panel
**Para** controlar en qué momentos los desarrolladores y usuarios pueden presentar ciertas evaluaciones, cerrando el acceso cuando no estén en un periodo válido.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Interfaz de Gestión en el Dashboard Admin**
- **Dado** que un usuario administrador se encuentra en su panel
- **Cuando** visualiza las opciones del Dashboard
- **Entonces** debe existir una sección o panel de control donde pueda ver el estado actual de cada evaluación (Activa/Inactiva) y un botón o *switch* para alternar dicho estado.

**Criterios de Aceptación 2: Ocultamiento/Bloqueo para los Estudiantes**
- **Dado** que un test (ej. BDD) ha sido marcado como "Inactivo" por el admin
- **Cuando** un usuario estándar (estudiante) inicia sesión en la plataforma
- **Entonces** la tarjeta o botón para iniciar dicho test debe aparecer deshabilitado o directamente oculto en su vista principal.

**Criterios de Aceptación 3: Persistencia del Estado**
- **Dado** que el administrador cambia el estado de un test
- **Cuando** la acción se confirma
- **Entonces** este nuevo estado debe reflejarse en tiempo real o tras un guardado en la base de datos (Supabase), asegurando que el cambio sea global y afecte la sesión de todos los estudiantes conectados.

---

### HU-10: Encuestas de Satisfacción y Feedback de Sesiones

**Como** organizador de capacitaciones o administrador
**Quiero** que los ingenieros puedan completar encuestas de satisfacción después de sus sesiones o evaluaciones
**Para** recopilar feedback cualitativo sobre la calidad de la sesión teórico-práctica y mejorar futuros entrenamientos.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Acceso a la Encuesta desde el Dashboard**
- **Dado** que un usuario ha iniciado sesión
- **Cuando** visualiza su panel principal o finaliza un test
- **Entonces** debe ver una opción clara para "Responder Encuesta de Satisfacción".

**Criterios de Aceptación 2: Formulario de Encuesta TDD**
- **Dado** que el usuario decide responder la encuesta de la sesión TDD
- **Cuando** se abre el formulario
- **Entonces** debe poder calificar aspectos como: Claridad del expositor, Utilidad del contenido, Calidad de los ejercicios prácticos y dejar un comentario abierto.

**Criterios de Aceptación 3: Almacenamiento y Reporte de Resultados**
- **Dado** que el usuario envía la encuesta
- **Cuando** la transacción es exitosa
- **Entonces** los datos deben guardarse en una tabla independiente en Supabase (`survey_responses`) y el administrador debe poder ver un resumen de estos resultados.

---

### HU-11: Gestión de Disponibilidad de Encuestas

**Como** administrador de la plataforma
**Quiero** poder activar o desactivar encuestas específicas (ej. TDD_SESSION, BDD_SESSION)
**Para** controlar qué formularios de feedback están disponibles para los usuarios en un momento dado.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Control en el Panel de Administración**
- **Dado** que un administrador está en su dashboard
- **Cuando** accede a la sección de control
- **Entonces** debe ver interruptores (toggles) para habilitar o deshabilitar cada encuesta disponible.

**Criterios de Aceptación 2: Filtrado en la Lista de Encuestas para Usuarios**
- **Dado** que una encuesta ha sido desactivada por el administrador
- **Cuando** un usuario accede a la lista de encuestas disponibles
- **Entonces** la encuesta desactivada no debe aparecer en la lista o debe mostrarse como no disponible.

**Criterios de Aceptación 3: Persistencia en Base de Datos**
- **Dado** que se cambia el estado de una encuesta
- **Cuando** se confirma la acción
- **Entonces** el cambio debe guardarse en la tabla `test_config` (o una tabla similar `survey_config`) para que persista globalmente.

---

### HU-12: Dashboard de Analíticas de Satisfacción (Admin)

**Como** responsable de formación o administrador
**Quiero** visualizar gráficos de tendencias y promedios de las encuestas de satisfacción
**Para** medir la calidad de las capacitaciones (TDD/BDD) e identificar áreas de mejora basadas en el feedback de los ingenieros.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Visualización de Promedios por Categoría**
- **Dado** que un administrador está en el módulo de analíticas
- **Cuando** selecciona ver los datos de encuestas
- **Entonces** debe ver promedios (estrellas) para: Contenido, Instructor y Práctica, agrupados por tipo de sesión (TDD/BDD).

**Criterios de Aceptación 2: Gráfico de Tendencias de Satisfacción**
- **Dado** que existen múltiples respuestas a lo largo del tiempo
- **Cuando** se visualiza el dashboard
- **Entonces** debe mostrarse un gráfico (ej. barras o líneas) que compare la satisfacción general entre las diferentes sesiones.

**Criterios de Aceptación 3: Listado de Comentarios Cualitativos**
- **Dado** que los usuarios dejan comentarios abiertos
- **Cuando** el administrador revisa el detalle de una encuesta
- **Entonces** debe poder leer los comentarios más recientes para obtener feedback detallado.
---

### HU-14: Parametrización de Preguntas de Evaluación en Supabase

**Como** administrador de la plataforma
**Quiero** gestionar las preguntas de los tests (TDD y BDD) directamente desde una tabla en Supabase
**Para** poder actualizar, agregar o deshabilitar preguntas sin necesidad de modificar el código fuente de la aplicación.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Carga dinámica de preguntas desde la base de datos (Camino Feliz)**
- **Dado** que un usuario autenticado inicia un test (TDD o BDD)
- **Cuando** la vista del cuestionario carga
- **Entonces** la aplicación debe obtener las preguntas desde la tabla `questions` en Supabase, filtradas por `test_type` (ej. `TDD` o `BDD`) y `is_active = true`
- **Y** las preguntas deben presentarse en el orden definido por su campo `order_index`
- **Y** el comportamiento del cuestionario debe ser idéntico al actual (progreso, selección de opción y guardado de respuestas).

**Criterios de Aceptación 2: Fallback a preguntas por defecto si la BD no responde**
- **Dado** que se produce un error al consultar la tabla `questions` de Supabase (ej. tiempo de espera agotado o política RLS incorrecta)
- **Cuando** el usuario intenta iniciar un test
- **Entonces** la aplicación debe usar el conjunto de preguntas hardcodeadas localmente (`QUESTIONS_TDD` / `QUESTIONS_BDD`) como respaldo
- **Y** debe mostrar un indicador visual o mensaje en consola que señale que se están utilizando preguntas por defecto.

**Criterios de Aceptación 3: Preguntas inactivas no se muestran a los estudiantes**
- **Dado** que el administrador ha marcado el campo `is_active = false` en una o más preguntas de la tabla `questions`
- **Cuando** un estudiante inicia un test
- **Entonces** las preguntas inactivas no deben incluirse en el cuestionario
- **Y** el total de preguntas del progreso (`Pregunta X de N`) debe reflejar únicamente las preguntas activas recuperadas.

**Criterios de Aceptación 4: Estructura de datos completa por pregunta**
- **Dado** que la tabla `questions` contiene filas para el test TDD y BDD
- **Cuando** se consultan las preguntas activas de un test
- **Entonces** cada fila debe exponer: `id`, `test_type`, `order_index`, `question_text`, `options` (arreglo JSONB de 4 textos) y `correct_option_index` (entero 0-3)
- **Y** la columna `options` debe ser un arreglo JSONB para permitir actualizaciones sin cambios de esquema.

---

### HU-13: Modo Oscuro (Dark Mode)

**Como** usuario de la plataforma
**Quiero** poder alternar entre un tema claro y un tema oscuro
**Para** reducir la fatiga visual y personalizar mi experiencia de uso según mis preferencias y el entorno de iluminación.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Botón de alternancia de tema**
- **Dado** que un usuario está navegado en cualquier sección de la aplicación
- **Cuando** hace clic en el ícono de alternancia de tema (Sol/Luna) en la cabecera
- **Entonces** la interfaz debe cambiar instantáneamente entre el esquema de colores claro y oscuro.

**Criterios de Aceptación 2: Persistencia de la preferencia**
- **Dado** que un usuario ha seleccionado el modo oscuro (o claro)
- **Cuando** cierra la pestaña o recarga la página
- **Entonces** el sistema debe recordar la última elección realizada y aplicarla automáticamente al cargar.

**Criterios de Aceptación 3: Adaptación visual de analíticas y dashboards**
- **Dado** que el sistema está en modo oscuro
- **Cuando** el administrador visualiza las gráficas de Recharts y las tablas de resultados
- **Entonces** los colores de fondo, ejes de gráficas y bordes deben ajustarse para mantener la legibilidad y estética premium.

---

### HU-15: Parametrización de Tipos de Evaluación desde Supabase

**Como** administrador de la plataforma
**Quiero** que los tipos de evaluación disponibles (ej. TDD, BDD y futuros) se lean dinámicamente desde la tabla `test_config` en Supabase, incluyendo su nombre de visualización y descripción
**Para** poder agregar o eliminar tipos de test sin necesidad de modificar el código fuente de la aplicación.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Botones de navegación generados dinámicamente (Camino Feliz)**
- **Dado** que un usuario autenticado ha iniciado sesión
- **Cuando** la aplicación carga el Dashboard por primera vez
- **Entonces** los botones del menú de navegación (ej. "Test TDD", "Test BDD") deben generarse dinámicamente leyendo desde `test_config`
- **Y** solo deben aparecer los tipos cuyo campo `is_active = true`
- **Y** el texto del botón debe usar el campo `display_name` de la tabla en lugar de un literal hardcodeado.

**Criterios de Aceptación 2: Estado inicial de testConfig derivado de Supabase**
- **Dado** que la aplicación obtiene la lista de tipos de test desde `test_config`
- **Cuando** se procesan los datos
- **Entonces** el estado interno `testConfig` debe construirse dinámicamente a partir de las filas retornadas (en lugar de inicializarse como `{ TDD: true, BDD: true }`)
- **Y** cualquier tipo nuevo insertado en `test_config` debe reflejarse automáticamente en la UI sin cambios de código.

**Criterios de Aceptación 3: Fallback a tipos por defecto si Supabase no responde**
- **Dado** que ocurre un error al consultar la tabla `test_config`
- **Cuando** el usuario intenta acceder al Dashboard
- **Entonces** la aplicación debe usar los tipos de test por defecto (`TDD` y `BDD` activos) como respaldo
- **Y** debe registrar el error en consola sin bloquear la experiencia del usuario.

**Criterios de Aceptación 4: Schema extendido de test_config**
- **Dado** que la tabla `test_config` actualmente solo tiene `test_id` e `is_active`
- **Cuando** se aplique la migración de HU-15
- **Entonces** la tabla debe contar con los campos adicionales:
  - `display_name` (TEXT): nombre legible para mostrar en botones (ej. `"Test TDD"`)
  - `description` (TEXT): descripción breve del tipo de evaluación (ej. `"Test Driven Development"`)
  - `order_index` (SMALLINT): orden de presentación de los botones en la UI
- **Y** los registros existentes de TDD y BDD deben conservar sus datos previos, actualizados con los nuevos campos.

---

### HU-16: Test de Principios SOLID

**Como** estudiante de ingeniería de software
**Quiero** poder realizar un test de conocimiento sobre los principios SOLID
**Para** validar y certificar mi comprensión de las buenas prácticas de diseño orientado a objetos en el contexto de mi equipo.

> **Nota técnica:** Esta HU es habilitada íntegramente por datos en Supabase. No requiere cambios de código en la aplicación gracias a la parametrización implementada en HU-14 (preguntas dinámicas) y HU-15 (tipos de test dinámicos). La implementación consiste en ejecutar el script `setup_solid_test.sql`.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Disponibilidad del Test SOLID en la navegación (Camino Feliz)**
- **Dado** que el script `setup_solid_test.sql` ha sido ejecutado en Supabase
- **Cuando** un usuario autenticado carga la aplicación
- **Entonces** debe aparecer un nuevo botón **"Test SOLID"** en la barra de navegación, junto a "Test TDD" y "Test BDD"
- **Y** al hacer clic debe iniciarse un cuestionario con las preguntas del test SOLID cargadas desde la tabla `questions`.

**Criterios de Aceptación 2: Contenido de las preguntas SOLID**
- **Dado** que el usuario inicia el Test SOLID
- **Cuando** responde el cuestionario
- **Entonces** debe encontrar 5 preguntas de selección múltiple que evalúen los 5 principios:
  - **S** — Single Responsibility Principle (SRP)
  - **O** — Open/Closed Principle (OCP)
  - **L** — Liskov Substitution Principle (LSP)
  - **I** — Interface Segregation Principle (ISP)
  - **D** — Dependency Inversion Principle (DIP)

**Criterios de Aceptación 3: Calificación y registro del resultado**
- **Dado** que el usuario completa las 5 preguntas del Test SOLID
- **Cuando** confirma su última respuesta
- **Entonces** el sistema debe calcular el puntaje (`correctas / 5 × 100`) y guardarlo en la tabla `results` con `testType = 'SOLID'`
- **Y** el resultado debe aparecer en el Dashboard del usuario y en el panel del administrador con el identificador de tipo "SOLID".

**Criterios de Aceptación 4: Gestión y disponibilidad por el Administrador**
- **Dado** que el test SOLID está registrado en `test_config` con `is_active = true`
- **Cuando** el administrador lo deshabilita (`is_active = false`) desde su panel de control
- **Entonces** el botón "Test SOLID" debe desaparecer o mostrarse como bloqueado para los estudiantes
- **Y** el comportamiento es idéntico al de los tests TDD y BDD (consistencia con HU-9 y HU-15).

---

### HU-17: Panel de Control de Evaluaciones Dinámico para Administradores

**Como** administrador de la plataforma
**Quiero** que el panel de control de evaluaciones en el Dashboard muestre todos los tipos de test configurados en la base de datos (no solo TDD y BDD)
**Para** poder activar o desactivar cualquier evaluación desde una sola interfaz centralizada, y que el cambio se refleje inmediatamente en el menú de navegación de todos los usuarios.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Panel dinámico cargado desde Supabase (Camino Feliz)**
- **Dado** que un administrador accede a su Dashboard
- **Cuando** la sección de "Control de Evaluaciones" carga
- **Entonces** debe mostrar una tarjeta o fila por cada tipo de test registrado en la tabla `test_config` (ej. TDD, BDD, SOLID y cualquier futuro)
- **Y** cada fila debe incluir el `display_name`, la `description` y el estado actual (`is_active`) del test
- **Y** el listado debe estar ordenado por `order_index`.

**Criterios de Aceptación 2: Toggle activa/desactiva el test en tiempo real**
- **Dado** que el administrador ve el panel de control de evaluaciones
- **Cuando** activa o desactiva el interruptor (*toggle*) de un tipo de test
- **Entonces** el sistema debe ejecutar un `UPDATE` en la tabla `test_config` actualizando el campo `is_active` del registro correspondiente
- **Y** el botón del menú de navegación de ese test debe aparecer o desaparecer (bloquearse) en la misma sesión y en la de otros usuarios conectados, gracias al canal Realtime de Supabase ya existente.

**Criterios de Aceptación 3: Indicador visual de estado en el panel**
- **Dado** que el panel muestra la lista de evaluaciones
- **Cuando** un test está `is_active = true`
- **Entonces** su fila debe mostrarse con un indicador verde/activo y texto "Activo"
- **Y** cuando `is_active = false`, el indicador debe ser gris/rojo y mostrar "Inactivo", sin desaparecer del panel del admin.

**Criterios de Aceptación 4: Restricción de acceso a estudiantes**
- **Dado** que un usuario con rol estándar (estudiante) está en su Dashboard
- **Cuando** navega por la interfaz
- **Entonces** no debe visualizar ni tener acceso al panel de control de evaluaciones
- **Y** los tests desactivados simplemente no deben aparecer como opción en su menú de navegación.

---

### HU-18: Filtros de Analítica Dinámicos por Tipo de Evaluación

**Como** administrador o estudiante de la plataforma
**Quiero** que los filtros de la sección de Analíticas muestren dinámicamente todos los tipos de evaluación registrados en la base de datos
**Para** poder analizar el desempeño por cualquier tipo de test (TDD, BDD, SOLID u otros futuros) sin necesidad de cambios en el código.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Filtros generados dinámicamente desde testTypes (Camino Feliz)**
- **Dado** que un usuario accede a la sección de Analíticas en el Dashboard
- **Cuando** la sección carga
- **Entonces** el grupo de botones de filtro debe incluir un botón **"Todos"** (filtro global) más un botón por cada tipo de test presente en `test_config` (leído desde el estado `testTypes`)
- **Y** los botones deben mostrarse en el orden definido por `order_index`
- **Y** el texto de cada botón debe usar el campo `display_name` del test (ej. `"Test TDD"`, `"Test BDD"`, `"Test SOLID"`).

**Criterios de Aceptación 2: Filtrado correcto de resultados históricos**
- **Dado** que el usuario selecciona el botón de un tipo de test específico (ej. "Test SOLID")
- **Cuando** el filtro se aplica
- **Entonces** las gráficas de distribución de puntajes (torta) y de aciertos por pregunta (barras) deben mostrar únicamente los resultados cuyo campo `testType` coincida con el `test_id` seleccionado (ej. `'SOLID'`)
- **Y** al seleccionar "Todos", las gráficas deben incluir los resultados de todos los tipos de test disponibles.

**Criterios de Aceptación 3: Ningún filtro hardcodeado en el código**
- **Dado** que se agrega un nuevo tipo de test a `test_config` en Supabase
- **Cuando** el usuario recarga el Dashboard
- **Entonces** el nuevo tipo debe aparecer automáticamente como opción de filtro en la sección de Analíticas, sin necesidad de modificar el código fuente.

**Criterios de Aceptación 4: Gráfica de barras por pregunta compatible con múltiples tipos**
- **Dado** que el administrador filtra por un tipo de test con preguntas en la tabla `questions`
- **Cuando** se visualiza el gráfico de aciertos por pregunta
- **Entonces** el eje X debe mostrar las etiquetas `P1` a `PN` según el número real de preguntas del tipo seleccionado
- **Y** la comparación de respuestas correctas debe realizarse contra las preguntas del tipo de test activo (leídas desde Supabase), no contra constantes locales hardcodeadas.

---

### HU-19: Analítica Detallada por Pregunta (Estilo Google Forms)

**Como** usuario o administrador de la plataforma
**Quiero** que al seleccionar un tipo de test en la sección de Analíticas, se muestre el desglose estadístico de cada pregunta de forma visual e individual
**Para** identificar con facilidad qué preguntas fueron más difíciles, cuáles opciones se eligieron con mayor frecuencia, y entender el desempeño tanto individual como grupal.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Tarjetas de pregunta con distribución de respuestas — Administrador (Camino Feliz)**
- **Dado** que un administrador selecciona un tipo de test específico en el filtro de Analíticas
- **Cuando** la sección de detalle por pregunta carga
- **Entonces** debe mostrarse una tarjeta por cada pregunta del test, que incluya:
  - El texto completo de la pregunta
  - Una barra de progreso o gráfico de barras horizontal por cada opción de respuesta, mostrando el **porcentaje y conteo de veces** que fue seleccionada por todos los participantes
  - La opción correcta resaltada visualmente (ej. borde verde o ícono de check)
  - El porcentaje global de acierto de esa pregunta (ej. `"72% respondió correctamente"`)

**Criterios de Aceptación 2: Tarjetas de pregunta con respuesta personal — Estudiante**
- **Dado** que un estudiante accede a su sección de Analíticas y selecciona un tipo de test
- **Cuando** ha realizado al menos un intento de dicho test
- **Entonces** debe ver una tarjeta por cada pregunta mostrando:
  - El texto de la pregunta
  - La opción que seleccionó en su último intento (resaltada)
  - Si su respuesta fue correcta o incorrecta (ícono ✓ o ✗)
  - La opción correcta identificada visualmente
- **Y** si el estudiante tiene múltiples intentos, se muestran los datos de su intento más reciente.

**Criterios de Aceptación 3: Solo visible al seleccionar un test específico (no en "Todos")**
- **Dado** que el filtro de Analíticas está en "Todos"
- **Cuando** el usuario visualiza el dashboard
- **Entonces** la sección de detalle por pregunta **no debe mostrarse** (o debe mostrar un mensaje indicando que seleccione un tipo de test específico)
- **Y** al seleccionar un tipo concreto (ej. "Test SOLID"), las tarjetas de pregunta deben aparecer debajo de las gráficas existentes.

**Criterios de Aceptación 4: Preguntas cargadas desde Supabase**
- **Dado** que el sistema consulta el detalle por pregunta
- **Cuando** el usuario selecciona un filtro de test
- **Entonces** los textos de las preguntas y las opciones deben obtenerse desde la tabla `questions` (campo `question_text` y `options`) filtradas por `test_type`
- **Y** los datos de respuestas de los participantes deben leerse desde la tabla `results` (campo `answers`), garantizando que el análisis refleja los datos reales de la base de datos.

---

### HU-20: Gestión de Grupos y Control de Evaluaciones por Grupo

**Como** administrador de la plataforma
**Quiero** poder crear grupos de participantes, asignar usuarios a un grupo, habilitar o deshabilitar tests específicos para cada grupo, y filtrar la analítica por grupo
**Para** segmentar la experiencia de evaluación según cohortes, equipos o sesiones de capacitación diferentes, sin afectar la disponibilidad global de los tests.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Creación y listado de grupos desde el módulo admin (Camino Feliz)**
- **Dado** que el administrador accede a su Dashboard
- **Cuando** navega a la sección **"Grupos"** del panel de administración
- **Entonces** debe ver un listado de todos los grupos existentes con su nombre, descripción y número de miembros
- **Y** debe disponer de un botón **"Nuevo Grupo"** que abra un formulario modal para ingresar nombre y descripción del grupo
- **Y** al confirmar, el grupo debe crearse en la tabla `groups` de Supabase y aparecer inmediatamente en el listado.

**Criterios de Aceptación 2: Control de evaluaciones habilitadas por grupo**
- **Dado** que el administrador selecciona un grupo del listado
- **Cuando** visualiza el detalle del grupo
- **Entonces** debe ver una sección **"Evaluaciones del Grupo"** con un toggle por cada tipo de test registrado en `test_config`
- **Y** el toggle refleja si ese test está habilitado o deshabilitado específicamente para ese grupo (tabla `group_test_config`)
- **Y** al cambiar un toggle, el cambio se persiste en Supabase y solo afecta a los miembros del grupo seleccionado, sin modificar la configuración global de `test_config`.

**Criterios de Aceptación 3: Asignación de usuarios a un grupo**
- **Dado** que el administrador está en el detalle de un grupo
- **Cuando** añade el correo electrónico de un participante al grupo
- **Entonces** el usuario queda asociado al grupo en la tabla `group_members`
- **Y** al iniciar sesión, el sistema detecta el grupo del usuario y aplica la configuración de tests vigente para ese grupo
- **Y** si un usuario no pertenece a ningún grupo, se le aplica la configuración global de `test_config` como respaldo.

**Criterios de Aceptación 4: Filtro de analítica por grupo**
- **Dado** que el administrador está en la sección de Analíticas
- **Cuando** existe al menos un grupo creado
- **Entonces** debe aparecer un selector de grupo (adicional al filtro de tipo de test) que filtre los resultados mostrados a los miembros del grupo seleccionado
- **Y** al seleccionar "Todos los grupos", se muestran los resultados globales sin filtro de grupo.

**Criterios de Aceptación 5: Schema de base de datos requerido**
- **Dado** que se ejecuta el script `setup_groups.sql`
- **Cuando** se aplica la migración
- **Entonces** deben existir las siguientes tablas:
  - `groups` — `group_id` (UUID PK), `name` (TEXT UNIQUE, NOT NULL), `description` (TEXT), `created_at`
  - `group_members` — `id` (UUID PK), `group_id` (FK → groups), `email` (TEXT NOT NULL), `created_at`, UNIQUE(`group_id`, `email`)
  - `group_test_config` — `id` (UUID PK), `group_id` (FK → groups), `test_id` (FK → test_config), `is_active` (BOOLEAN NOT NULL DEFAULT true), UNIQUE(`group_id`, `test_id`)
- **Y** las políticas RLS deben permitir lectura pública y escritura solo a roles autenticados con perfil de administrador.

---

### HU-21: Selección de Grupo y Auto-registro en Login

**Como** participante de la plataforma
**Quiero** poder seleccionar mi grupo desde una lista desplegable al iniciar sesión
**Para** quedar registrado automáticamente en mi cohorte o equipo correspondiente sin intervención manual del administrador.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Selector de grupo en el formulario de login**
- **Dado** que un usuario accede a la pantalla de login
- **Cuando** no es un administrador
- **Entonces** debe visualizar un selector con la lista de todos los grupos activos disponibles en la plataforma (tabla `groups`)
- **Y** el selector es obligatorio para iniciar sesión como estudiante.

**Criterios de Aceptación 2: Auto-registro del miembro en el grupo**
- **Dado** que un estudiante ingresa su nombre, email y selecciona un grupo
- **Cuando** hace clic en "Iniciar Sesión"
- **Entonces** el sistema debe verificar si ya existe una relación en `group_members` para ese email y ese grupo
- **Y** si no existe, debe crear el registro automáticamente antes de redirigir al Dashboard.

**Criterios de Aceptación 3: Exención para administradores**
- **Dado** que un usuario ingresa un email registrado en `admin_users`
- **Cuando** inicia sesión
- **Entonces** el sistema ignora la selección del grupo (o permite iniciar sesión sin seleccionarlo) y le otorga acceso total con rol de administrador.

**Criterios de Aceptación 4: Consistencia de configuración de tests**
- **Dado** que el usuario se auto-registra en un grupo
- **Cuando** accede al Dashboard
- **Entonces** debe visualizar únicamente los tests habilitados para ese grupo (según `group_test_config`) o la configuración global si el grupo no tiene restricciones específicas.
---
 
### HU-22: Descentralización de Controles (Configuración por Grupo)
 
**Como** administrador
**Quiero** gestionar la disponibilidad de evaluaciones y encuestas de forma independiente para cada grupo
**Para** poder personalizar la experiencia de evaluación según las necesidades específicas de cada cohorte.
 
#### Criterios de Aceptación
- **Criterio de Aceptación 1:** Los controles globales de evaluaciones y encuestas se eliminan del Dashboard principal.
- **Criterio de Aceptación 2:** En la vista de detalle de cada grupo, el administrador puede habilitar o deshabilitar cada test y cada encuesta.
- **Criterio de Aceptación 3:** Las configuraciones del grupo tienen precedencia sobre las globales para los estudiantes miembros.
- **Criterio de Aceptación 4:** Los cambios se reflejan en tiempo real vía Supabase Realtime para todos los usuarios conectados.
 
---
 
### HU-23: Unificación de Filtros de Grupo en Dashboard Admin
 
**Como** administrador
**Quiero** tener un único selector de grupo en el dashboard de administrador
**Para** que las gráficas de analítica y la tabla de resultados históricos se filtren simultáneamente bajo el mismo criterio de grupo.
 
#### Criterios de Aceptación
- **Criterio de Aceptación 1:** Existe un único componente de selección de grupo en la parte superior del Dashboard de administrador.
- **Criterio de Aceptación 2:** Al seleccionar un grupo, tanto las gráficas de tendencias/distribución como la tabla de "Resultados Recientes" deben mostrar únicamente los datos de los miembros de dicho grupo.
- **Criterio de Aceptación 3:** Al seleccionar "Todos los grupos", ambas secciones deben mostrar la información consolidada de toda la plataforma.
- **Criterio de Aceptación 4:** El filtro de grupo debe persistir o coordinarse correctamente con el filtro por tipo de test.
 
---
 
### HU-24: Parametrización de Encuestas desde Base de Datos
 
**Como** administrador
**Quiero** que la lista de encuestas disponibles se cargue dinámicamente desde la base de datos
**Para** poder agregar, modificar o deshabilitar formularios de feedback sin necesidad de actualizar el código de la aplicación.
 
#### Criterios de Aceptación
- **Criterio de Aceptación 1:** Se crea la tabla `survey_config` en Supabase con campos para ID, título, descripción y estado activo.
- **Criterio de Aceptación 2:** La aplicación carga las encuestas dinámicamente al inicio y las utiliza en la vista de administración de grupos y en la selección para estudiantes.
- **Criterio de Aceptación 3:** Se mantiene un fallback local en caso de que la conexión a la base de datos falle.
- **Criterio de Aceptación 4:** El administrador puede ver y gestionar estas encuestas en el panel de detalle de cada grupo de forma dinámica.

---

### HU-25: Vista de Resultados Generales de Exámenes con Ponderación

**Como** administrador o coordinador de evaluaciones
**Quiero** visualizar un resumen general consolidado de los resultados de todos los exámenes que han presentado los alumnos, con un porcentaje general ponderado
**Para** evaluar el desempeño global del equipo en todas las evaluaciones y tomar decisiones informadas sobre las capacitaciones.

#### Sub-Historias

##### HU-25a: Cálculo del Porcentaje General Ponderado por Alumno
- El sistema calcula el mejor puntaje de cada alumno por tipo de test.
- El porcentaje general se obtiene promediando los mejores puntajes de los tipos presentados.
- Se identifican exámenes pendientes por alumno.

##### HU-25b: Tarjetas KPI de Resumen Global
- Total de Alumnos Evaluados (únicos).
- Porcentaje General Ponderado del equipo.
- Mejor Evaluación (tipo de test con mayor promedio).
- Mayor Oportunidad (tipo de test con menor promedio).
- Tasa de aprobación (≥ 70%).

##### HU-25c: Tabla Resumen por Alumno con Desglose
- Cada fila muestra un alumno con columnas por tipo de test y porcentaje general.
- Codificación de colores: ≥90% verde intenso, 70-89% verde, 40-69% ámbar, <40% rojo.
- Estatus Aprobado (≥70%) / En revisión (<70%).
- La tabla es ordenable por cualquier columna.

##### HU-25d: Gauge Visual de Porcentaje General de la Cohorte
- Gauge SVG semicircular animado con el porcentaje general del equipo.
- Color y etiqueta adaptados al rango (Excelente/Competente/En desarrollo/Requiere atención).

##### HU-25e: Navegación e Integración con Dashboard
- Tercer tab "Resultados Generales" en la sección de Analíticas (solo admin).
- Los filtros de tipo de test/encuesta se ocultan al seleccionar esta pestaña.
- Compatible con dark mode, responsive, y filtro de grupo.

#### Criterios de Aceptación

**Criterio de Aceptación 1: Acceso al tab de Resultados Generales**
- **Dado** que soy administrador y estoy en el Dashboard
- **Cuando** veo la sección "Analíticas de la Plataforma"
- **Entonces** debo ver tres pestañas: "Evaluaciones", "Encuestas" y "Resultados Generales".

**Criterio de Aceptación 2: KPIs y Gauge correctos**
- **Dado** que existen resultados en la plataforma
- **Cuando** selecciono "Resultados Generales"
- **Entonces** debo ver tarjetas KPI con datos reales, un gauge animado con el promedio general, y conteo de aprobados/en revisión.

**Criterio de Aceptación 3: Tabla con desglose por alumno**
- **Dado** que hay múltiples alumnos con resultados
- **Cuando** visualizo la tabla
- **Entonces** cada fila debe mostrar el mejor puntaje por tipo de test, el porcentaje general ponderado, y el estatus, con colores según rango.

**Criterio de Aceptación 4: Filtro de grupo compatible**
- **Dado** que selecciono un grupo en el filtro superior
- **Cuando** estoy en "Resultados Generales"
- **Entonces** los datos deben reflejar únicamente a los miembros del grupo seleccionado.

**Criterio de Aceptación 5: Restricción a estudiantes**
- **Dado** que soy un usuario con rol estándar (estudiante)
- **Cuando** accedo al Dashboard
- **Entonces** no debo ver la pestaña "Resultados Generales".

---

### HU-26: Resumen de Notas Consolidado para el Estudiante

**Como** estudiante de la plataforma
**Quiero** ver un resumen visual consolidado de mis notas en todos los exámenes que he presentado, incluyendo mi porcentaje general ponderado
**Para** tener una visión clara de mi desempeño integral, identificar mis fortalezas y las áreas donde necesito reforzar conocimientos.

#### Criterios de Aceptación

**Criterio de Aceptación 1: Tarjeta de Resumen General visible en el Dashboard del estudiante**
- **Dado** que soy un estudiante que ha presentado al menos un examen
- **Cuando** accedo a mi Dashboard
- **Entonces** debo ver una sección prominente de "Mi Resumen de Notas" que incluya:
  - Un indicador visual (gauge) con mi porcentaje general ponderado
  - El estatus global (✅ Aprobado si ≥ 70% / ⚠️ En revisión si < 70%)
  - Mi cantidad de exámenes completados vs. disponibles

**Criterio de Aceptación 2: Desglose por tipo de evaluación**
- **Dado** que he presentado múltiples tipos de examen
- **Cuando** visualizo mi resumen
- **Entonces** debo ver una tarjeta por cada tipo de evaluación con:
  - El nombre de la evaluación
  - Mi mejor puntaje obtenido
  - Número de intentos realizados
  - Indicador visual de progreso (barra de color según rango)
- **Y** los tipos de examen que no he presentado deben mostrarse como "Pendiente".

**Criterio de Aceptación 3: Cálculo del porcentaje ponderado**
- **Dado** que he presentado exámenes de distintos tipos
- **Cuando** se calcula mi porcentaje general
- **Entonces** debe usarse el mejor puntaje de cada tipo de examen presentado
- **Y** el porcentaje general debe ser el promedio equitativo de los mejores puntajes.

**Criterio de Aceptación 4: Mensajes para estudiantes sin exámenes**
- **Dado** que soy un estudiante que aún no ha presentado ningún examen
- **Cuando** accedo a mi Dashboard
- **Entonces** debo ver un mensaje motivacional indicando que aún no tengo resultados, con un botón para comenzar mi primera evaluación.

**Criterio de Aceptación 5: Compatibilidad visual**
- La sección debe ser compatible con dark mode, responsive, y mantener el sistema de diseño existente.


---

### HU-27: Parametrización de Puntaje por Defecto para Exámenes Pendientes

**Como** administrador de la plataforma
**Quiero** asignar un puntaje por defecto a los exámenes que los estudiantes aún no han presentado y que este valor sea parametrizable por tipo de test
**Para** que el promedio general ponderado refleje una penalización o un valor base para las evaluaciones pendientes, incentivando la completitud de las mismas.

#### Criterios de Aceptación

**Criterios de Aceptación 1: Parametrización por tipo de examen**
- **Dado** que el administrador está en el panel de control de evaluaciones
- **Cuando** visualiza la lista de tests (TDD, BDD, SOLID, etc.)
- **Entonces** debe poder ingresar un valor numérico (0-100) como "Puntaje por Defecto" para cada uno
- **Y** este valor debe persistir en la tabla `test_config`.

**Criterios de Aceptación 2: Inclusión de exámenes pendientes en el promedio (Admin)**
- **Dado** que un estudiante tiene exámenes marcados como "Pendientes" (no intentados)
- **Cuando** el administrador visualiza el Dashboard de Resultados Generales
- **Entonces** el sistema debe calcular el `% General` promediando todos los tests activos
- **Y** para los tests pendientes debe usar el valor configurado en el criterio 1 en lugar de ignorar la evaluación.

**Criterios de Aceptación 3: Visualización del promedio proyectado (Estudiante)**
- **Dado** que un estudiante tiene evaluaciones sin realizar
- **Cuando** accede a su "Resumen de Notas"
- **Entonces** su indicador de progreso y porcentaje general deben reflejar la influencia de los tests pendientes con su puntaje por defecto.

**Criterios de Aceptación 4: Indicador visual de puntaje por defecto**
- **Dado** que un puntaje en la tabla de resultados proviene de un test no presentado
- **Cuando** se visualiza la tabla de detalles
- **Entonces** el sistema debe mostrar un indicador claro (ej. etiqueta "Default" o color distintivo) para diferenciarlo de un resultado obtenido mediante un examen realizado.

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

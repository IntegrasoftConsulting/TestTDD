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

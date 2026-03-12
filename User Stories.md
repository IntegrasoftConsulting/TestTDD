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

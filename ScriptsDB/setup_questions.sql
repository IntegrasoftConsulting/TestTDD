-- ============================================================
-- HU-14: Parametrización de Preguntas de Evaluación en Supabase
-- Tabla: questions
-- Descripción: Almacena las preguntas de los tests TDD y BDD
--              con sus opciones (JSONB) e índice de respuesta correcta.
--              Reemplaza los arreglos hardcodeados en App.jsx.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.questions (
    id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
    test_type     TEXT          NOT NULL CHECK (test_type IN ('TDD', 'BDD')),
    order_index   SMALLINT      NOT NULL,                   -- Determina el orden de presentación
    question_text TEXT          NOT NULL,
    options       JSONB         NOT NULL,                   -- Arreglo JSON de 4 strings ["opA","opB","opC","opD"]
    correct_option_index SMALLINT NOT NULL CHECK (correct_option_index BETWEEN 0 AND 3),
    is_active     BOOLEAN       NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ   DEFAULT now(),
    updated_at    TIMESTAMPTZ   DEFAULT now(),
    UNIQUE (test_type, order_index)                         -- Evita duplicar el índice de orden por tipo de test
);

-- ---------------------------------------------------------------
-- Datos iniciales: Preguntas TDD (migradas desde App.jsx)
-- ---------------------------------------------------------------
INSERT INTO public.questions (test_type, order_index, question_text, options, correct_option_index, is_active) VALUES
(
    'TDD', 1,
    '¿Cuál es el propósito fundamental del paso ''Red'' en el ciclo TDD?',
    '["Identificar errores de sintaxis en código antiguo.",
      "Definir el comportamiento esperado mediante una prueba que falle.",
      "Optimizar el rendimiento del servidor.",
      "Asegurar que el entorno de CI/CD funcione."]',
    1, true
),
(
    'TDD', 2,
    'En TDD, ¿qué se debe hacer inmediatamente después de que una prueba pase (Green)?',
    '["Escribir la siguiente prueba fallida.",
      "Pasar a producción el código.",
      "Refactorizar el código para mejorar su estructura.",
      "Eliminar la prueba para ahorrar espacio."]',
    2, true
),
(
    'TDD', 3,
    '¿Cuál es la característica principal de una Prueba Unitaria efectiva?',
    '["Debe probar la integración con la base de datos real.",
      "Debe ser rápida, aislada y probar una única unidad lógica.",
      "Debe ser escrita únicamente por el equipo de QA.",
      "Debe ejecutarse solo una vez al mes."]',
    1, true
),
(
    'TDD', 4,
    '¿Qué indica una ''Cobertura de Código'' (Code Coverage) del 100%?',
    '["Que el código no tiene absolutamente ningún bug.",
      "Que todas las líneas de código han sido ejecutadas al menos una vez por las pruebas.",
      "Que el rendimiento del software es óptimo.",
      "Que ya no es necesario realizar pruebas de integración."]',
    1, true
),
(
    'TDD', 5,
    'Al usar IA en TDD, ¿cuál es el flujo recomendado?',
    '["Que la IA escriba todo el proyecto sin revisión.",
      "Escribir la prueba manualmente y pedir a la IA la implementación.",
      "Generar el código y luego pedirle a la IA que invente las pruebas.",
      "No usar IA bajo ninguna circunstancia."]',
    1, true
);

-- ---------------------------------------------------------------
-- Datos iniciales: Preguntas BDD (migradas desde App.jsx)
-- ---------------------------------------------------------------
INSERT INTO public.questions (test_type, order_index, question_text, options, correct_option_index, is_active) VALUES
(
    'BDD', 1,
    '¿Qué significan las siglas BDD en el desarrollo de software?',
    '["Bug-Driven Development",
      "Behavior-Driven Development",
      "Backend-Driven Design",
      "Basic Data Deployment"]',
    1, true
),
(
    'BDD', 2,
    '¿Cuál es el propósito principal del formato Given-When-Then?',
    '["Crear esquemas de bases de datos relacionales.",
      "Describir el comportamiento de un sistema de forma comprensible para negocio y desarrollo.",
      "Optimizar la velocidad de ejecución de las pruebas unitarias.",
      "Definir la arquitectura de microservicios resolviendo dependencias."]',
    1, true
),
(
    'BDD', 3,
    'En Gherkin, ¿para qué sirve la palabra clave ''Given'' (Dado)?',
    '["Para describir la acción que realiza el usuario.",
      "Para definir el resultado que se espera tras la acción.",
      "Para establecer el estado inicial o contexto antes de la acción.",
      "Para conectar múltiples validaciones en una aserción condicional."]',
    2, true
),
(
    'BDD', 4,
    '¿Qué relación existe entre TDD y BDD?',
    '["BDD y TDD son excluyentes; usar uno prohíbe el uso del otro.",
      "BDD es una evolución del TDD enfocada en el comportamiento y comunicación del sistema.",
      "TDD es para front-end y BDD es estrictamente para back-end.",
      "Ninguna, fueron creadas para propósitos completamente separados."]',
    1, true
),
(
    'BDD', 5,
    '¿Cuál de estas herramientas es comúnmente utilizada para implementar pruebas BDD?',
    '["Postman",
      "Sublime Text",
      "Docker",
      "Cucumber"]',
    3, true
);

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Política de lectura: Cualquier usuario autenticado puede leer
-- las preguntas activas (los estudiantes las necesitan para el quiz).
CREATE POLICY "Permitir lectura publica de preguntas activas"
ON public.questions
FOR SELECT
USING (true);

-- Política de escritura: Solo administradores pueden insertar/actualizar/eliminar.
-- La validación de admin se realiza en el frontend antes de llamar a Supabase,
-- tal como se hace con test_config (enfoque consistente con el resto del proyecto).
CREATE POLICY "Permitir modificacion a usuarios autenticados"
ON public.questions
FOR ALL
USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------
-- Función auxiliar: actualiza updated_at en cada modificación
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

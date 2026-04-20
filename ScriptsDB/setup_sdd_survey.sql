-- ============================================================
-- HU-30: Evaluación de Spec Driven Development (SDD)
-- HU-31: Nueva Encuesta de Spec Driven Development (SDD)
-- Script: setup_sdd_survey.sql
-- Descripción: Registra el tipo de test "SDD" en test_config,
--              sus 5 preguntas en la tabla questions y la encuesta
--              "SDD_SESSION" en survey_config.
-- ============================================================

-- 0. Eliminar el constraint rígido de test_type si aún existe
ALTER TABLE public.questions
    DROP CONSTRAINT IF EXISTS questions_test_type_check;

-- ---------------------------------------------------------------
-- 1. Registrar el nuevo tipo de test (HU-30)
-- ---------------------------------------------------------------
INSERT INTO public.test_config (test_id, display_name, description, order_index, is_active, default_score)
VALUES (
    'SDD',
    'Test SDD',
    'Spec Driven Development con foco en AI Driven Development: Spec First, Prompt Engineering, Agentic Workflows y Validación de outputs de IA.',
    5, -- Después de TDD (1), BDD (2), SOLID (3), DDD (4)
    true,
    0
)
ON CONFLICT (test_id) DO UPDATE
    SET display_name  = EXCLUDED.display_name,
        description   = EXCLUDED.description,
        order_index   = EXCLUDED.order_index,
        is_active     = EXCLUDED.is_active;

-- ---------------------------------------------------------------
-- 2. Insertar las 5 preguntas SDD (HU-30)
-- ---------------------------------------------------------------
INSERT INTO public.questions
    (test_type, order_index, question_text, options, correct_option_index, is_active)
VALUES

-- P1: Spec First
(
    'SDD', 1,
    '¿Cuál es el principio fundamental del enfoque "Spec First" en Spec Driven Development?',
    '["Escribir el código de producción lo más rápido posible antes de documentarlo.",
      "Definir una especificación formal del comportamiento esperado antes de escribir cualquier línea de código o prompt de IA.",
      "Generar la especificación automáticamente a partir del código existente con herramientas de IA.",
      "Utilizar diagramas UML como único contrato entre el equipo de negocios y el equipo técnico."]',
    1, true
),

-- P2: Prompt Engineering
(
    'SDD', 2,
    'En el contexto de AI Driven Development, ¿qué caracteriza a un prompt bien estructurado a partir de una especificación formal?',
    '["Es lo más corto posible para no consumir tokens innecesarios del modelo.",
      "Incluye el contexto del dominio, el comportamiento esperado (Given/When/Then) y las restricciones de la solución para guiar al modelo de IA hacia un output predecible.",
      "Contiene únicamente el nombre de la función que se desea generar.",
      "Se escribe en lenguaje natural libre, sin estructura, para maximizar la creatividad del modelo."]',
    1, true
),

-- P3: AI-Augmented TDD
(
    'SDD', 3,
    '¿Cómo integra el "AI-Augmented TDD" el ciclo Red-Green-Refactor con las herramientas de inteligencia artificial?',
    '["El modelo de IA reemplaza completamente al desarrollador en el ciclo TDD, eliminando la necesidad de revisión humana.",
      "El desarrollador escribe primero el test que falla (Red), luego usa la IA para generar el código mínimo que lo haga pasar (Green) y finalmente refactoriza validando que los tests sigan en verde.",
      "La IA genera los tests y el código simultáneamente, omitiendo la fase de refactorización.",
      "El ciclo Red-Green-Refactor es incompatible con herramientas de IA generativa."]',
    1, true
),

-- P4: Agentic Workflows
(
    'SDD', 4,
    '¿Qué caracteriza a un flujo de trabajo multi-agente (Agentic Workflow) en el desarrollo de software asistido por IA?',
    '["Un único agente de IA que reemplaza a todo el equipo de desarrollo.",
      "La orquestación de múltiples agentes especializados (ej. PO, Arquitecto, Desarrollador) que colaboran de forma secuencial o paralela, cada uno consumiendo y produciendo especificaciones formales como artefactos de comunicación.",
      "Un pipeline de CI/CD que ejecuta las pruebas automáticamente al hacer push al repositorio.",
      "El uso de múltiples modelos de lenguaje simultáneamente para generar código duplicado y elegir el mejor resultado."]',
    1, true
),

-- P5: Validación de Outputs de IA
(
    'SDD', 5,
    '¿Cuál es la estrategia más efectiva para validar que el código generado por una IA cumple con la especificación original?',
    '["Confiar en la respuesta del modelo de IA ya que los LLMs modernos no producen errores lógicos.",
      "Ejecutar manualmente el código generado una sola vez y aprobarlo si no lanza excepciones.",
      "Verificar el output de la IA contra la suite de tests definida desde la especificación (Spec First), asegurando que todos los escenarios Given/When/Then pasen antes de aceptar el código generado.",
      "Pedir al modelo que auto-evalúe su propio output sin intervención humana."]',
    2, true
);

-- ---------------------------------------------------------------
-- 3. Registrar la encuesta de la sesión SDD (HU-31)
-- ---------------------------------------------------------------
INSERT INTO public.survey_config (survey_id, is_active)
VALUES ('SDD_SESSION', true)
ON CONFLICT (survey_id) DO UPDATE SET
    is_active = EXCLUDED.is_active;

-- ---------------------------------------------------------------
-- Verificación: resultados esperados
-- SELECT * FROM public.test_config WHERE test_id = 'SDD';
-- SELECT * FROM public.questions WHERE test_type = 'SDD' ORDER BY order_index;
-- SELECT * FROM public.survey_config WHERE survey_id = 'SDD_SESSION';
-- ---------------------------------------------------------------

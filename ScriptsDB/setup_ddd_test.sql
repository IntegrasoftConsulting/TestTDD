-- ============================================================
-- HU-28: Evaluación de Domain Driven Design (DDD)
-- Script: setup_ddd_test.sql
-- Descripción: Agrega el tipo de test "DDD" a test_config y
--              sus 5 preguntas iniciales a la tabla questions.
-- ============================================================

-- 0. Eliminar el constraint rígido de test_type si aún existe
ALTER TABLE public.questions
    DROP CONSTRAINT IF EXISTS questions_test_type_check;

-- 1. Registrar el nuevo tipo de test
INSERT INTO public.test_config (test_id, display_name, description, order_index, is_active, default_score)
VALUES (
    'DDD',
    'Test DDD',
    'Domain Driven Design: Bounded Contexts, Ubiquitous Language, Aggregates, Entities y Value Objects',
    4, -- Después de TDD (1), BDD (2), SOLID (3)
    true,
    0
)
ON CONFLICT (test_id) DO UPDATE
    SET display_name  = EXCLUDED.display_name,
        description   = EXCLUDED.description,
        order_index   = EXCLUDED.order_index,
        is_active     = EXCLUDED.is_active;

-- ---------------------------------------------------------------
-- 2. Insertar las 5 preguntas DDD
-- ---------------------------------------------------------------
INSERT INTO public.questions
    (test_type, order_index, question_text, options, correct_option_index, is_active)
VALUES
-- P1: Objetivo Principal
(
    'DDD', 1,
    '¿Cuál es el objetivo principal del Domain Driven Design (DDD)?',
    '["Modelar software complejo alineando el diseño técnico con el modelo de negocio o dominio.",
      "Optimizar la velocidad de las consultas SQL mediante el particionamiento de tablas.",
      "Asegurar que todas las clases del sistema tengan menos de 100 líneas de código.",
      "Facilitar la migración de aplicaciones monolíticas a sistemas de microservicios sin cambios de dominio."]',
    0, true
),
-- P2: Bounded Context
(
    'DDD', 2,
    'En DDD, ¿qué representa un ''Bounded Context'' (Contexto Delimitado)?',
    '["Un servidor físico donde se despliega una parte del sistema.",
      "Un límite explícito dentro del cual un modelo de dominio tiene un significado y reglas específicas.",
      "El historial de commits del repositorio de código.",
      "Una restricción de base de datos que impide la inserción de datos duplicados."]',
    1, true
),
-- P3: Entity vs Value Object
(
    'DDD', 3,
    '¿Cuál es la diferencia fundamental entre una Entidad y un Value Object?',
    '["Las Entidades se guardan en base de datos y los Value Objects no.",
      "Las Entidades tienen una identidad única que persiste en el tiempo, mientras que los Value Objects se definen solo por sus atributos.",
      "Los Value Objects siempre son clases abstractas y las Entidades son finales.",
      "No hay diferencia; ambos términos son sinónimos en el modelado táctico."]',
    1, true
),
-- P4: Aggregates
(
    'DDD', 4,
    '¿Qué patrón de DDD se utiliza para asegurar la consistencia y tratar un grupo de objetos relacionados como una unidad de persistencia?',
    '["Singleton",
      "Factory Method",
      "Aggregate (Agregado)",
      "Observer Pattern"]',
    2, true
),
-- P5: Ubiquitous Language
(
    'DDD', 5,
    '¿Qué es el ''Ubiquitous Language'' (Lenguaje Ubicuo)?',
    '["Un lenguaje de programación universal para frontend y backend.",
      "Un lenguaje común compartido entre expertos del dominio y desarrolladores para eliminar ambigüedades.",
      "La documentación técnica generada automáticamente a partir del código.",
      "Un estándar de traducción para aplicaciones multinacionales."]',
    1, true
);

-- ---------------------------------------------------------------
-- Verificación: resultado esperado
-- SELECT * FROM public.test_config WHERE test_id = 'DDD';
-- SELECT * FROM public.questions WHERE test_type = 'DDD' ORDER BY order_index;
-- ---------------------------------------------------------------

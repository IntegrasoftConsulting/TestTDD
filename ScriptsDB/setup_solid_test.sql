-- ============================================================
-- HU-16: Test de Principios SOLID
-- Script: setup_solid_test.sql
-- Descripción: Agrega el tipo de test "SOLID" a test_config y
--              sus 5 preguntas (una por principio) a la tabla
--              questions. No requiere ningún cambio de código
--              gracias a HU-14 y HU-15.
-- Prerequisitos: Haber ejecutado antes:
--   - setup_test_config.sql
--   - migrate_test_config_HU15.sql
--   - setup_questions.sql
-- ============================================================

-- 0. Eliminar el constraint rígido de test_type si aún existe
--    (fue agregado en setup_questions.sql antes de HU-16)
ALTER TABLE public.questions
    DROP CONSTRAINT IF EXISTS questions_test_type_check;

-- 1. Registrar el nuevo tipo de test
INSERT INTO public.test_config (test_id, display_name, description, order_index, is_active)
VALUES (
    'SOLID',
    'Test SOLID',
    'Principios de diseño orientado a objetos: SRP, OCP, LSP, ISP, DIP',
    3,
    true
)
ON CONFLICT (test_id) DO UPDATE
    SET display_name  = EXCLUDED.display_name,
        description   = EXCLUDED.description,
        order_index   = EXCLUDED.order_index,
        is_active     = EXCLUDED.is_active;

-- ---------------------------------------------------------------
-- 2. Insertar las 5 preguntas SOLID (una por principio)
-- ---------------------------------------------------------------
INSERT INTO public.questions
    (test_type, order_index, question_text, options, correct_option_index, is_active)
VALUES
-- P1: S — Single Responsibility Principle
(
    'SOLID', 1,
    '¿Qué establece el Principio de Responsabilidad Única (SRP)?',
    '["Una clase puede tener múltiples responsabilidades si están relacionadas.",
      "Una clase debe tener una, y sólo una, razón para cambiar.",
      "Cada método de una clase debe realizar una sola operación aritmética.",
      "Una clase no puede depender de ninguna otra clase del sistema."]',
    1, true
),
-- P2: O — Open/Closed Principle
(
    'SOLID', 2,
    '¿Cómo define el Principio Abierto/Cerrado (OCP) el código bien diseñado?',
    '["El código debe estar abierto a la modificación directa de su lógica interna.",
      "Las entidades de software deben estar cerradas para su uso externo por defecto.",
      "Las entidades deben estar abiertas para su extensión, pero cerradas para su modificación.",
      "El código abierto no necesita cerrarse una vez desplegado en producción."]',
    2, true
),
-- P3: L — Liskov Substitution Principle
(
    'SOLID', 3,
    '¿Qué garantiza el Principio de Sustitución de Liskov (LSP)?',
    '["Que los objetos de una superclase pueden ser reemplazados por objetos de sus subclases sin alterar el comportamiento correcto del programa.",
      "Que una clase hija siempre tiene más métodos que su clase padre.",
      "Que las interfaces sólo pueden ser implementadas por una clase a la vez.",
      "Que cada módulo del sistema puede sustituir a cualquier otro módulo independientemente de su tipo."]',
    0, true
),
-- P4: I — Interface Segregation Principle
(
    'SOLID', 4,
    '¿Cuál es el objetivo del Principio de Segregación de Interfaces (ISP)?',
    '["Combinar varias interfaces pequeñas en una sola interfaz general para simplificar el código.",
      "Obligar a los clientes a depender de interfaces con todos los métodos disponibles.",
      "Evitar que los clientes dependan de métodos que no utilizan, creando interfaces específicas y cohesivas.",
      "Asegurarse de que cada interfaz tenga al menos diez métodos definidos."]',
    2, true
),
-- P5: D — Dependency Inversion Principle
(
    'SOLID', 5,
    '¿Qué indica el Principio de Inversión de Dependencias (DIP)?',
    '["Los módulos de alto nivel deben depender directamente de los módulos de bajo nivel para mayor eficiencia.",
      "Los módulos de alto y bajo nivel deben depender de abstracciones, no de implementaciones concretas.",
      "Las dependencias entre módulos deben invertirse eliminando todas las interfaces del sistema.",
      "Cada módulo debe implementar sus propias dependencias para evitar el acoplamiento."]',
    1, true
);

-- ---------------------------------------------------------------
-- Verificación: resultado esperado
-- SELECT * FROM public.test_config WHERE test_id = 'SOLID';
-- SELECT * FROM public.questions WHERE test_type = 'SOLID' ORDER BY order_index;
-- ---------------------------------------------------------------

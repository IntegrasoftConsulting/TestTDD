-- ============================================================
-- HU-15: Parametrización de Tipos de Evaluación desde Supabase
-- Migración: Extiende test_config con campos de presentación UI
-- ============================================================
-- IMPORTANTE: Ejecutar DESPUÉS de setup_test_config.sql
-- Si la tabla ya existe en producción, usar solo los ALTER TABLE.
-- ============================================================

-- 1. Agregar columnas de presentación a test_config
ALTER TABLE public.test_config
    ADD COLUMN IF NOT EXISTS display_name  TEXT    NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS description   TEXT    NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS order_index   SMALLINT NOT NULL DEFAULT 99;

-- 2. Poblar los valores para los registros existentes
UPDATE public.test_config
SET
    display_name  = 'Test TDD',
    description   = 'Test Driven Development',
    order_index   = 1
WHERE test_id = 'TDD';

UPDATE public.test_config
SET
    display_name  = 'Test BDD',
    description   = 'Behavior Driven Development',
    order_index   = 2
WHERE test_id = 'BDD';

-- 3. Quitar los defaults temporales (los campos ya fueron poblados)
ALTER TABLE public.test_config
    ALTER COLUMN display_name DROP DEFAULT,
    ALTER COLUMN description   DROP DEFAULT,
    ALTER COLUMN order_index   DROP DEFAULT;

-- ---------------------------------------------------------------
-- Política de INSERT: permite al admin agregar nuevos tipos desde la UI
-- (Consistente con la política de UPDATE ya existente)
-- ---------------------------------------------------------------
CREATE POLICY "Permitir insercion a usuarios autenticados"
ON public.test_config
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- ---------------------------------------------------------------
-- Verificación: resultado esperado tras la migración
-- test_id | display_name | description                 | order_index | is_active
-- TDD     | Test TDD     | Test Driven Development     | 1           | true
-- BDD     | Test BDD     | Behavior Driven Development | 2           | true
-- ---------------------------------------------------------------
-- SELECT test_id, display_name, description, order_index, is_active
-- FROM public.test_config
-- ORDER BY order_index;

-- HU-27: Parametrización de Puntaje por Defecto para Exámenes Pendientes
-- Agregar columna default_score a test_config

-- 1. Agregar la columna si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_config' AND column_name='default_score') THEN
        ALTER TABLE public.test_config ADD COLUMN default_score NUMERIC DEFAULT 0;
    END IF;
END $$;

-- 2. Asegurar que los registros actuales tengan un valor base (0 por defecto, pero explícito)
UPDATE public.test_config SET default_score = 0 WHERE default_score IS NULL;

-- 3. Comentario descriptivo
COMMENT ON COLUMN public.test_config.default_score IS 'Puntaje que se asigna automáticamente a un estudiante para el cálculo del promedio si no ha presentado este test.';

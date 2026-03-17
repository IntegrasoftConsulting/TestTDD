-- setup_survey_config.sql
-- HU-24: Parametrización de Encuestas desde Base de Datos (Ajustado v1.8.2)

-- 1. Asegurar la existencia de la tabla con el esquema base
CREATE TABLE IF NOT EXISTS public.survey_config (
    survey_id TEXT PRIMARY KEY,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Migración reactiva para tablas pre-existentes
DO $$ 
BEGIN 
    -- Renombrar id a survey_id si existe la versión vieja
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='survey_config' AND column_name='id') THEN
        ALTER TABLE public.survey_config RENAME COLUMN id TO survey_id;
    END IF;

    -- Eliminar columnas obsoletas para prevenir Error 400 en la App
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='survey_config' AND column_name='title') THEN
        ALTER TABLE public.survey_config DROP COLUMN title;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='survey_config' AND column_name='description') THEN
        ALTER TABLE public.survey_config DROP COLUMN description;
    END IF;
END $$;

-- 3. Configuración de Seguridad
ALTER TABLE public.survey_config ENABLE ROW LEVEL SECURITY;

-- Re-crear políticas de forma limpia
DROP POLICY IF EXISTS "Permitir lectura para todos" ON public.survey_config;
CREATE POLICY "Permitir lectura para todos" ON public.survey_config
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Solo admins pueden modificar encuestas" ON public.survey_config;
CREATE POLICY "Solo admins pueden modificar encuestas" ON public.survey_config
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
    );

-- 4. Datos iniciales e Integridad
INSERT INTO public.survey_config (survey_id, is_active)
VALUES 
    ('TDD_SESSION', true),
    ('BDD_SESSION', true),
    ('SOLID_SESSION', true)
ON CONFLICT (survey_id) DO UPDATE SET
    is_active = EXCLUDED.is_active;

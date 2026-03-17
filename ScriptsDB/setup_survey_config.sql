-- setup_survey_config.sql
-- HU-24: Parametrización de Encuestas desde Base de Datos

CREATE TABLE IF NOT EXISTS public.survey_config (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.survey_config ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Permitir lectura para todos" ON public.survey_config
    FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar encuestas" ON public.survey_config
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
    );

-- Datos iniciales
INSERT INTO public.survey_config (id, title, description)
VALUES 
    ('TDD_SESSION', 'Sesión TDD', 'Evaluación de la capacitación teórico-práctica de Test Driven Development.'),
    ('BDD_SESSION', 'Sesión BDD', 'Evaluación de la capacitación teórico-práctica de Behavior Driven Development.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description;

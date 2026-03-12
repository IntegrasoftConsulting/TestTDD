-- Tabla para controlar la disponibilidad de las encuestas
CREATE TABLE IF NOT EXISTS public.survey_config (
    survey_id TEXT PRIMARY KEY, -- p.ej. 'TDD_SESSION', 'BDD_SESSION'
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insertar configuraciones iniciales
INSERT INTO public.survey_config (survey_id, is_active)
VALUES 
    ('TDD_SESSION', true),
    ('BDD_SESSION', true)
ON CONFLICT (survey_id) DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.survey_config ENABLE ROW LEVEL SECURITY;

-- Política: Todos los usuarios pueden leer la configuración
CREATE POLICY "Permitir lectura a todos" 
ON public.survey_config FOR SELECT 
USING (true);

-- Política: Los usuarios autenticados pueden actualizar (simplificado para admin como en test_config)
CREATE POLICY "Permitir actualizacion a usuarios autenticados" 
ON public.survey_config FOR UPDATE 
WITH CHECK (auth.role() = 'authenticated');

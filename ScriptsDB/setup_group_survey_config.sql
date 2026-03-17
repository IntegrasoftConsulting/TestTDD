-- ============================================================
-- HU-22: Control de Encuestas por Grupo
-- Script: setup_group_survey_config.sql
-- Descripción: Crea la tabla group_survey_config para permitir
--              habilitar/deshabilitar encuestas por grupo.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.group_survey_config (
    id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id    UUID    NOT NULL REFERENCES public.groups(group_id) ON DELETE CASCADE,
    survey_id   TEXT    NOT NULL REFERENCES public.survey_config(survey_id) ON DELETE CASCADE,
    is_active   BOOLEAN NOT NULL DEFAULT true,             -- Estado de la encuesta para este grupo
    UNIQUE (group_id, survey_id)                             -- Una sola config por grupo+encuesta
);

-- Row Level Security
ALTER TABLE public.group_survey_config ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Lectura pública de config de encuesta por grupo"
    ON public.group_survey_config FOR SELECT USING (true);

-- Escritura para autenticados (admin)
CREATE POLICY "Escritura de config de encuesta por grupo para autenticados"
    ON public.group_survey_config FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

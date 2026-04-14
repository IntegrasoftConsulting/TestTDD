-- ============================================================
-- HU-29: Nueva Encuesta de Domain Driven Design (DDD)
-- Script: setup_ddd_survey.sql
-- Descripción: Registra la encuesta de la sesión DDD en la tabla
--              survey_config para permitir su gestión dinámica.
-- ============================================================

-- 1. Registrar la nueva encuesta
INSERT INTO public.survey_config (survey_id, is_active)
VALUES ('DDD_SESSION', true)
ON CONFLICT (survey_id) DO UPDATE SET
    is_active = EXCLUDED.is_active;

-- ---------------------------------------------------------------
-- Verificación: resultado esperado
-- SELECT * FROM public.survey_config WHERE survey_id = 'DDD_SESSION';
-- ---------------------------------------------------------------

-- ============================================================
-- HU-32: Certificado de Aprobación - Modern Software Craftsmanship
-- Script: setup_certificates.sql
-- Descripción: Crea la tabla certificates con RLS para almacenar
--              los certificados emitidos y permitir verificación pública.
-- ============================================================

-- 1. Crear tabla de certificados
CREATE TABLE IF NOT EXISTS public.certificates (
    certificate_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email      TEXT NOT NULL,
    student_name    TEXT NOT NULL,
    weighted_score  NUMERIC(5,2) NOT NULL,
    group_id        UUID REFERENCES public.groups(group_id) ON DELETE SET NULL,
    score_detail    JSONB,           -- { TDD: 80, BDD: 60, SOLID: 100, ... }
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_email)              -- idempotente: un certificado por estudiante
);

-- 2. Habilitar Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 3. Política: lectura pública (para página de verificación sin login)
DROP POLICY IF EXISTS "Lectura pública de certificados" ON public.certificates;
CREATE POLICY "Lectura pública de certificados"
    ON public.certificates FOR SELECT
    USING (true);

-- 4. Política: inserción solo para usuarios autenticados
DROP POLICY IF EXISTS "Inserción autenticada de certificados" ON public.certificates;
CREATE POLICY "Inserción autenticada de certificados"
    ON public.certificates FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 5. Política: actualización solo para usuarios autenticados (re-emisión idempotente)
DROP POLICY IF EXISTS "Actualización autenticada de certificados" ON public.certificates;
CREATE POLICY "Actualización autenticada de certificados"
    ON public.certificates FOR UPDATE
    USING (auth.uid() IS NOT NULL);

-- ---------------------------------------------------------------
-- Verificación: resultado esperado
-- SELECT * FROM public.certificates;
-- SELECT schemaname, tablename, policyname, cmd FROM pg_policies WHERE tablename = 'certificates';
-- ---------------------------------------------------------------

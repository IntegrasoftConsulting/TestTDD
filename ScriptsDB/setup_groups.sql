-- ============================================================
-- HU-20: Gestión de Grupos y Control de Evaluaciones por Grupo
-- Script: setup_groups.sql
-- Descripción: Crea las tablas groups, group_members y
--              group_test_config con sus RLS policies.
-- Prerequisitos: setup_test_config.sql (y migrate_test_config_HU15.sql)
-- ============================================================

-- 1. Tabla de grupos
CREATE TABLE IF NOT EXISTS public.groups (
    group_id    UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
    name        TEXT    NOT NULL UNIQUE,                    -- Nombre único del grupo (ej. "Cohorte A")
    description TEXT    NOT NULL DEFAULT '',               -- Descripción o propósito del grupo
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de miembros por grupo
CREATE TABLE IF NOT EXISTS public.group_members (
    id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id    UUID    NOT NULL REFERENCES public.groups(group_id) ON DELETE CASCADE,
    email       TEXT    NOT NULL,                          -- Correo del participante (coincide con results.email)
    created_at  TIMESTAMPTZ DEFAULT now(),
    UNIQUE (group_id, email)                               -- Un usuario no puede estar dos veces en el mismo grupo
);

-- 3. Tabla de configuración de tests por grupo
--    Permite habilitar/deshabilitar tests a nivel de grupo,
--    sobreescribiendo la configuración global de test_config.
CREATE TABLE IF NOT EXISTS public.group_test_config (
    id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id    UUID    NOT NULL REFERENCES public.groups(group_id) ON DELETE CASCADE,
    test_id     TEXT    NOT NULL REFERENCES public.test_config(test_id) ON DELETE CASCADE,
    is_active   BOOLEAN NOT NULL DEFAULT true,             -- Estado del test para este grupo
    UNIQUE (group_id, test_id)                             -- Una sola config por grupo+test
);

-- ---------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------
ALTER TABLE public.groups           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_test_config ENABLE ROW LEVEL SECURITY;

-- Lectura pública (cualquier usuario autenticado puede leer)
CREATE POLICY "Lectura pública de grupos"
    ON public.groups FOR SELECT USING (true);

CREATE POLICY "Lectura pública de miembros de grupo"
    ON public.group_members FOR SELECT USING (true);

CREATE POLICY "Lectura pública de config de grupo"
    ON public.group_test_config FOR SELECT USING (true);

-- Escritura solo para usuarios autenticados (admin verifica en cliente)
CREATE POLICY "Escritura de grupos para autenticados"
    ON public.groups FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Escritura de miembros para autenticados"
    ON public.group_members FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Escritura de config de grupo para autenticados"
    ON public.group_test_config FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ---------------------------------------------------------------
-- Verificación: resultado esperado tras la migración
-- SELECT * FROM public.groups;
-- SELECT * FROM public.group_members;
-- SELECT * FROM public.group_test_config;
-- ---------------------------------------------------------------

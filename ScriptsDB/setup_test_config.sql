-- Creación de tabla para gestionar la disponibilidad de los exámenes (HU-9)
CREATE TABLE public.test_config (
    test_id text PRIMARY KEY,
    is_active boolean NOT NULL DEFAULT true
);

-- Insertar los dos tests que manejamos por defecto
INSERT INTO public.test_config (test_id, is_active)
VALUES 
    ('TDD', true),
    ('BDD', true);

-- Habilitar Row Level Security
ALTER TABLE public.test_config ENABLE ROW LEVEL SECURITY;

-- Política de lectura: Cualquier usuario (incluso no autenticado o estudiantes) puede ver si un test está activo
CREATE POLICY "Permitir lectura publica de configuracion de test"
ON public.test_config
FOR SELECT
USING (true);

-- Política de actualización: Permitiremos la actualización a cualquier usuario autenticado
-- NOTA: En un entorno productivo real, esto debería validarse con JWT Claims o una función RPC.
-- Dado que usamos signInAnonymously + control de email manual en el App.jsx, 
-- la validación de admin se hace principalmente en el Frontend antes de llamar a este Update.
CREATE POLICY "Permitir actualizacion a usuarios autenticados"
ON public.test_config
FOR UPDATE
USING (auth.role() = 'authenticated');

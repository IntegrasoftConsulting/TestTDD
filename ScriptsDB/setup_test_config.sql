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

-- Política de actualización: Solo los administradores (cuyo email exista en admin_users) pueden encender/apagar tests
-- NOTA: Como usamos auth y un control interno rudimentario, si el JWT no tiene el email o supabase auth anon,
-- la politica se asegurará de buscar el claim actual.
CREATE POLICY "Permitir actualizacion a administradores"
ON public.test_config
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

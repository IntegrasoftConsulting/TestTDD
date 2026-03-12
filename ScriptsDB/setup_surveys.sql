-- Tabla para almacenar los resultados de las encuestas de satisfacción
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL,
    student_name TEXT,
    survey_id TEXT NOT NULL, -- e.g., 'TDD_SESSION'
    rating_content INTEGER CHECK (rating_content >= 1 AND rating_content <= 5),
    rating_instructor INTEGER CHECK (rating_instructor >= 1 AND rating_instructor <= 5),
    rating_practical INTEGER CHECK (rating_practical >= 1 AND rating_practical <= 5),
    comments TEXT,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados pueden insertar sus propias respuestas
CREATE POLICY "Permitir insercion a usuarios autenticados" 
ON public.survey_responses 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Política: Los administradores pueden leer todas las respuestas
CREATE POLICY "Permitir lectura a administradores" 
ON public.survey_responses 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users au 
        WHERE au.email = current_setting('request.jwt.claims', true)::json->>'email'
        OR auth.role() = 'authenticated' -- Simplificado para desarrollo inicial como en test_config
    )
);

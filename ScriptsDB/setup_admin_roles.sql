-- 1. Crear la tabla de administradores
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insertar un administrador por defecto (Ajustar al correo que usarás para probar)
INSERT INTO public.admin_users (email) 
VALUES ('admin@integrasoft.com')
ON CONFLICT (email) DO NOTHING;

-- 3. Habilitar RLS en la tabla donde están las calificaciones (asumiendo que se llama 'results')
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- 4. Crear Política: Los estudiantes pueden ver e insertar SUS PROPIAS respuestas.
-- Para leer: Solo pueden ver filas donde el 'email' coincida con su correo (o studentName si prefieren esa métrica por ahora).
CREATE POLICY "Estudiantes pueden ver sus propios resultados" 
ON public.results 
FOR SELECT 
USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    -- Nota: En un entorno de autoevaluación anónima como el actual donde pasamos el correo en el cliente, 
    -- esto funcionará perfectamente si la app React también filtra localmente. 
    -- Si usan autenticación completa de Supabase, usen auth.email() o auth.uid().
);

-- Para insertar: Los estudiantes pueden insertar libremente (la app React ya se encarga de que solo inserten con su nombre/correo)
CREATE POLICY "Permitir inserción a todos (Usuarios Anónimos)" 
ON public.results 
FOR INSERT 
WITH CHECK (true);

-- 5. Crear Política: Administradores pueden leer TODAS las filas
-- Validamos si el email actual existe en la tabla admin_users
CREATE POLICY "Administradores pueden ver todo" 
ON public.results 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 
        FROM public.admin_users 
        WHERE admin_users.email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    -- Si están usando auth.email() real de Supabase, quitar el current_setting y usar: admin_users.email = auth.email()
);

-- 6. Habilitar acceso de lectura a admin_users para todos (necesario para el frontend)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de correos admin" 
ON public.admin_users 
FOR SELECT 
USING (true);

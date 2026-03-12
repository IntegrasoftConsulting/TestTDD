-- Agregar la columna 'answers' a la tabla 'results' para almacenar el arreglo de respuestas
-- Esto es necesario para la HU-8: Dashboard Avanzado y Análisis de Tendencias por Pregunta

ALTER TABLE public.results
ADD COLUMN answers JSONB;

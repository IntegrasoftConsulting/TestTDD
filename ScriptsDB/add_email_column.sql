-- Agregar la columna 'email' a la tabla 'results'
ALTER TABLE public.results
ADD COLUMN email VARCHAR(255);

-- Opcional: Si deseas que a partir de ahora el campo sea obligatorio 
-- para nuevos registros pero manteniendo los nulos de los registros antiguos, 
-- usa la restricción de inserción a nivel de código (que ya tenemos). 
-- Pero NO uses NOT NULL en la base de datos a menos que todos los registros 
-- anteriores ya tengan un correo electrónico asignado.

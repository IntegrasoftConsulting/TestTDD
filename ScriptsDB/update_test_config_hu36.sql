-- Añadir columnas para el contexto teórico y conocimiento evaluado (HU-36)
ALTER TABLE public.test_config 
ADD COLUMN IF NOT EXISTS theoretical_context TEXT,
ADD COLUMN IF NOT EXISTS evaluated_knowledge TEXT;

-- Actualizar los textos para TDD
UPDATE public.test_config 
SET theoretical_context = 'Test Driven Development (TDD) es una práctica de ingeniería de software donde las pruebas unitarias se escriben antes del código de producción, guiando el diseño del sistema.',
    evaluated_knowledge = 'Ciclo Red-Green-Refactor, diseño guiado por pruebas, aserciones y aislamiento de componentes.'
WHERE test_id = 'TDD';

-- Actualizar los textos para BDD
UPDATE public.test_config 
SET theoretical_context = 'Behavior Driven Development (BDD) extiende TDD enfocándose en el comportamiento del sistema desde la perspectiva del negocio, utilizando un lenguaje ubicuo comprensible por todos los roles.',
    evaluated_knowledge = 'Especificaciones Given-When-Then, colaboración negocio-desarrollo, escenarios ejecutables.'
WHERE test_id = 'BDD';

-- Actualizar los textos para SOLID
UPDATE public.test_config 
SET theoretical_context = 'Los principios SOLID son cinco principios de diseño orientado a objetos destinados a hacer que los diseños de software sean más comprensibles, flexibles y mantenibles.',
    evaluated_knowledge = 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation y Dependency Inversion.'
WHERE test_id = 'SOLID';

-- Actualizar los textos para DDD
UPDATE public.test_config 
SET theoretical_context = 'Domain-Driven Design (DDD) es un enfoque de desarrollo de software que centra el diseño en el modelo del dominio del negocio para manejar lógica compleja.',
    evaluated_knowledge = 'Lenguaje Ubicuo, Bounded Contexts, Entidades, Value Objects, Agregados.'
WHERE test_id = 'DDD';

-- Actualizar los textos para SDD
UPDATE public.test_config 
SET theoretical_context = 'Spec-Driven Development (SDD) utiliza especificaciones formales como fuente de verdad para guiar el desarrollo, siendo especialmente útil en flujos de trabajo asistidos por Inteligencia Artificial.',
    evaluated_knowledge = 'Prompt Engineering, Workflows multi-agente, validación sistemática de outputs de IA.'
WHERE test_id = 'SDD';

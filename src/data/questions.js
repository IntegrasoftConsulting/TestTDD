export const QUESTIONS_TDD = [
    {
        id: 1,
        question: "¿Cuál es el propósito fundamental del paso 'Red' en el ciclo TDD?",
        options: [
            "Identificar errores de sintaxis en código antiguo.",
            "Definir el comportamiento esperado mediante una prueba que falle.",
            "Optimizar el rendimiento del servidor.",
            "Asegurar que el entorno de CI/CD funcione."
        ],
        correct: 1
    },
    {
        id: 2,
        question: "En TDD, ¿qué se debe hacer inmediatamente después de que una prueba pase (Green)?",
        options: [
            "Escribir la siguiente prueba fallida.",
            "Pasar a producción el código.",
            "Refactorizar el código para mejorar su estructura.",
            "Eliminar la prueba para ahorrar espacio."
        ],
        correct: 2
    },
    {
        id: 3,
        question: "¿Cuál es la característica principal de una Prueba Unitaria efectiva?",
        options: [
            "Debe probar la integración con la base de datos real.",
            "Debe ser rápida, aislada y probar una única unidad lógica.",
            "Debe ser escrita únicamente por el equipo de QA.",
            "Debe ejecutarse solo una vez al mes."
        ],
        correct: 1
    },
    {
        id: 4,
        question: "¿Qué indica una 'Cobertura de Código' (Code Coverage) del 100%?",
        options: [
            "Que el código no tiene absolutamente ningún bug.",
            "Que todas las líneas de código han sido ejecutadas al menos una vez por las pruebas.",
            "Que el rendimiento del software es óptimo.",
            "Que ya no es necesario realizar pruebas de integración."
        ],
        correct: 1
    },
    {
        id: 5,
        question: "Al usar IA en TDD, ¿cuál es el flujo recomendado?",
        options: [
            "Que la IA escriba todo el proyecto sin revisión.",
            "Escribir la prueba manualmente y pedir a la IA la implementación.",
            "Generar el código y luego pedirle a la IA que invente las pruebas.",
            "No usar IA bajo ninguna circunstancia."
        ],
        correct: 1
    }
];

export const QUESTIONS_BDD = [
    {
        id: 1,
        question: "¿Qué significan las siglas BDD en el desarrollo de software?",
        options: [
            "Bug-Driven Development",
            "Behavior-Driven Development",
            "Backend-Driven Design",
            "Basic Data Deployment"
        ],
        correct: 1
    },
    {
        id: 2,
        question: "¿Cuál es el propósito principal del formato Given-When-Then?",
        options: [
            "Crear esquemas de bases de datos relacionales.",
            "Describir el comportamiento de un sistema de forma comprensible para negocio y desarrollo.",
            "Optimizar la velocidad de ejecución de las pruebas unitarias.",
            "Definir la arquitectura de microservicios resolviendo dependencias."
        ],
        correct: 1
    },
    {
        id: 3,
        question: "En Gherkin, ¿para qué sirve la palabra clave 'Given' (Dado)?",
        options: [
            "Para describir la acción que realiza el usuario.",
            "Para definir el resultado que se espera tras la acción.",
            "Para establecer el estado inicial o contexto antes de la acción.",
            "Para conectar múltiples validaciones en una aserción condicional."
        ],
        correct: 2
    },
    {
        id: 4,
        question: "¿Qué relación existe entre TDD y BDD?",
        options: [
            "BDD y TDD son excluyentes; usar uno prohíbe el uso del otro.",
            "BDD es una evolución del TDD enfocada en el comportamiento y comunicación del sistema.",
            "TDD es para front-end y BDD es estrictamente para back-end.",
            "Ninguna, fueron creadas para propósitos completamente separados."
        ],
        correct: 1
    },
    {
        id: 5,
        question: "¿Cuál de estas herramientas es comúnmente utilizada para implementar pruebas BDD?",
        options: [
            "Postman",
            "Sublime Text",
            "Docker",
            "Cucumber"
        ],
        correct: 3
    }
];

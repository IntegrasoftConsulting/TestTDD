# Protocolo de Calidad (TestTDD)
 
Este documento resume las reglas de oro para mantener la estabilidad del proyecto.
 
## 1. Orden de Definición de Hooks (React)
Para evitar errores de "referencia antes de inicialización":
- **Variable Base** (ej: `allResults`) debe definirse ANTES de cualquier `useMemo` que la use.
- **Filtros** (ej: `filteredAnalyticsData`) deben definirse ANTES de los procesadores de métricas (`stats`).
 
## 🏛️ Arquitectura Modular (SOLID)
1.  **Lógica Separada**: Toda la lógica de negocio y estados debe residir en `src/hooks/useAppLogic.js`.
2.  **Componentes Atómicos**: Los archivos en `src/components/` deben ser funcionales y recibir datos vía props. Evitar efectos secundarios pesados en ellos.
3.  **App.jsx Orquestador**: `App.jsx` solo debe manejar la navegación de alto nivel y el ensamblaje de componentes.

## 🪝 Orden de Hooks y Estabilidad
1.  **Hoisting**: Las constantes no tienen hoisting. Define SIEMPRE las dependencias antes que los hooks que las usan.
2.  **Referencia Crítica**: `filteredAnalyticsData` y `stats` en `useAppLogic.js` deben seguir un orden secuencial estricto para evitar errores de inicialización ("Pantalla en blanco").
3.  **Manejo de Errores**: Implementar siempre estados de carga (`loading`) y errores (`error`) al interactuar con Supabase.
 
---
*Consulta `.agent/rules.md` para especificaciones técnicas adicionales.*

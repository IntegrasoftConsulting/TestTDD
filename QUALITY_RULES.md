# Protocolo de Calidad (TestTDD)
 
Este documento resume las reglas de oro para mantener la estabilidad del proyecto.
 
## 1. Orden de Definición de Hooks (React)
Para evitar errores de "referencia antes de inicialización":
- **Variable Base** (ej: `allResults`) debe definirse ANTES de cualquier `useMemo` que la use.
- **Filtros** (ej: `filteredAnalyticsData`) deben definirse ANTES de los procesadores de métricas (`stats`).
 
## 2. Edición de App.jsx
- El archivo es extremadamente largo. No realices ediciones masivas sin verificar cierres de etiquetas JSX.
- Se recomienda usar herramientas que garanticen la integridad del bloque reemplazado.
 
## 3. Estética Premium
- Mantener el uso de Lucide Icons.
- Respetar el sistema de diseño basado en Slate/Indigo/Amber.
- El modo oscuro es obligatorio para todos los nuevos componentes.
 
---
*Consulta `.agent/rules.md` para especificaciones técnicas adicionales.*

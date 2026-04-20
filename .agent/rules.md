# Reglas de Calidad y Estabilidad (TestTDD)
 
Estas reglas son de cumplimiento obligatorio para cualquier agente de IA o desarrollador que trabaje en este repositorio.
 
## 1. Arquitectura Modular y SOLID
- **Estructura:** La lógica reside en `src/hooks/useAppLogic.js`, los datos en `src/data/` y la UI en `src/components/`. 
- **App.jsx:** Debe mantenerse como un orquestador ligero. No agregar lógica de estado compleja ni efectos pesados directamente aquí.
- **Protocolo de Edición:** Al crear nuevos componentes, seguir el patrón de props claras y evitar el acoplamiento directo con Supabase dentro de los componentes visuales (usar el hook central).

## 2. Orden de Definición de Hooks (React)
- **Hoisting:** Las constantes definidas con `const` no tienen hoisting.
- **Regla Oro:** Un Hook (useMemo, useCallback, useEffect) **nunca** debe depender de una variable definida después de él en el archivo. Esto es CRÍTICO en `useAppLogic.js`.
- **Acción:** Variables de estado -> Procesadores de datos (Métricas/Filtros) -> Retorno del Hook.
 
## 3. Prevención de "Pantalla en Blanco"
- Si la aplicación falla al renderizar, el 90% de las veces se debe a un `ReferenceError` (acceso antes de inicialización) o un error de sintaxis JSX.
- **Verificación:** Revisa la consola del navegador por errores de tipo "Cannot access 'X' before initialization".
- **Fallbacks:** Siempre implementar mecanismos de respaldo para peticiones a Supabase (ej: variables de respaldo para configuraciones).
 
## 4. Estilo de Código y UI
- Mantener el diseño premium solicitado: Gradientes suaves, sombras sutiles, micro-animaciones (lucide-react + tailwind).
- Uso coherente del Modo Oscuro (`dark:` clases).
 
+## 5. Protocolo del Agente Experto UI/UX
+- **Herramienta Primaria:** Los diseños se prototipan en **Stitch** usando prompts optimizados (`enhance-prompt`).
+- **Source of Truth:** El archivo `DESIGN.md` es el contrato de diseño entre UI/UX y Desarrollo. Cualquier cambio en estilos debe reflejarse primero allí.
+- **Handoff:** Para la entrega a desarrollo, el agente debe proporcionar los tokens semánticos (colores, tipografía, bordes) y, opcionalmente, convertir pantallas a componentes React modulares.
+- **Iteración:** Se deben generar variantes de pantallas críticas antes de proceder a la implementación final.

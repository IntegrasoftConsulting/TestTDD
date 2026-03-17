# Reglas de Calidad y Estabilidad (TestTDD)
 
Estas reglas son de cumplimiento obligatorio para cualquier agente de IA o desarrollador que trabaje en este repositorio.
 
## 1. Gestión de Archivos Grandes (App.jsx)
- **App.jsx** es un componente monolítico de alta complejidad.
- **Protocolo de Edición:** Al editar este archivo, utiliza fragmentos de código precisos y pequeños. Evita reemplazos masivos que puedan inducir errores de sintaxis o pérdida de etiquetas de cierre.
- **Auditoría JSX:** Después de cada edición estructural, verifica que el árbol de componentes esté balanceado (etiquetas cerradas, llaves `{}` emparejadas).
 
## 2. Orden de Definición de Hooks (React)
- **Hoisting:** Las constantes definidas con `const` no tienen hoisting.
- **Regla Oro:** Un Hook (useMemo, useCallback, useEffect) **nunca** debe depender de una variable definida después de él en el archivo.
- **Acción:** Variables de estado -> Procesadores de datos (Métricas/Filtros) -> Componentes de UI.
 
## 3. Prevención de "Pantalla en Blanco"
- Si la aplicación falla al renderizar, el 90% de las veces se debe a un `ReferenceError` (acceso antes de inicialización) o un error de sintaxis JSX.
- **Verificación:** Revisa la consola del navegador por errores de tipo "Cannot access 'X' before initialization".
- **Fallbacks:** Siempre implementar mecanismos de respaldo para peticiones a Supabase (ej: variables de respaldo para configuraciones).
 
## 4. Estilo de Código y UI
- Mantener el diseño premium solicitado: Gradientes suaves, sombras sutiles, micro-animaciones (lucide-react + tailwind).
- Uso coherente del Modo Oscuro (`dark:` clases).

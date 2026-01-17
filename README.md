# Red Social - Buenas Prácticas (Proyecto B)

Este proyecto es una refactorización avanzada de la `RedSocialMalasPracticas`, aplicando patrones de diseño **SOLID**, **Clean Architecture** y optimizaciones de rendimiento en Angular 17+.

## 🚀 Optimizaciones Principales

### 1. Arquitectura y Modularización (BP 1.1 - 2.1)
- **Standalone Components:** Eliminación de módulos innecesarios para reducir el bundle inicial.
- **Lazy Loading:** Uso de `loadComponent` en el router para diferir la carga de vistas pesadas.

### 2. Reactividad y Estado (BP 3.1 - 9.3)
- **Angular Signals:** Implementación de Signals para una detección de cambios granular, reduciendo el overhead de Zone.js.
- **RxJS Memory Management:** Uso del operador `takeUntilDestroyed()` y `AsyncPipe` para prevenir memory leaks.

### 3. Rendimiento de Red (BP 7.1 - 8.3)
- **Caché en Servicios:** Implementación de `shareReplay` y Map-based cache para evitar peticiones duplicadas.
- **HTTP Interceptors:** Centralización de métricas y gestión de cabeceras.

### 4. UI/UX Performance (BP 5.1 - 6.2)
- **Control Flow (@for):** Uso de la nueva sintaxis con `track` para optimizar el renderizado del DOM.
- **Debouncing:** Aplicación de `debounceTime` en búsquedas para proteger el hilo principal.

## 📈 Comparativa de KPIs (App A vs App B)

| KPI | Malas Prácticas (A) | Buenas Prácticas (B) | Mejora |
| :--- | :---: | :---: | :--- |
| **Peticiones HTTP** | N (Duplicadas) | 1 (Caché activo) | ~70% ahorro |
| **Suscripciones Activas** | Acumulativas | Estables (Auto-cancel) | Eliminación de fugas |
| **Render Items** | 500+ (Inflado) | 24 - 100 (Real) | < Memoria RAM |
| **Avg Input Handler** | > 50ms | < 2ms | Interfaz fluida (60fps) |
| **Cache Hit Ratio** | 0% | > 80% | Navegación instantánea |

## Instalación
```bash
npm install
ionic serve

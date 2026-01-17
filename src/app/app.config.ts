import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app.routes';
import { KpiService } from './core/metrics/kpi.service';
import { tap } from 'rxjs';

/**
 * Interceptor para automatizar el conteo de peticiones HTTP (BP 7.3)
 * Esto asegura que el KPI 'httpRequests' sea 100% preciso sin esfuerzo.
 */
const kpiInterceptor = (req: any, next: any) => {
  const kpi = inject(KpiService);
  kpi.incHttp(); // Registro automático de la petición
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Configuración de Ionic (Standalone)
    provideIonicAngular({
      mode: 'md', // Forzamos un modo para consistencia visual (opcional)
      rippleEffect: true
    }),

    // 2. Router con mejoras de rendimiento (BP 2.1)
    provideRouter(
      routes, 
      withComponentInputBinding(), // Permite recibir params de ruta como @Input/Signals
      withViewTransitions()        // Añade transiciones suaves entre páginas (Mejor UX/BP 4.1)
    ),

    // 3. HTTP Client optimizado
    provideHttpClient(
      withFetch(),                // Usa la API Fetch moderna (más rápida que XHR)
      withInterceptors([kpiInterceptor]) // Centralización de lógica (SOLID)
    ),
  ],
};
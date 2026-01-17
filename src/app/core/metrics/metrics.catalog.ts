import { KPIs } from './kpi.service';

export type KpiSource = 'AUTO' | 'DEVTOOLS' | 'MANUAL';

// Tipado exhaustivo para evitar errores de dedo (typos)
export type KpiId = keyof KPIs | 'cacheHitRatio' | 'sharedReusableComponents' | 'homeComponentLoc' | 'httpOutsideServices' | 'lazyRoutesCount' | 'initialJsKb' | 'ionicUiRatio' | 'pageSize' | 'scrollFps' | 'debounceMs' | 'devicesTested' | 'requestsPerActionSelectCity' | 'cacheTtlSeconds' | 'offlineFallback' | 'manualRefresh' | 'manualSubscribesInPages' | 'storesCount';

export interface KpiDef {
  id: KpiId;
  name: string;
  description: string;
  unit?: string;
  source: KpiSource;
  target?: string;
}

export interface BestPracticeDef {
  code: string;
  title: string;
  description?: string;
  kpis: KpiDef[];
}

export interface CategoryDef {
  code: string;
  title: string;
  practices: BestPracticeDef[];
}

export const METRICS_CATALOG: CategoryDef[] = [
  {
    code: '2.2.1',
    title: 'Gestión eficiente de componentes',
    practices: [
      {
        code: 'BP 1.1',
        title: 'Dividir la interfaz en componentes pequeños y reutilizables',
        kpis: [{ id: 'sharedReusableComponents', name: 'Componentes reutilizables (shared)', description: 'Mide la modularización. Favorece mantenimiento.', unit: '#', source: 'MANUAL', target: '≥ 2' }]
      },
      {
        code: 'BP 1.2',
        title: 'Evitar componentes excesivamente grandes',
        kpis: [{ id: 'homeComponentLoc', name: 'Tamaño HomePage (LOC)', description: 'Líneas de código. Menos es más mantenible.', unit: 'LOC', source: 'MANUAL', target: '< MalasPracticas' }]
      },
      {
        code: 'BP 1.3',
        title: 'Mantener la lógica de negocio en servicios',
        kpis: [{ id: 'httpOutsideServices', name: 'HTTP fuera de servicios', description: 'Número de llamadas HTTP directas desde componentes.', unit: '#', source: 'MANUAL', target: '0' }]
      }
    ]
  },
  {
    code: '2.2.2',
    title: 'Lazy loading de páginas y componentes',
    practices: [
      {
        code: 'BP 2.1',
        title: 'Uso de lazy loading',
        kpis: [
          { id: 'lazyRoutesCount', name: 'Rutas lazy (loadComponent)', description: 'Reduce tiempo de arranque.', unit: '#', source: 'MANUAL', target: '3 (home, forecast, settings)' },
          { id: 'initialJsKb', name: 'JS inicial descargado', description: 'Tamaño en KB al cargar Home.', unit: 'KB', source: 'DEVTOOLS', target: 'Menor en App B' }
        ]
      }
    ]
  },
  {
    code: '2.2.3',
    title: 'Uso correcto de servicios y estado',
    practices: [
      {
        code: 'BP 3.1',
        title: 'Servicios para datos compartidos',
        kpis: [{ id: 'httpRequests', name: 'Peticiones HTTP totales', description: 'Indica falta de cache.', unit: '#', source: 'AUTO', target: 'Menor en App B' }]
      },
      {
        code: 'BP 3.2',
        title: 'Liberar suscripciones',
        kpis: [{ id: 'activeSubscriptions', name: 'Suscripciones activas', description: 'Fugas de memoria si crece.', unit: '#', source: 'AUTO', target: 'Estable' }]
      },
      {
        code: 'BP 3.3',
        title: 'Evitar grandes volúmenes de datos',
        kpis: [{ id: 'renderItems', name: 'Elementos renderizados', description: 'Penaliza memoria y FPS.', unit: '#', source: 'AUTO', target: '24' }]
      }
    ]
  },
  {
    code: '2.3.1',
    title: 'Componentes Ionic',
    practices: [
      {
        code: 'BP 4.1',
        title: 'Componentes Ionic vs HTML puro',
        kpis: [{ id: 'ionicUiRatio', name: 'Ratio Ionic en UI crítica', description: 'Uso de componentes nativos.', unit: '%', source: 'MANUAL', target: 'Alto' }]
      }
    ]
  },
  {
    code: '2.3.2',
    title: 'Gestión de listas',
    practices: [
      {
        code: 'BP 5.1',
        title: 'Evitar renderizar listas completas',
        kpis: [{ id: 'renderItems', name: 'Elementos simultáneos', description: 'Afecta scroll y memoria.', unit: '#', source: 'AUTO', target: '24 o paginado' }]
      },
      {
        code: 'BP 5.2',
        title: 'Carga progresiva',
        kpis: [{ id: 'pageSize', name: 'Tamaño de página', description: 'Elementos por bloque.', unit: '#', source: 'MANUAL', target: '24' }]
      },
      {
        code: 'BP 5.3',
        title: 'Minimizar elementos visibles',
        kpis: [{ id: 'scrollFps', name: 'FPS durante scroll', description: 'Fluidez percibida.', unit: 'FPS', source: 'DEVTOOLS', target: 'Estable' }]
      }
    ]
  },
  {
    code: '2.3.3',
    title: 'Eventos y gestos',
    practices: [
      {
        code: 'BP 6.1',
        title: 'Evitar cálculos pesados en eventos',
        kpis: [{ id: 'avgInputHandlerMs', name: 'Coste handler input', description: 'Tiempo al teclear.', unit: 'ms', source: 'AUTO', target: 'Menor en App B' }]
      },
      {
        code: 'BP 6.2',
        title: 'Debounce en búsquedas',
        kpis: [{ id: 'debounceMs', name: 'Debounce aplicado', description: 'Retardo para evitar micro-peticiones.', unit: 'ms', source: 'MANUAL', target: '300ms' }]
      },
      {
        code: 'BP 6.3',
        title: 'Pruebas en dispositivos reales',
        kpis: [{ id: 'devicesTested', name: 'Dispositivos probados', description: 'Garantía de rendimiento.', unit: '#', source: 'MANUAL', target: '≥ 1 real' }]
      }
    ]
  },
  {
    code: '2.4.1',
    title: 'Consumo de APIs',
    practices: [
      {
        code: 'BP 7.1',
        title: 'Evitar peticiones duplicadas',
        kpis: [{ id: 'requestsPerActionSelectCity', name: 'Requests por ciudad', description: 'Idealmente 1.', unit: '#', source: 'MANUAL', target: '1' }]
      },
      {
        code: 'BP 7.2',
        title: 'Reutilizar resultados',
        kpis: [{ id: 'cacheHitRatio', name: 'Cache hit ratio', description: 'Efectividad del cache.', unit: '%', source: 'AUTO', target: 'Alto' }]
      },
      {
        code: 'BP 7.3',
        title: 'Centralizar llamadas HTTP',
        kpis: [{ id: 'httpOutsideServices', name: 'HTTP fuera de servicios', description: 'Debe ser 0.', unit: '#', source: 'MANUAL', target: '0' }]
      }
    ]
  },
  {
    code: '2.4.2',
    title: 'Cacheo y persistencia',
    practices: [
      {
        code: 'BP 8.1',
        title: 'Almacenar en memoria',
        kpis: [{ id: 'cacheTtlSeconds', name: 'TTL de cache', description: 'Vida de los datos en memoria.', unit: 's', source: 'MANUAL', target: '60s' }]
      },
      {
        code: 'BP 8.2',
        title: 'Persistencia local',
        kpis: [{ id: 'offlineFallback', name: 'Fallback offline', description: 'Estrategia sin red.', source: 'MANUAL', target: 'Opcional' }]
      },
      {
        code: 'BP 8.3',
        title: 'Sincronización controlada',
        kpis: [{ id: 'manualRefresh', name: 'Refresh explícito', description: 'Acción de forzar recarga.', source: 'MANUAL', target: 'Sí' }]
      }
    ]
  },
  {
    code: '2.4.3',
    title: 'Observables y suscripciones',
    practices: [
      {
        code: 'BP 9.1',
        title: 'Suscribirse solo si es necesario',
        kpis: [{ id: 'manualSubscribesInPages', name: 'Subscribes manuales', description: 'Uso de .subscribe() vs AsyncPipe.', unit: '#', source: 'MANUAL', target: '0' }]
      },
      {
        code: 'BP 9.2',
        title: 'Cancelar suscripciones',
        kpis: [{ id: 'activeSubscriptions', name: 'Suscripciones activas', description: 'Estabilidad tras navegar.', unit: '#', source: 'AUTO', target: 'Estable' }]
      },
      {
        code: 'BP 9.3',
        title: 'Centralizar flujos',
        kpis: [{ id: 'storesCount', name: 'Nº de stores/servicios', description: 'Flujos centralizados.', unit: '#', source: 'MANUAL', target: '≥ 1' }]
      }
    ]
  }
];
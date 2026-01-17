import { Injectable, signal, computed } from '@angular/core';

export interface KPIs {
  startupMs?: number;
  homeDataMs?: number;
  forecastDataMs?: number;
  httpRequests: number;
  cacheHit: number;
  cacheMiss: number;
  activeSubscriptions: number;
  avgInputHandlerMs: number;
  inputSamples: number;
  renderItems: number;
  manual: Record<string, number | string | boolean | null>;
}

const INITIAL_STATE: KPIs = {
  httpRequests: 0,
  cacheHit: 0,
  cacheMiss: 0,
  activeSubscriptions: 0,
  avgInputHandlerMs: 0,
  inputSamples: 0,
  renderItems: 0,
  manual: {},
};

@Injectable({ providedIn: 'root' })
export class KpiService {
  // 1. Usamos Signals para reactividad fina y mejor rendimiento (KPI: Rendering)
  private state = signal<KPIs>(INITIAL_STATE);

  // Exponemos el estado como readonly
  readonly kpis = this.state.asReadonly();

  // 2. Computed Signal para lógica derivada (evita re-cálculos innecesarios)
  readonly cacheHitRatio = computed(() => {
    const { cacheHit, cacheMiss } = this.state();
    const denom = cacheHit + cacheMiss;
    return denom === 0 ? null : Math.round((cacheHit / denom) * 100);
  });

  reset(): void {
    this.state.set(INITIAL_STATE);
  }

  // 3. Métodos atómicos usando update() para asegurar inmutabilidad
  incHttp(): void {
    this.state.update(s => ({ ...s, httpRequests: s.httpRequests + 1 }));
  }

  incCacheHit(): void {
    this.state.update(s => ({ ...s, cacheHit: s.cacheHit + 1 }));
  }

  incCacheMiss(): void {
    this.state.update(s => ({ ...s, cacheMiss: s.cacheMiss + 1 }));
  }

  incSub(): void {
    this.state.update(s => ({ ...s, activeSubscriptions: s.activeSubscriptions + 1 }));
  }

  decSub(): void {
    this.state.update(s => ({ 
      ...s, 
      activeSubscriptions: Math.max(0, s.activeSubscriptions - 1) 
    }));
  }

  // 4. Seteo de métricas de tiempo con tipado estricto
  setMetric(key: keyof Omit<KPIs, 'manual'>, value: number): void {
    this.state.update(s => ({ ...s, [key]: value }));
  }

  addInputSample(ms: number): void {
    this.state.update(s => {
      const n = s.inputSamples + 1;
      const newAvg = s.avgInputHandlerMs + (ms - s.avgInputHandlerMs) / n;
      return { ...s, avgInputHandlerMs: newAvg, inputSamples: n };
    });
  }

  setManual(id: string, value: number | string | boolean | null): void {
    this.state.update(s => ({
      ...s,
      manual: { ...s.manual, [id]: value }
    }));
  }

  // 5. Eliminamos el switch gigante por acceso directo o dinámico tipado
  getValue(key: keyof KPIs | 'cacheHitRatio'): any {
    if (key === 'cacheHitRatio') return this.cacheHitRatio();
    return this.state()[key as keyof KPIs];
  }
}
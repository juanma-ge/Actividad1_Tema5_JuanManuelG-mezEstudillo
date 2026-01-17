import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonList, IonLabel, IonButton, IonNote, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntilDestroyed } from 'rxjs/operators';

import { SocialGoodService, Post } from '../../core/services/social-good.service';
import { KpiService } from '../../core/metrics/kpi.service';

@Component({
  standalone: true,
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush, // BP: Optimización de ciclos de renderizado
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonList, IonLabel, IonButton, IonNote, IonSpinner, IonIcon
  ],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  private readonly api = inject(SocialGoodService);
  private readonly router = inject(Router);
  protected readonly kpi = inject(KpiService);

  // 1. Estado manejado con Signals (Reactividad Fina)
  posts = signal<Post[]>([]);
  query = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string>('');

  // 2. Debounce para el input (BP 6.2)
  private searchSubject = new Subject<string>();

  // 3. Signal Computado para filtrado (BP 5.1): 
  // Se recalcula automáticamente solo cuando 'posts' o 'query' cambian.
  filtered = computed(() => {
    const q = this.query().toLowerCase();
    const data = this.posts();
    if (!q) return data;
    
    return data.filter(p => 
      p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    );
  });

  constructor() {
    // 4. Configuración del buscador con Debounce para proteger el KPI de CPU
    this.searchSubject.pipe(
      debounceTime(300),           // BP 6.2: Espera 300ms tras dejar de teclear
      distinctUntilChanged(),      // No procesa si el texto es idéntico
      takeUntilDestroyed()         // BP 9.2: Auto-cancelación de suscripción
    ).subscribe(val => {
      this.query.set(val);
      this.kpi.setMetric('renderItems', this.filtered().length);
    });
  }

  ngOnInit() {
    this.trackStartup();
    this.loadPosts();
  }

  private loadPosts() {
    this.loading.set(true);
    // BP 7.1: Una sola llamada controlada. El servicio se encarga del caché.
    this.api.getPosts().pipe(
      takeUntilDestroyed(),
      // finalize() para asegurar que loading pase a false siempre
    ).subscribe({
      next: (data) => {
        this.posts.set(data);
        this.kpi.setMetric('renderItems', data.length);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error cargando posts');
        this.loading.set(false);
      }
    });
  }

  onInput(ev: any) {
    const t0 = performance.now();
    const val = ev.target.value ?? '';
    
    // Enviamos al subject para el debounce, no bloqueamos el hilo con bucles dummy
    this.searchSubject.next(val);

    // KPI: Medimos cuánto tarda en reaccionar el handler (debe ser < 16ms para 60fps)
    this.kpi.addInputSample(performance.now() - t0);
  }

  openPost(p: Post) {
    // BP: Pasar solo el ID. Los datos ya estarán en el caché del servicio.
    this.router.navigate(['/detail'], { 
      queryParams: { id: p.id, title: p.title } 
    });
  }

  private trackStartup() {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const startup = nav ? performance.now() - nav.startTime : 0;
    this.kpi.setMetric('startupMs', Math.round(startup));
  }

  goSettings() {
    this.router.navigate(['/settings']);
  }
}
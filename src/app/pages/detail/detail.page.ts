import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonButton, IonNote, IonSpinner, IonButtons, IonBackButton, IonBadge, IonIcon 
} from '@ionic/angular/standalone';

import { SocialGoodService, Comment } from '../../core/services/social-good.service';
import { KpiService } from '../../core/metrics/kpi.service';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-detail',
  // 1. Rendimiento: OnPush evita que Angular re-compruebe la página si los inputs no cambian
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
    IonLabel, IonButton, IonNote, IonSpinner, IonButtons, IonBackButton, IonBadge, IonIcon
  ],
  templateUrl: './detail.page.html',
})
export class DetailPage implements OnInit {
  // 2. Inyección moderna con inject()
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(SocialGoodService);
  protected readonly kpi = inject(KpiService);

  // 3. Uso de Signals para un renderizado ultra-eficiente
  postId = signal<number>(0);
  title = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string>('');
  comments = signal<Comment[]>([]);

  constructor() {
    // BP 9.2: takeUntilDestroyed() cancela las suscripciones automáticamente al destruir el componente
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.postId.set(Number(params.get('id') ?? '0'));
    this.title.set(params.get('title') ?? '');

    this.loadComments();
  }

  private loadComments() {
    const t0 = performance.now();
    this.loading.set(true);

    // 4. Una sola suscripción controlada (BP 7.1)
    this.api.getComments(this.postId())
      .pipe(
        // Cancela automáticamente al salir de la vista (Evita Memory Leaks)
        takeUntilDestroyed(), 
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data) => {
          // BP 5.1: No inflamos la lista innecesariamente
          this.comments.set(data);
          
          // Actualizamos KPIs
          this.kpi.setMetric('renderItems', data.length);
          this.kpi.setMetric('forecastDataMs', Math.round(performance.now() - t0));
        },
        error: () => this.error.set('Error cargando comentarios')
      });
  }

  // 5. Optimizamos lógica: Ya no hay bucle dummy. 
  // Si fuera complejo, usaríamos un Memoized Pipe.
  back() {
    this.router.navigate(['/home']);
  }

  goSettings() {
    this.router.navigate(['/settings']);
  }
}
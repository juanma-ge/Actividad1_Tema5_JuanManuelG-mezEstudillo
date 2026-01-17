import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, shareReplay } from 'rxjs';
import { KpiService } from '../metrics/kpi.service';

// 1. Centralizamos tipos en interfaces (preferible sobre types para modelos)
export interface Post { userId: number; id: number; title: string; body: string; }
export interface Comment { postId: number; id: number; name: string; email: string; body: string; }

@Injectable({ providedIn: 'root' })
export class SocialGoodService {
  private readonly http = inject(HttpClient); // Uso de inject() (más limpio)
  private readonly kpi = inject(KpiService);
  
  private readonly API_URL = 'https://jsonplaceholder.typicode.com';

  // 2. Caché en memoria para los Posts
  // shareReplay(1) hace que los suscriptores nuevos reciban el último valor sin repetir la petición
  private postsCache$?: Observable<Post[]>;

  // 3. Caché para Comentarios usando un Map (evita peticiones duplicadas por ID)
  private commentsCache = new Map<number, Comment[]>();

  getPosts(): Observable<Post[]> {
    if (this.postsCache$) {
      this.kpi.incCacheHit(); // KPI: Cache Hit Ratio mejorado
      return this.postsCache$;
    }

    this.kpisBeforeRequest();
    this.postsCache$ = this.http.get<Post[]>(`${this.API_URL}/posts`).pipe(
      shareReplay(1) // Mantiene los datos vivos para la siguiente llamada
    );
    
    return this.postsCache$;
  }

  getComments(postId: number): Observable<Comment[]> {
    // 4. Estrategia de Cache para peticiones parametrizadas (BP 7.2)
    if (this.commentsCache.has(postId)) {
      this.kpi.incCacheHit();
      return of(this.commentsCache.get(postId)!);
    }

    this.kpisBeforeRequest();
    return this.http.get<Comment[]>(`${this.API_URL}/posts/${postId}/comments`).pipe(
      tap(comments => this.commentsCache.set(postId, comments)) // Guardamos en el Map
    );
  }

  // 5. Centralización de métricas (Clean Code)
  private kpisBeforeRequest() {
    this.kpi.incHttp(); // KPI: Total Requests
    this.kpi.incCacheMiss();
  }

  /**
   * Método para invalidar el caché (BP 8.3: Manual Refresh)
   */
  clearCache() {
    this.postsCache$ = undefined;
    this.commentsCache.clear();
  }
}
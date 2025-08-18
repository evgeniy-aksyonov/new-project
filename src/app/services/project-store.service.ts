import { computed, effect, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export enum Status {
  Active = 'active',
  Paused = 'paused',
  Done = 'done',
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  deadline: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectStoreService {
  projects = signal<Project[]>([]);
  query = signal('');
  statusFilter = signal<Status | ''>('');
  favoriteIds = signal<Set<string>>(new Set());
  filtered = computed(() => {
    const q = this.query().toLowerCase();
    const status = this.statusFilter();
    return this.projects().filter((p) => {
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q);
      const matchesStatus = !status || p.status === status;

      return matchesQuery && matchesStatus;
    });
  });

  constructor(private http: HttpClient) {
    this.loadFavorites();
    this.loadProjects();
    effect(() => {
      this.syncToLocalStorage();
    });
  }

  private loadProjects() {
    this.http.get<Project[]>('assets/projects.json').subscribe({
      next: (data) => {
        this.projects.set(data);
      },
      error: (err) => {
        console.error('Failed to load projects:', err);
      },
    });
  }

  search(q: string) {
    this.query.set(q);
  }

  filterByStatus(s: Status) {
    this.statusFilter.set(s);
  }

  toggleFavorite(id: string) {
    const favs = new Set(this.favoriteIds());

    if (favs.has(id)) {
      favs.delete(id);
    } else {
      favs.add(id);
    }

    this.favoriteIds.set(favs);
  }

  byId(id: string) {
    return this.projects().find((p) => p.id === id);
  }

  getFavorites(): Signal<Project[]> {
    return computed(() => this.projects().filter((p) => this.favoriteIds().has(p.id)));
  }

  getFiltered(): Signal<Project[]> {
    return this.filtered;
  }

  private syncToLocalStorage() {
    const ids = [...this.favoriteIds()];
    localStorage.setItem('favoriteIds', JSON.stringify(ids));
  }

  private loadFavorites() {
    const data = localStorage.getItem('favoriteIds');

    if (data) {
      try {
        const ids = JSON.parse(data);
        this.favoriteIds.set(new Set(ids));
      } catch (error) {
        console.error(error);
      }
    }
  }
}

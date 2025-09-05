import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Project, ProjectStoreService } from '../../services/project-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  project = input.required<Project>();
  store = inject(ProjectStoreService);
  router = inject(Router);

  get isFavorite() {
    return this.store.favoriteIds().has(this.project().id);
  }

  toggleFavorite(id: string) {
    this.store.toggleFavorite(id);
  }

  goToDetails(id: string) {
    this.router.navigate(['/project', id]);
  }
}

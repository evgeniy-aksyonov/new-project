import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectStoreService } from '../../services/project-store.service';
import { Card } from '../card/card';

@Component({
  selector: 'app-favorites',
  imports: [Card],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites {
  store = inject(ProjectStoreService);

  get favoritesCount() {
    return this.store.getFavorites()().length;
  }
}

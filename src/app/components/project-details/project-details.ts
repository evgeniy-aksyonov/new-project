import { ActivatedRoute } from '@angular/router';
import { Project, ProjectStoreService } from './../../services/project-store.service';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-details',
  imports: [],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetails implements OnInit {
  project: Project | undefined = undefined;
  route: ActivatedRoute = inject(ActivatedRoute);
  store = inject(ProjectStoreService);
  isFavorite = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.project = id ? this.store.byId(id) : undefined;
    this.isFavorite = this.project ? this.store.favoriteIds().has(this.project.id) : false;
  }

  toggleFavorite(id: string) {
    this.store.toggleFavorite(id);
    this.isFavorite = this.project ? this.store.favoriteIds().has(this.project.id) : false;
  }
}

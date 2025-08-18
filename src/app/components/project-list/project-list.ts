import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { ProjectStoreService } from '../../services/project-store.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../card/card';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-project-list',
  imports: [Card, CommonModule, ReactiveFormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectList implements OnDestroy {
  store = inject(ProjectStoreService);
  searchControl = new FormControl('');
  router = inject(Router);

  private searchSub = this.searchControl.valueChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((q) => {
      this.store.search(q ?? '');
    });

  ngOnDestroy() {
    this.searchSub.unsubscribe();
    this.store.search('');
  }

  filterByStatus(event: Event) {
    const status = (event.target as any)?.value; // check type
    this.store.filterByStatus(status);
  }
}

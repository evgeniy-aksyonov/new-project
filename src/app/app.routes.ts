import { Routes } from '@angular/router';
import { ProjectList } from './components/project-list/project-list';
import { Favorites } from './components/favorites/favorites';
import { ProjectDetails } from './components/project-details/project-details';

export const routes: Routes = [
  { path: '', component: ProjectList },
  { path: 'favorites', component: Favorites },
  { path: 'project/:id', component: ProjectDetails },
];

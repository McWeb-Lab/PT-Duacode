import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadComponent: () => import('./Users/list/list.component').then(module=> module.ListComponent)
    }

];

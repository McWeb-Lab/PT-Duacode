import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/Users/list/list.component').then(
        (module) => module.ListComponent
      ),
  },

  {
    path: 'list',
    loadComponent: () =>
      import('./components/Users/list/list.component').then(
        (module) => module.ListComponent
      ),
  },

  {
    path: 'user-data/:id',
    loadComponent: () =>
      import('./components/Users/user-data/user-data.component').then(
        (module) => module.UserDataComponent
      ),
  },

  {
    path: 'new-user',
    loadComponent: () =>
      import('./components/Users//new-user/new-user.component').then(
        (module) => module.NewUserComponent
      ),
  },

  {
    path: 'edit-user/:id',
    loadComponent: () =>
      import('./components/Users/edit-user/edit-user.component').then(
        (module) => module.EditUserComponent
      ),
  }
];

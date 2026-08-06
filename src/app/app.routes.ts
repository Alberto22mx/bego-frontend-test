import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/pages/orders-page/orders-page').then(
        ({ OrdersPage }) => OrdersPage,
      ),
    title: 'Pedidos | BeGo',
  },
  {
    path: '**',
    redirectTo: 'orders',
  },
];

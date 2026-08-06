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
    path: 'orders/:orderId',
    loadComponent: () =>
      import('./features/orders/pages/order-detail-page/order-detail-page').then(
        ({ OrderDetailPage }) => OrderDetailPage,
      ),
    title: 'Detalle del pedido | BeGo',
  },
  {
    path: '**',
    redirectTo: 'orders',
  },
];

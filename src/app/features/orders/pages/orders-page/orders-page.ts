import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrderSummary } from '../../../../core/models/order.model';
import { OrdersService } from '../../../../core/services/orders.service';

type OrdersPageStatus = 'loading' | 'success' | 'empty' | 'error';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {
  private readonly ordersService = inject(OrdersService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly orders = signal<readonly OrderSummary[]>([]);
  protected readonly status = signal<OrdersPageStatus>('loading');

  constructor() {
    this.loadOrders();
  }

  protected retry(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.status.set('loading');

    this.ordersService
      .getUpcomingOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.status.set(orders.length === 0 ? 'empty' : 'success');
        },
        error: () => {
          this.orders.set([]);
          this.status.set('error');
        },
      });
  }
}

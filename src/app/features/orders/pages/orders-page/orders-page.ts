import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrderSummary } from '../../../../core/models/order.model';
import { OrdersService } from '../../../../core/services/orders.service';
import { LanguageService } from '../../../../core/services/language.service';
import { OrderList } from '../../components/order-list/order-list';
import { OrdersTabs } from '../../components/orders-tabs/orders-tabs';

type OrdersPageStatus = 'loading' | 'success' | 'empty' | 'error';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [OrderList, OrdersTabs],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {
  private readonly ordersService = inject(OrdersService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject(LanguageService);

  protected readonly orders = signal<readonly OrderSummary[]>([]);
  protected readonly status = signal<OrdersPageStatus>('loading');
  protected readonly searchTerm = signal('');
  protected readonly filteredOrders = computed(() => {
    const query = normalizeOrderNumber(this.searchTerm());
    return query
      ? this.orders().filter((order) => normalizeOrderNumber(order.orderNumber).includes(query))
      : this.orders();
  });

  constructor() {
    this.loadOrders();
  }

  protected retry(): void {
    this.loadOrders();
  }

  protected updateSearch(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) {
      this.searchTerm.set(input.value);
    }
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

function normalizeOrderNumber(value: string): string {
  return value.replaceAll('#', '').replaceAll(/\s/g, '').toUpperCase();
}

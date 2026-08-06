import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { OrderDetail } from '../../../../core/models/order.model';
import { OrdersService } from '../../../../core/services/orders.service';
import { LanguageService, TranslationKey } from '../../../../core/services/language.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { OrderTimeline } from '../../components/order-timeline/order-timeline';

type OrderDetailStatus = 'loading' | 'success' | 'error';
type DestinationType = 'pickup' | 'dropoff';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [Avatar, DatePipe, OrderTimeline],
  templateUrl: './order-detail-page.html',
  styleUrl: './order-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly orderId = this.route.snapshot.paramMap.get('orderId');
  protected readonly i18n = inject(LanguageService);

  protected readonly order = signal<OrderDetail | null>(null);
  protected readonly status = signal<OrderDetailStatus>('loading');
  protected readonly errorKey = signal<TranslationKey>('loadDetailError');
  protected readonly pickupExpanded = signal(true);
  protected readonly trackingMessageVisible = signal(false);
  protected readonly selectedDestinationType = signal<DestinationType>('pickup');
  protected readonly pickupDestination = computed(() => this.order()?.destinations.at(0) ?? null);
  protected readonly dropoffDestination = computed(() => {
    const destinations = this.order()?.destinations ?? [];
    return destinations.length > 1 ? (destinations.at(-1) ?? null) : null;
  });
  protected readonly selectedDestination = computed(() =>
    this.selectedDestinationType() === 'pickup'
      ? this.pickupDestination()
      : this.dropoffDestination(),
  );

  constructor() {
    this.loadOrder();
  }

  protected retry(): void {
    this.loadOrder();
  }

  protected togglePickupData(): void {
    this.pickupExpanded.update((expanded) => !expanded);
  }

  protected selectDestination(type: DestinationType): void {
    if (type === 'pickup' ? this.pickupDestination() : this.dropoffDestination()) {
      this.selectedDestinationType.set(type);
    }
  }

  protected selectedDataTitle(): TranslationKey {
    return this.selectedDestinationType() === 'pickup' ? 'pickupData' : 'dropoffData';
  }

  protected showTrackingLimitation(): void {
    this.trackingMessageVisible.set(true);
  }

  private loadOrder(): void {
    if (!this.orderId) {
      this.showError('detailUnavailable');
      return;
    }

    this.status.set('loading');

    this.ordersService
      .getOrderDetail()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order) => {
          if (order.id !== this.orderId) {
            this.showError('detailUnavailable');
            return;
          }

          this.order.set(order);
          this.status.set('success');
        },
        error: () => this.showError('loadDetailError'),
      });
  }

  private showError(key: TranslationKey): void {
    this.order.set(null);
    this.errorKey.set(key);
    this.status.set('error');
  }
}

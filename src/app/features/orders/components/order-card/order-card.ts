import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { OrderStatusKey, OrderSummary } from '../../../../core/models/order.model';
import { LanguageService, TranslationKey } from '../../../../core/services/language.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { OrderRoute } from '../order-route/order-route';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [Avatar, OrderRoute, RouterLink],
  templateUrl: './order-card.html',
  styleUrl: './order-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCard {
  readonly order = input.required<OrderSummary>();
  private readonly destroyRef = inject(DestroyRef);
  private readonly currentTime = signal(Date.now());
  protected readonly i18n = inject(LanguageService);
  protected readonly remainingPickupTime = computed(() =>
    formatRemainingPickupTime(this.order().startsAt.getTime() - this.currentTime()),
  );
  protected readonly canNavigate = computed(
    () => this.order().startsAt.getTime() <= this.currentTime(),
  );

  constructor() {
    const timerId = setInterval(() => this.currentTime.set(Date.now()), 1_000);
    this.destroyRef.onDestroy(() => clearInterval(timerId));
  }

  protected isReadyForPickup(order: OrderSummary): boolean {
    // The mock has no explicit pickup-ready flag. An assigned order whose first stop
    // enables navigation is treated as ready for pickup.
    return order.statusCode === 1 && order.destinations.at(0)?.navigationAvailable === true;
  }

  protected stopActionPropagation(event: Event): void {
    event.stopPropagation();
  }

  protected navigate(event: Event): void {
    event.stopPropagation();
    console.log('Navigate');
  }

  protected statusTranslationKey(status: OrderStatusKey): TranslationKey {
    const translationKeys: Readonly<Record<OrderStatusKey, TranslationKey>> = {
      assigned: 'statusAssigned',
      inTransit: 'statusInTransit',
      completed: 'statusCompleted',
      onHold: 'statusOnHold',
      cancelled: 'statusCancelled',
      unknown: 'statusUnknown',
    };

    return translationKeys[status];
  }
}

export function formatRemainingPickupTime(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1_000));
  const hours = Math.floor(totalSeconds / 3_600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

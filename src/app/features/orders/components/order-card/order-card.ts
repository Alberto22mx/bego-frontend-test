import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OrderSummary } from '../../../../core/models/order.model';
import { LanguageService } from '../../../../core/services/language.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { OrderRoute } from '../order-route/order-route';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [Avatar, DatePipe, OrderRoute, RouterLink],
  templateUrl: './order-card.html',
  styleUrl: './order-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCard {
  readonly order = input.required<OrderSummary>();
  protected readonly i18n = inject(LanguageService);

  protected isReadyForPickup(order: OrderSummary): boolean {
    // The mock has no explicit pickup-ready flag. An assigned order whose first stop
    // enables navigation is treated as ready for pickup.
    return order.statusCode === 1 && order.destinations.at(0)?.navigationAvailable === true;
  }

  protected stopActionPropagation(event: Event): void {
    event.stopPropagation();
  }
}

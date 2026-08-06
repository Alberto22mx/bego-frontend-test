import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OrderSummary } from '../../../../core/models/order.model';
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
}

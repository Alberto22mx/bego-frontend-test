import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OrderSummary } from '../../../../core/models/order.model';
import { OrderCard } from '../order-card/order-card';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [OrderCard],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderList {
  readonly orders = input.required<readonly OrderSummary[]>();
}

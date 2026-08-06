import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OrderDestination } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-route',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './order-route.html',
  styleUrl: './order-route.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderRoute {
  readonly destinations = input.required<readonly OrderDestination[]>();
  protected readonly pickup = computed(() => this.destinations().at(0) ?? null);
  protected readonly dropoff = computed(() => this.destinations().at(-1) ?? null);
}

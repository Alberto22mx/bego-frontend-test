import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OrderTimelineStep } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-timeline',
  standalone: true,
  templateUrl: './order-timeline.html',
  styleUrl: './order-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTimeline {
  readonly steps = input.required<readonly OrderTimelineStep[]>();
}

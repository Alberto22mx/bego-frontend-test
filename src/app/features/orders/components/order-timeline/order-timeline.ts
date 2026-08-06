import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { OrderTimelineStep } from '../../../../core/models/order.model';
import { LanguageService, TranslationKey } from '../../../../core/services/language.service';

const TIMELINE_KEYS: readonly TranslationKey[] = [
  'createdOrder',
  'acceptedOrder',
  'pickupSetUp',
  'pickupCompleted',
];

@Component({
  selector: 'app-order-timeline',
  standalone: true,
  templateUrl: './order-timeline.html',
  styleUrl: './order-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTimeline {
  readonly steps = input.required<readonly OrderTimelineStep[]>();
  protected readonly i18n = inject(LanguageService);

  protected stepLabel(index: number, fallback: string): string {
    const key = TIMELINE_KEYS[index];
    return key ? this.i18n.translate(key) : fallback;
  }
}

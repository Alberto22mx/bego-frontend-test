import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-orders-tabs',
  standalone: true,
  templateUrl: './orders-tabs.html',
  styleUrl: './orders-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersTabs {
  protected readonly i18n = inject(LanguageService);
}

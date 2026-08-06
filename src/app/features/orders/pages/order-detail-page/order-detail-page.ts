import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  templateUrl: './order-detail-page.html',
  styleUrl: './order-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailPage {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-orders-tabs',
  standalone: true,
  templateUrl: './orders-tabs.html',
  styleUrl: './orders-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersTabs {}

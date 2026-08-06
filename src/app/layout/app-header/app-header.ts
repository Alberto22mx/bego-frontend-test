import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }
}

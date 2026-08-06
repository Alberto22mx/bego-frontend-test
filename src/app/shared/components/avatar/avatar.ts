import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  readonly imageUrl = input<string | null>(null);
  readonly label = input('Conductor');
  protected readonly imageFailed = signal(false);

  protected handleImageError(): void {
    this.imageFailed.set(true);
  }
}

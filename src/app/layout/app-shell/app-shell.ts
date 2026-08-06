import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppHeader } from '../app-header/app-header';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [AppHeader, RouterOutlet],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {}

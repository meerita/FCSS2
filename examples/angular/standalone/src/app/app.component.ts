// @file examples/angular/standalone/src/app/app.component.ts
// @description Root component for the FCSS Angular standalone fixture.
// @layer presentation
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  isExpanded = false;

  toggle(): void {
    this.isExpanded = !this.isExpanded;
  }
}

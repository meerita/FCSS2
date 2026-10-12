// @file examples/angular/workspace/projects/app1/src/app/app.component.ts
// @description Root component for workspace app1 — uses FCSS classes.
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
  title = 'App 1 — FCSS enabled';
}

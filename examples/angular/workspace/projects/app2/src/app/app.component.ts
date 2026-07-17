// @file examples/angular/workspace/projects/app2/src/app/app.component.ts
// @description Root component for workspace app2 — no FCSS (isolation verification).
// @layer presentation
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<h1>App 2 — FCSS not installed</h1>`,
})
export class AppComponent {
  title = 'App 2 — FCSS not installed';
}

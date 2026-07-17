// @file examples/angular/standalone/src/main.ts
// @description Bootstrap entry point for the FCSS Angular standalone fixture.
// @layer presentation
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err: unknown) => console.error(err));

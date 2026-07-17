// @file examples/angular/workspace/projects/app1/src/main.ts
// @description Bootstrap for the FCSS workspace example app1 (FCSS enabled).
// @layer presentation
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err: unknown) => console.error(err));

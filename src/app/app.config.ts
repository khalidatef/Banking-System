import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions(), withEnabledBlockingInitialNavigation()),
    provideClientHydration(), provideAnimationsAsync(),
    
  ],
};

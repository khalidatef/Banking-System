import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { Component } from '@angular/core';

// Mock component for routing
@Component({
  template: '<div>Mock Component</div>',
  standalone: true
})
export class MockComponent {}

// Common test providers that can be used in component tests
export const commonTestProviders = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([
    { path: '', component: MockComponent },
    { path: '**', component: MockComponent }
  ]),
  provideLocationMocks()
];

// Test environment configuration
export const testConfig = {
  providers: commonTestProviders
};
